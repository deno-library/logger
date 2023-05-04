import Logger from "../logger.ts";

const logger = new Logger();

// console only
logger.info("i am from consoleLogger", { name: "zfx" });
logger.warn("i am from consoleLogger", 1, "any");
logger.error("i am from consoleLogger", new Error("test"));
