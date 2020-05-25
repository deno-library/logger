const { open } = Deno;
type File = Deno.File;

export default class Writable {
  protected file!: File;
  private path: string;
  currentSize = 0;

  constructor(path: string) {
    this.path = path
  }

  async setup(): Promise<void> {
    this.file = await open(this.path, {
      create: true,
      append: true,
      write: true
    });
    this.currentSize = (await Deno.stat(this.path)).size;
  }

  async write(msg: Uint8Array, retry = true) {
    try {
      await Deno.writeAll(this.file, msg);
    } catch (error) {
      if (!retry) Promise.reject(error);
      await this.setup();
      await this.write(msg, false);
    }
    this.currentSize += msg.byteLength;
  }

  close(): Promise<void> {
    this.file.close();
    return Promise.resolve();
  }
}