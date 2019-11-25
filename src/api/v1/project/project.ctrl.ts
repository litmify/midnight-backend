import * as Koa from 'koa';

import { logger } from '@utils/logger';

const readProject = (ctx: Koa.Context): void => {
  ctx.body = {
    result: true,
  };
  logger('koa').info('get in project.ctrl.ts');
};

const createProject = (ctx: Koa.Context): void => {
  ctx.body = {
    result: true,
  };
  logger('koa').info('post in project.ctrl.ts');
};

export { readProject, createProject };
