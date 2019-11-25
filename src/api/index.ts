import * as Router from 'koa-router';

import { logger } from '@utils/logger';

import v1 from './v1';

const api = new Router();

api.get('/', ctx => {
  ctx.body = 'API Root';
  logger('koa').info('Call from API Root');
});

api.use('/v1', v1.routes());

export default api;
