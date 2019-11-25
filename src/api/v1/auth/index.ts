import * as Router from 'koa-router';

import login from './auth.login';
import loginValidate from './auth.login.validate';
import register from './auth.register';
import authenticate from './auth.authenticate';

import middleware_authenticate from '@src/middlewares/middleware.authenticate';

const auth = new Router();

auth.post('/login', login);
auth.post('/login/validate', loginValidate);
auth.post('/register', register);

auth.use('/authenticate', middleware_authenticate);
auth.get('/authenticate', authenticate);
// atuh.post('/register/validate');

export default auth;
