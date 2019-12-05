import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const Project = new Schema({
  id: { type: String, required: true },
  ownerId: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, default: '' },
  posts: { type: [String], default: [] },
});

export default Project;
