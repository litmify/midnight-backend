import * as Router from 'koa-router';

import auth from './auth';
import project from './project';

const v1 = new Router();

v1.get('/', ctx => {
  ctx.body = 'API v1';
});

v1.use('/auth', auth.routes());
v1.use('/project', project.routes());

export default v1;
