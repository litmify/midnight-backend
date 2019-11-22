import * as Router from 'koa-router';
import * as projectCtrl from './project.ctrl';

const project = new Router();

project.get('/', projectCtrl.readProject);
project.post('/', projectCtrl.createProject);

export default project;
