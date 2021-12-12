import type KoaApplication from 'koa';

export default function responseTimeMiddleware(app: KoaApplication): void {
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const elapsed = Date.now() - start;
    ctx.set('X-Response-time', `${elapsed}ms`);
  });
}
