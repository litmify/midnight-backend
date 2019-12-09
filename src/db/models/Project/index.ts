import * as mongoose from 'mongoose';
import Project from './Project';

export interface IProjectDocument extends mongoose.Document {
  id: string;
  ownerId: string;
  isPublic: boolean;
  title: string;
  url: string;
  description: string;
}

export interface IProject extends IProjectDocument {
  // Insert methods here
}

export interface IProjectModel extends mongoose.Model<IProject> {
  // Insert statics here
}

export default mongoose.model<IProject, IProjectModel>('Project', Project);
