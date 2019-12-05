import * as mongoose from 'mongoose';
import UserLoginCode from './UserLoginCode';

export interface IUserLoginCodeDocument extends mongoose.Document {
  createdAt: { type: Date };
  uid: { type: String };
  code: { type: String };
}

export interface IUserLoginCode extends IUserLoginCodeDocument {
  // Insert methods here
}

export interface IUserLoginCodeModel extends mongoose.Model<IUserLoginCode> {
  // Insert statics here
}

export default mongoose.model<IUserLoginCode, IUserLoginCodeModel>('UserLoginCode', UserLoginCode);
