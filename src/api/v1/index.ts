import * as Router from 'koa-router';

import auth from './auth';
import post from './post';
import project from './project';

const v1 = new Router();

v1.use('/auth', auth.routes());
v1.use('/post', post.routes());
v1.use('/project', project.routes());

export default v1;
