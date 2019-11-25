import * as Koa from 'koa';

const validate = (ctx: Koa.Context): void => {
  ctx.body = {
    result: true,
  };
};

export default validate;
