import * as Router from 'koa-router';

import checkAuthenticated from '@middlewares/middleware.authenticate';

import create from './post.create';
import get from './post.get';
import del from './post.delete';
import checkOwner from './post.checkowner';

const post: Router = new Router();

post.use('/create', checkAuthenticated);
post.post('/create', create);

post.use('/', checkAuthenticated);
post.get('/', get);

post.use('/delete', del);
post.post('/delete', del);

post.use('/check', checkAuthenticated);
post.get('/check', checkOwner);

export default post;
