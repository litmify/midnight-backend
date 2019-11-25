import * as Koa from 'koa';

const authenticate = (ctx: Koa.Context): void => {
  ctx.body = {
    result: true,
  };
};

export default authenticate;
