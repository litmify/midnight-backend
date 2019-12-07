import * as Router from 'koa-router';

import login from './auth.login';
import loginValidate from './auth.login.validate';
import register from './auth.register';
import registerValidate from './auth.register.validate';

const auth: Router = new Router();

auth.post('/login', login);
auth.post('/login/validate', loginValidate);
auth.post('/register', register);
auth.post('/register/validate', registerValidate);

export default auth;
