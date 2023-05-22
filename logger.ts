import stdout from "./stdout.ts";
import Writer from "./writer.ts";
import eol from "./eol.ts";
import { exists } from "./fs.ts";
import Dater from "./date.ts";
import { green, red, stripColor, yellow } from "./deps.ts";
import { fileLoggerOptions, LoggerWriteOptions } from "./interface.ts";
import Types from "./types.ts";
const { inspect } = Deno;

const noop = () => void {};

export default class Logger {
  private stdout = stdout;
  private encoder = new TextEncoder();
  private writer?: Writer;
  private rotate = false;
  private dir?: string;

  #info = this.info;
  #warn = this.warn;
  #error = this.error;
  #write = this.write;

  private format(...args: unknown[]): Uint8Array {
    const msg = args.map((arg) => typeof arg === "string" ? arg : inspect(arg))
      .join(" ");
    // const msg = args.map(arg => inspect(arg, {
    //   showHidden: true,
    //   depth: 4,
    //   colors: true,
    //   indentLevel: 2
    // })).join('');

    return this.encoder.encode(stripColor(msg) + eol);
  }

  info(...args: unknown[]): void {
    args = [this.getInfo(), ...args];
    this.stdout(...args);
    if (this.dir) {
      this.write({
        dir: this.dir,
        type: Types.INFO,
        args,
      });
    }
  }

  warn(...args: unknown[]): void {
    args = [this.getWarn(), ...args];
    this.stdout(...args);
    if (this.dir) {
      this.write({
        dir: this.dir,
        type: Types.WARN,
        args,
      });
    }
  }

  error(...args: unknown[]): void {
    args = [this.getError(), ...args];
    this.stdout(...args);
    if (this.dir) {
      this.write({
        dir: this.dir,
        type: Types.ERROR,
        args,
      });
    }
  }

  private write({ dir, type, args }: LoggerWriteOptions): void {
    const date = this.getDate();
    const filename = this.rotate === true ? `${date}_${type}` : type;
    const path = `${dir}/${filename}.log`;
    const msg = this.format(...args);
    this.writer!.write({ path, msg, type });
  }

  async initFileLogger(
    dir: string,
    options: fileLoggerOptions = {},
  ): Promise<void> {
    const exist = await exists(dir);
    if (!exist) {
      stdout(`${this.getWarn()} Log folder does not exist`);
      try {
        await Deno.mkdirSync(dir, { recursive: true });
        stdout(`${this.getInfo()} Log folder create success`);
      } catch (error) {
        stdout(`${this.getError()} Log folder create failed: ` + error);
      }
    }
    const { rotate, maxBytes, maxBackupCount } = options;
    if (rotate === true) this.rotate = true;
    this.dir = dir;
    this.writer = new Writer({
      maxBytes,
      maxBackupCount,
    });
  }

  disable(type?: "info" | "warn" | "error"): void {
    if (!type) {
      this.info = noop;
      this.warn = noop;
      this.error = noop;
      return;
    }
    if (type === "info") {
      this.info = noop;
      return;
    }
    if (type === "warn") {
      this.warn = noop;
      return;
    }
    if (type === "error") {
      this.error = noop;
      return;
    }
  }

  enable(type?: "info" | "warn" | "error"): void {
    if (!type) {
      this.info = this.#info;
      this.warn = this.#warn;
      this.error = this.#error;
    }
    if (type === "info") {
      this.info = this.#info;
      return;
    }
    if (type === "warn") {
      this.warn = this.#warn;
      return;
    }
    if (type === "error") {
      this.error = this.#error;
      return;
    }
  }

  disableConsole(): void {
    this.stdout = noop;
  }

  enableConsole(): void {
    this.stdout = stdout;
  }

  disableFile(): void {
    this.write = noop;
  }

  enableFile(): void {
    this.write = this.#write;
  }

  private getInfo(): string {
    return green(`${this.getNow()} Info:`);
  }

  private getWarn(): string {
    return green(this.getNow()) + yellow(` Warn:`);
  }

  private getError(): string {
    return green(this.getNow()) + red(` Error:`);
  }

  private getNow(): string {
    return new Dater().toLocaleString();
  }

  private getDate(): string {
    return new Dater().toLocaleDateString();
  }
}
