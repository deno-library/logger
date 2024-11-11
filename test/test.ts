const { test } = Deno;
import { assert, assertRejects } from "../dev_deps.ts";
import Logger from "../logger.ts";

const maxBytesError = "maxBytes cannot be less than 1";
test(maxBytesError, async function () {
  await assertRejects(
    async () => {
      const logger = new Logger();
      logger.disableConsole();
      await logger.initFileLogger("../log", {
        maxBytes: 0,
      });
    },
    Error,
    maxBytesError,
  );
});

const workWithError = "maxBackupCount must work with maxBytes";
test(workWithError, async function () {
  await assertRejects(
    async () => {
      const logger = new Logger();
      logger.disableConsole();
      await logger.initFileLogger("../log", {
        maxBackupCount: 10,
      });
    },
    Error,
    workWithError,
  );
});

const lessError = "maxBackupCount cannot be less than 1";
test(lessError, async function () {
  await assertRejects(
    async () => {
      const logger = new Logger();
      logger.disableConsole();
      await logger.initFileLogger("../log", {
        maxBytes: 10 * 2014,
        maxBackupCount: 0,
      });
      assert(false);
    },
    Error,
    lessError,
  );
});
