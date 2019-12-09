import * as mongoose from 'mongoose';
import Post from './Post';

export interface IPostDocument extends mongoose.Document {
  id: string;
  ownerId: string; // The id of Project
  isPublic: boolean;
  title: string;
  quillDelta: object;
}

export interface IPost extends IPostDocument {
  // Insert methods here
}

export interface IPostModel extends mongoose.Model<IPost> {
  // Insert statics here
}

export default mongoose.model<IPost, IPostModel>('Post', Post);
