import Logger from "../logger.ts";

const logger = new Logger();
await logger.initFileLogger("./log");
logger.disableConsole();

// file only
logger.info(["i am from fileLogger", 1], { name: "info" });
logger.warn({ name: "warn" }, "i am from fileLogger", [1, [1, 2]]);
logger.error("i am from fileLogger", [1, 2], { name: "error" });
