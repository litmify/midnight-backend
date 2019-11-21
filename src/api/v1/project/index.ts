import * as Router from 'koa-router';
import * as projectCtrl from './project.ctrl';

const project = new Router();

project.get('/', projectCtrl.get);
project.post('/', projectCtrl.post);

export default project;
