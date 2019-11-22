import * as mongoose from 'mongoose';
import userSchema from './User';

export interface IUserDoc extends mongoose.Document {
  uid: {
    type: string;
    required: boolean;
  };
  email: {
    type: string;
    required: boolean;
  };
  username: {
    type: string;
    required: boolean;
  };
  project: { type: [string] };
  meta: {
    createdAt: { type: Date };
    log: {
      login: {
        type: [Date];
      };
    };
  };
}

export interface IUser extends IUserDoc {
  // Method function goes here
}

export interface IUserModel extends mongoose.Model<IUser> {
  findUser(query: string, type?: string): any;
}

userSchema.statics.findUser = function(query: string, type: string = 'none') {
  if (type == 'email') {
    return this.findOne({ email: query }).exec();
  } else if (type == 'username') {
    return this.findOne({ username: query }).exec();
  } else {
    return this.findOne()
      .or([{ email: query }, { username: query }])
      .exec();
  }
};

export const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;
