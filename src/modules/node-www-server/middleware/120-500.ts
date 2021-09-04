import type KoaApplication from 'koa';

export default function err500Middleware(app: KoaApplication): void {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = 500;
    }
  });
}
