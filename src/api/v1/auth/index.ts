import * as Router from 'koa-router';

import login from './auth.login';
import loginValidate from './auth.login.validate';
import register from './auth.register';
import validate from './auth.validate';

import middleware_validate from '@middlewares/middleware.validate.authenticated';

const auth = new Router();

auth.post('/login', login);
auth.post('/login/validate', loginValidate);
auth.post('/register', register);

auth.use('/validate', middleware_validate);
auth.get('/validate', validate);
// atuh.post('/register/validate');

export default auth;
