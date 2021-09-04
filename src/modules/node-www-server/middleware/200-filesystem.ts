import type KoaApplication from 'koa';

export default function filesystemMiddleware(app: KoaApplication): void {
  app.use(async (ctx, next) => {
    await next();
  });
}
