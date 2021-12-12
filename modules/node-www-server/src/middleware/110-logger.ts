import type KoaApplication from 'koa';
import { logger } from 'node-utils/build';

const log = logger.fork('node-www-server');

export default function loggerMiddleware(app: KoaApplication): void {
  app.context.logKeys = [];

  app.use(async function logLogFormat(ctx, next) {
    await next();

    log.info(`[${formatLine}]`);

    // unregister self as soon as the log format is logged out
    app.middleware.splice(app.middleware.indexOf(logLogFormat), 1);
  });

  app.use(async (ctx, next) => {
    ctx.logData = {};

    await next();

    const logLine = ctx.logKeys
      .map((key) => {
        const data = ctx.logData[key];
        return data == null ? '' : data;
      })
      .join(TAB_CHARACTER);
    log.info(logLine);
  });
}
