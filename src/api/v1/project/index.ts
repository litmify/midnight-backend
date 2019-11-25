import * as Router from 'koa-router';

import create from './project.create';
import getByUid from './project.get.uid';

const project = new Router();

project.get('/:uid', getByUid);
project.post('/create', create);

export default project;
