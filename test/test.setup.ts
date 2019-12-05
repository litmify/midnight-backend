import { config } from 'dotenv';
import * as mongoose from 'mongoose';

export default {
  setup(): void {
    beforeAll(async () => {
      // Set up dotenv
      config();

      // Set up MongoDB Options
      const connectionUri: string = process.env.MONGO_URI_TEST;
      mongoose.set('useNewUrlParser', true);
      mongoose.set('useUnifiedTopology', true);

      // Connect to MongoDB
      mongoose.connect(connectionUri);
      console.log('Successfully connect to MongoDB for jest test.');
    });

    afterEach(async () => {
      const collections = Object.keys(mongoose.connection.collections);
      for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany({});
      }
    });

    afterAll(async () => {
      const collections = Object.keys(mongoose.connection.collections);
      for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
          await collection.drop();
        } catch (error) {
          if (error.message === 'ns not found') return;
          if (error.message.includes('a background operation is currently running')) return;
          console.log(error.message);
        }
      }

      await mongoose.connection.close();
    });
  },
};
