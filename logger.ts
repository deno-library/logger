import stdout from './stdout.ts';
import Writer from './writer.ts';
import eol from './eol.ts';
import { exists } from './fs.ts';
import Dater from './date.ts';
import {
  red,
  green,
  yellow,
} from "https://deno.land/std@0.50.0/fmt/colors.ts";
import {
  fileLoggerOptions,
  LoggerWriteOptions
} from './interface.ts';
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
    const msg = args.map(arg => inspect(arg)).join('');
    // const msg = args.map(arg => inspect(arg, {
    //   showHidden: true,
    //   depth: 4,
    //   colors: true,
    //   indentLevel: 2
    // })).join('');
    return this.encoder.encode(msg + eol);
  }

  info(...args: unknown[]) {
    this.stdout(this.getInfo(), ...args);
    if (this.dir) {
      this.write({
        dir: this.dir,
        type: 'info',
        args
      });
    }
  }

  warn(...args: unknown[]) {
    this.stdout(this.getWarn(), ...args);
    if (this.dir) {
      this.write({
        dir: this.dir,
        type: 'warn',
        args
      });
    }
  }

  error(...args: unknown[]) {
    this.stdout(this.getError(), ...args);
    if (this.dir) {
      this.write({
        dir: this.dir,
        type: 'error',
        args
      });
    }
  }

  private write({ dir, type, args }: LoggerWriteOptions) {
    const date = this.getDate();
    const filename = this.rotate === true ? `${date}_${type}` : type;
    const path = `${dir}/${filename}.log`;
    const msg = this.format(`[${this.getNow()}] `, ...args);
    this.writer!.write(path, msg);
  }

  async initFileLogger(dir: string, options: fileLoggerOptions = {}): Promise<void> {
    const exist = await exists(dir);
    if (!exist) {
      stdout(`${this.getWarn()} Log folder does not exist`);
      try {
        await Deno.mkdirSync(dir, { recursive: true });
        stdout(`${this.getInfo()} Log folder create success`);
      } catch (error) {
        stdout(`${this.getError()} Log folder create failed`);
      }
    }
    const { rotate, maxBytes, maxBackupCount } = options;
    if (rotate === true) this.rotate = true;
    this.dir = dir;
    this.writer = new Writer({
      maxBytes,
      maxBackupCount
    });
  }

  disable() {
    this.info = noop;
    this.warn = noop;
    this.error = noop;
  }

  enable() {
    this.info = this.#info;
    this.warn = this.#warn;
    this.error = this.#error;
  }

  disableConsole() {
    this.stdout = noop;
  }

  enableConsole() {
    this.stdout = stdout;
  }

  disableFile() {
    this.write = noop;
  }

  enableFile() {
    this.write = this.#write;
  }

  private getInfo() {
    return green(`${this.getNow()} Info:`);
  }

  private getWarn() {
    return green(this.getNow()) + yellow(` Warn:`);
  }

  private getError() {
    return green(this.getNow()) + red(` Error:`);
  }

  private getNow() {
    return new Dater().toLocaleString();
  }

  private getDate() {
    return new Dater().toLocaleDateString();
  }
}