import * as Koa from 'koa';

const getByUid = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = {
    result: true,
    payload: null,
  };
};

export default getByUid;
