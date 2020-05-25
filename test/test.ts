import Logger from '../logger.ts';

const logger = new Logger();

logger.info('i am from info');
logger.warn('i am from warn');
logger.error('i am from error');

await logger.initFileLogger('../log');

logger.info('i am from info');
logger.warn('i am from warn');
logger.error('i am from error');