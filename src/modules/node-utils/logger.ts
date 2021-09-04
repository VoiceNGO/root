import path from 'path';
import { version } from 'package.json';

import winston from 'winston';
const {
  createLogger,
  format: {
    colorize: colorizeFormat,
    combine: combineFormats,
    json: jsonFormat,
    simple: simpleFormat,
    timestamp: timestampFormat,
  },
  transports: { File: FileTransport, Console: ConsoleTransport },
} = winston;

const LOG_FOLDER = '/var/log/voice';
const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_NAMESPACE = 'DEFAULT';
const IS_TEST_RUNNING = process.env.NODE_ENV === 'test';

function getDefaultMeta(namespace: string) {
  return { version, namespace };
}

function getTestLogger() {
  return createLogger({});
}

function getFileTransport(filename: string, level = DEFAULT_LOG_LEVEL) {
  const absoluteFilePath = path.resolve(LOG_FOLDER, filename);

  return new FileTransport({
    filename: absoluteFilePath,
    level,
  });
}

function getLogger() {
  const consoleTransport = new ConsoleTransport({
    format: combineFormats(timestampFormat(), colorizeFormat(), simpleFormat()),
    level: 'debug',
  });

  const errorTransport = getFileTransport('errors.log', 'error');
  const exceptionsTransport = getFileTransport('exceptions.log');
  const rejectionsTransport = getFileTransport('rejections.log');

  return createLogger({
    defaultMeta: { ...getDefaultMeta(DEFAULT_NAMESPACE) },
    levels: winston.config.syslog.levels,
    format: combineFormats(timestampFormat(), jsonFormat()),

    transports: [consoleTransport, errorTransport],
    exceptionHandlers: [exceptionsTransport],

    // @ts-expect-error -- prop exists, is documented, just doesn't have ts definitions
    rejectionHandlers: [rejectionsTransport],
  });
}

const logger = IS_TEST_RUNNING ? getTestLogger() : getLogger();

function fork(
  namespace: string,
  options?: winston.LoggerOptions
): winston.Logger {
  const { defaultMeta, ...restOptions } = options || {};

  return logger.child({
    defaultMeta: { ...getDefaultMeta(namespace), defaultMeta },
    ...restOptions,
  });
}

export default logger;
export { fork };
