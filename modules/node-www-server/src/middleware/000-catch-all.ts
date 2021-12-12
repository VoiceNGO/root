/**
 * 2nd try-catch handler above the 500 so that the 500 can be below things like response-time and logging
 */

import type KoaApplication from 'koa';

export default function catchAllMiddleware(app: KoaApplication): void {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = 500;
    }
  });
}
