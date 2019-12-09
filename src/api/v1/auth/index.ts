import * as Router from 'koa-router';

import check from './auth.check';
import login from './auth.login';
import loginValidate from './auth.login.validate';
import register from './auth.register';
import registerValidate from './auth.register.validate';

import middlewareAuthenticate from '@middlewares/middleware.authenticate';

const auth: Router = new Router();

auth.use('/check', middlewareAuthenticate);
auth.get('/check', check);
auth.post('/login', login);
auth.post('/login/validate', loginValidate);
auth.post('/register', register);
auth.post('/register/validate', registerValidate);

export default auth;
