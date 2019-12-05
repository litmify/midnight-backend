import * as mongoose from 'mongoose';
import User from './User';

export interface IUserDocument extends mongoose.Document {
  id: string;
  email: string;
  username: string;
  meta: {
    createdAt: Date;
  };
}

export interface IUser extends IUserDocument {
  // Insert methods here
}

export interface IUserModel extends mongoose.Model<IUser> {
  // Insert statics here
}

export default mongoose.model<IUser, IUserModel>('User', User);
