import * as Router from 'koa-router';

import checkAuthenticated from '@middlewares/middleware.authenticate';

import create from './project.create';
import get from './project.get';

const project: Router = new Router();

project.use('/create', checkAuthenticated);
project.post('/create', create);

project.use('/', checkAuthenticated);
project.use('/:username', checkAuthenticated);
project.get('/', get);
project.get('/:username', get);

export default project;
