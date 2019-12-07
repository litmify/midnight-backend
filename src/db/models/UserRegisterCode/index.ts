import * as mongoose from 'mongoose';
import UserRegisterCode from './UserRegisterCode';

export interface IUserRegisterCodeDocument extends mongoose.Document {
  createdAt: Date;
  email: string;
  username: string;
  code: string;
}

export interface IUserRegisterCode extends IUserRegisterCodeDocument {
  // Insert methods here
}

export interface IUserRegisterCodeModel extends mongoose.Model<IUserRegisterCode> {
  // Insert statics here
}

export default mongoose.model<IUserRegisterCode, IUserRegisterCodeModel>(
  'UserRegisterCode',
  UserRegisterCode,
);
