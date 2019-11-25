import * as mongoose from 'mongoose';
import projectSchema from './Project';

export interface IProjectDoc extends mongoose.Document {
  uid: {
    type: string;
    required: boolean;
  };
  title: {
    type: string;
    required: boolean;
  };
  description: { type: string };
  meta: {
    owner: { type: String; required: boolean };
    createdAt: { type: Date };
    log: {
      updatedAt: { type: [Date] };
    };
  };
}

export interface IProject extends IProjectDoc {
  // Method here
}

export interface IProjectModel extends mongoose.Model<IProject> {
  // Statics here
}

export const Project: IProjectModel = mongoose.model<IProject, IProjectModel>(
  'Project',
  projectSchema,
);
export default Project;
