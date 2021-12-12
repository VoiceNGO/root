import type KoaApplication from 'koa';

export default function err404Middleware(app: KoaApplication): void {
  app.use(async (ctx, next) => {
    await next();

    if (!ctx.status) {
      ctx.status = 404;
    }
  });
}
