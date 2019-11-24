import * as Router from 'koa-router';

import login from './auth.login';
import loginValidate from './auth.login.validate';
import register from './auth.register';

const auth = new Router();

auth.post('/login', login);
auth.post('/login/validate', loginValidate);
auth.post('/register', register);
// atuh.post('/register/validate');

export default auth;
