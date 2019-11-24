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
    loginCode: { type: String };
    createdAt: { type: Date };
    log: {
      loginAt: {
        type: [Date];
      };
      loginTryAt: {
        type: [Object];
      };
    };
  };
}

export interface IUser extends IUserDoc {
  logLogin(): any;
  // logLoginTry(): any;
  setLoginCode(code: string): any;
}

export interface IUserModel extends mongoose.Model<IUser> {
  findUser(query: string, type?: string): any;
}

userSchema.methods.logLogin = function() {
  this.meta.log.loginAt.push(new Date());
  return this.save();
};

/*
userSchema.methods.logLoginTry = function() {
  this.meta.log.loginTryAt.push(new Date());
  return this.save();
}
*/

userSchema.methods.setLoginCode = function(code: string) {
  this.meta.loginCode = code;
  this.meta.log.loginTryAt.push({ code: code, date: new Date() });
  return this.save();
};

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
