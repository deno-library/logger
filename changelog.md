## Changelog

### v1.1.1 - 2023.05.19

- New build / deployement script
- Update doc

### v1.1.0 - 2023.05.04

Remove useless parameter and optimize fileLogger

```diff
interface fileLoggerOptions {
  rotate?: boolean;  // cut by day
- now?: boolean; // print datetime or not
  maxBytes?: number, // the maximum size in bytes that the log file can grow to before rolling over to a new one
  maxBackupCount?: number // maxBackupCount must work with maxBytes
}
```

### v1.0.3 - 2023.05.04

[update code to support modern Deno](https://github.com/deno-library/logger/pull/4).
