export interface WriterOptions {
  maxBytes?: number,
  maxBackupCount?: number
}

export interface fileLoggerOptions extends WriterOptions {
  rotate?: boolean;
}

export interface LoggerWriteOptions {
  dir: string;
  type: string;
  args: unknown[];
}
