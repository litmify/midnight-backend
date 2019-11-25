import * as mongoose from 'mongoose';

import { logger } from '@utils/logger';

const mongoUri: string = process.env.MONGO_URI;
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoUri, err => {
  if (err) {
    logger('mongo').error(err);
  } else {
    logger('mongo').success(`Successfully connected to MongoDB.`);
  }
});
