import * as Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/login', authCtrl.loginUser);
auth.post('/register', authCtrl.registerUser);
auth.post('/modify', authCtrl.modifyUser);

export default auth;
