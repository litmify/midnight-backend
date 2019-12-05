import * as koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as cors from '@koa/cors';

import '@lib/env';
import '@lib/mongo';
import logger from '@utils/logger';

import api from './api';

// Set up Koa.js
const app = new koa();
app.use(bodyparser());
app.use(
  cors({
    credentials: false,
    origin: '*',
  }),
);
app.use(api.routes()).use(api.allowedMethods());
logger('koa').success(`Successfully set up koa.`);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger('koa').success(`Server is listening on PORT ${port}.`);
});
