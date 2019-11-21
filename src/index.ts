import * as Koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import * as mongoose from 'mongoose';

import './lib/env';
import { logger } from './utils/logger';

import api from './api';

const app = new Koa();

// koa settings
app.use(bodyparser());
app.use(
  cors({
    credentials: false,
    origin: '*',
  })
);
app.use(api.routes()).use(api.allowedMethods());

logger.koa.success(`Successfully set up koa.`);

// Setting up MongoDB connection
const mongoUri: string = process.env.MONGO_URI;
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoUri, err => {
  if (err) {
    logger.mongo.error(err);
  } else {
    logger.mongo.success(`Successfully connected to MongoDB.`);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.koa.success(`Server is listening on PORT ${port}.`);
});
