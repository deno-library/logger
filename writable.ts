import { writeAll } from "./deps.ts";

/**
 * Writable class
 */
export default class Writable {
  protected file!: Deno.FsFile;
  private path: string;
  currentSize = 0;

  /**
   * Writable constructor
   * @param path
   */
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Setup writable file
   */
  async setup(): Promise<void> {
    this.file = await Deno.open(this.path, {
      create: true,
      append: true,
      write: true,
    });
    this.currentSize = (await Deno.stat(this.path)).size;
  }

  /**
   * Write message to file
   * @param msg
   */
  async write(msg: Uint8Array): Promise<void> {
    await writeAll(this.file, msg);
    this.currentSize += msg.byteLength;
  }

  /**
   * Close file
   */
  close(): void {
    this.file.close();
  }
}
