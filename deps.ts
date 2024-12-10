export {
  cyan,
  gray,
  green,
  red,
  stripAnsiCode,
  yellow,
} from "jsr:@std/fmt@1.0.3/colors";

/**
 * use a local copy of UNSTABLE { type Writer, writeAll } from "jsr:@std/io@0.225.0/write-all";
 */
export interface Writer {
  /** Writes `p.byteLength` bytes from `p` to the underlying data stream. It
   * resolves to the number of bytes written from `p` (`0` <= `n` <=
   * `p.byteLength`) or reject with the error encountered that caused the
   * write to stop early. `write()` must reject with a non-null error if
   * would resolve to `n` < `p.byteLength`. `write()` must not modify the
   * slice data, even temporarily.
   *
   * Implementations should not retain a reference to `p`.
   */
  write(p: Uint8Array): Promise<number>;
}

export async function writeAll(writer: Writer, data: Uint8Array) {
  let nwritten = 0;
  while (nwritten < data.length) {
    nwritten += await writer.write(data.subarray(nwritten));
  }
}
export { exists } from "jsr:@std/fs@^1.0.6";

export { stat } from "node:fs/promises";
