import { writeAll } from "./deps.ts";

const { open, close, stat } = Deno;
type File = Deno.FsFile;

/**
 * Writable class
 */
export default class Writable {
  protected file!: File;
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
    this.file = await open(this.path, {
      create: true,
      append: true,
      write: true,
    });
    this.currentSize = (await stat(this.path)).size;
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
    // this.file.close();
    close(this.file.rid);
  }
}
