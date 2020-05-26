export interface WriterConstructor {
  maxBytes?: number,
  maxBackupCount?: number
}

export interface WriterWrite {
  path: string,
  msg: Uint8Array,
  type: string
}

export interface fileLoggerOptions extends WriterConstructor {
  rotate?: boolean;
}

export interface LoggerWriteOptions {
  dir: string;
  type: string;
  args: unknown[];
}
