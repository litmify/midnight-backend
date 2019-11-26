import * as Router from 'koa-router';

const v1 = new Router();

v1.get('/', ctx => {
  ctx.body = 'api v1';
});

export default v1;
