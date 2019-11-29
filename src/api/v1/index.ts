import * as Router from 'koa-router';

import auth from './auth';

const v1 = new Router();

v1.use('/auth', auth.routes());

export default v1;
