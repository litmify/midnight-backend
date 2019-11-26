import * as mongoose from 'mongoose';

import logger from '@utils/logger';

// Set up MongoDB Options
const connectionUri: string = process.env.MONGO_URI;
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

// Connect to MongoDB
mongoose.connect(connectionUri, err => {
  if (err) logger('lib/mongo').error(`Unexpected error: ${err}`);
  else logger('lib/mongo').success(`Successfully connected to MongoDB.`);
});
