import * as mongoose from 'mongoose';
import Project from './Project';

export interface IProjectDocument extends mongoose.Document {
  id: { type: String };
  ownerId: { type: String };
  title: { type: String };
  url: { type: String };
  description: { type: String };
  posts: { type: [String] };
}

export interface IProject extends IProjectDocument {
  // Insert methods here
}

export interface IProjectModel extends mongoose.Model<IProject> {
  // Insert statics here
}

export default mongoose.model<IProject, IProjectModel>('Project', Project);
