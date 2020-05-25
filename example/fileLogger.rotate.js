import Logger from "https://raw.githubusercontent.com/fuxingZhang/deno-logger/master/logger.ts";

const logger = new Logger();
await logger.initFileLogger('../log', {
  rotate: true
});
logger.disableConsole();

// file only
logger.info(['i am from fileLogger', 1], { name: 'zfx' });
