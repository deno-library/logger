const isTTY = Deno.isatty(Deno.stdout.rid);

export async function stdout(msg: Uint8Array): Promise<void> {
  await Deno.writeAll(Deno.stdout, msg);
}

export default function log(...args: unknown[]): void {
  console.log(...args);
}

function noop(): void {}

export const stdoutOnlyTty = isTTY ? stdout : noop;
export const logOnlyTty = isTTY ? log : noop;
