import * as Koa from 'koa';

const check = async (ctx: Koa.BaseContext): Promise<void> => {
  ctx.body = {
    result: true,
    payload: ctx.state.user.username,
  };
};

export default check;
