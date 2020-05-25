import Writable from './writable.ts';
import { exists } from './fs.ts';
import { WriterOptions } from './interface.ts';

export default class Writer {
  private maxBytes?: number;
  private maxBackupCount?: number;
  private map = new Map();

  private infoPath?: string;
  private warnPath?: string;
  private errorPath?: string;

  constructor({ maxBytes, maxBackupCount }: WriterOptions) {
    if (maxBytes !== undefined && maxBytes <= 0) {
      throw new Error("maxBytes cannot be less than 1");
    }
    this.maxBytes = maxBytes;

    if (maxBackupCount === undefined) return;
    if (!maxBytes) {
      throw new Error("maxBackupCount must work with maxBytes");
    }
    if (maxBackupCount <= 0) {
      throw new Error("maxBackupCount cannot be less than 1");
    }
    this.maxBackupCount = maxBackupCount;
  }

  private async newWriter(path: string) {
    const writer = new Writable(path);
    await writer.setup();
    this.map.set(path, writer);
    return writer;
  }

  async write(path: string, msg: Uint8Array): Promise<void> {
    const msgByteLength = msg.byteLength;

    if (this.map.has(path)) {
      const writer = this.map.get(path);
      const currentSize = writer.currentSize;
      const size = currentSize + msgByteLength;
      if (this.maxBytes && size > this.maxBytes) {
        writer.close();
        this.rotateLogFiles(path);
        const _writer = await this.newWriter(path);
        await _writer.write(msg);
      } else {
        await writer.write(msg);
      }
      return;
    }

    if (path.includes('info')) {
      if (this.infoPath) this.map.get(this.infoPath).close();
      this.infoPath = path;
    } else if (path.includes('warn')) {
      if (this.warnPath) this.map.get(this.warnPath).close();
      this.warnPath = path;
    } else if (path.includes('error')) {
      if (this.errorPath) this.map.get(this.errorPath).close();
      this.errorPath = path;
    } else {
      throw new Error('Unexpected file path');
    }

    const writer = await this.newWriter(path);
    await writer.write(msg);
  }

  async rotateLogFiles(path: string): Promise<void> {
    if (this.maxBackupCount) {
      for (let i = this.maxBackupCount - 1; i >= 0; i--) {
        const source = path + (i === 0 ? "" : "." + i);
        const dest = path + "." + (i + 1);
        const exist = await exists(source);
        if (exist) {
          await Deno.rename(source, dest);
        }
      }
    } else {
      const dest = path + "." + Date.now();
      await Deno.rename(path, dest);
    }
  }
}