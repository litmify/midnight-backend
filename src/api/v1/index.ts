import * as Router from 'koa-router';

import project from './project';

const v1 = new Router();

v1.get('/', ctx => {
  ctx.body = 'API v1';
});

v1.use('/project', project.routes());

export default v1;
