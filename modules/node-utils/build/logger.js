import path from 'path';
import winston from 'winston';
import 'winston-syslog';
// import readJsonFile from './fs/read-json-file';
const { createLogger, format: { colorize: colorizeFormat, combine: combineFormats, json: jsonFormat, simple: simpleFormat, timestamp: timestampFormat, }, transports: { File: FileTransport, Console: ConsoleTransport, 
// @ts-expect-error -- Syslog is added by the 'winston-syslog' import above
SysLog: SyslogTransport, }, } = winston;
// TODO: fix once TS's nodenext option allows top level await
// see: https://github.com/microsoft/TypeScript/issues/46869
//
// const packageJSON = await readJsonFile(
//   path.resolve(__dirname, '/package.json') as absoluteFilePath,
//   'package.json'
// );
const version = '0.0.1';
const LOG_FOLDER = '/var/log/voice';
const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_NAMESPACE = 'DEFAULT';
const IS_TEST_RUNNING = process.env.NODE_ENV === 'test';
function getDefaultMeta(namespace) {
    return { version, namespace };
}
function getTestLogger() {
    return createLogger({});
}
function getFileTransport(filename, level = DEFAULT_LOG_LEVEL) {
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
// const logger = IS_TEST_RUNNING ? getTestLogger() : getLogger();
function fork(namespace, options) {
    const { defaultMeta, ...restOptions } = options || {};
    return logger.child({
        defaultMeta: { ...getDefaultMeta(namespace), defaultMeta },
        ...restOptions,
    });
}
// export default logger;
export { fork };
