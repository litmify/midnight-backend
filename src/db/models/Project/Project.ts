import * as mongoose from 'mongoose';
import nanoid = require('nanoid');

const { Schema } = mongoose;

const projectSchema = new Schema({
  uid: { type: String, required: true, default: nanoid() },
  title: { type: String, required: true },
  description: { type: String },
  meta: {
    owner: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    log: {
      updatedAt: { type: [Date], default: [] },
    },
  },
});

export default projectSchema;
