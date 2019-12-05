import * as Router from 'koa-router';

import auth from './auth';
import project from './project';

const v1 = new Router();

v1.use('/auth', auth.routes());
v1.use('/project', project.routes());

export default v1;
