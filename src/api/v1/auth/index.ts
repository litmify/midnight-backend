import * as Router from 'koa-router';

import register from './auth.register';

const auth = new Router();

auth.post('/register', register);

export default auth;
