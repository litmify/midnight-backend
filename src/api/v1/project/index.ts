import * as Router from 'koa-router';

import checkAuthenticated from '@middlewares/middleware.authenticate';

import create from './project.create';

const project: Router = new Router();

project.use('/create', checkAuthenticated);
project.post('/create', create);

export default project;
