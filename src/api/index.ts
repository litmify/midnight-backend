import * as Router from 'koa-router';

import logger from '@utils/logger';

import v1 from './v1';

// Set up api route
const api = new Router();
api.get('/', ctx => {
  ctx.body = 'noon';
  logger('koa').info('Call to API root');
});

// Versioning api
api.use('/v1', v1.routes());

export default api;
