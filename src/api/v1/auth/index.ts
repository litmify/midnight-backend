import * as Router from 'koa-router';

import login from './auth.login';
import loginValidate from './auth.login.validate';
import register from './auth.register';

const auth: Router = new Router();

auth.post('/login', login);
auth.post('/login/validate', loginValidate);
auth.post('/register', register);

export default auth;
