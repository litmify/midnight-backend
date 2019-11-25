import * as Router from 'koa-router';

import create from './project.create';
import getByUid from './project.get.uid';
import middleware_authenticate from '@middlewares/middleware.authenticate';

const project = new Router();

project.get('/:uid', getByUid);
project.use('/create', middleware_authenticate);
project.post('/create', create);

export default project;
