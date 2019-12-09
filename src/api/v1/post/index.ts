import * as Router from 'koa-router';

import checkAuthenticated from '@middlewares/middleware.authenticate';

import create from './post.create';
import get from './post.get';

const post: Router = new Router();

post.use('/create', checkAuthenticated);
post.post('/create', create);

post.use('/', checkAuthenticated);
post.get('/', get);

export default post;
