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
        type: [Object];
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
  resetLoginCode(): any;
  addProject(uid: string): any;
}

export interface IUserModel extends mongoose.Model<IUser> {
  findUser(query: string, type?: string): any;
}

userSchema.methods.logLogin = function(code: string) {
  this.meta.log.loginAt.push({ code, date: new Date() });
  return this.save();
};

userSchema.methods.logLoginTry = function(type: string, code: string = null, input: string = null) {
  this.meta.log.loginTryAt.push({ type, code, input, date: new Date() });
  return this.save();
};

userSchema.methods.setLoginCode = async function(code: string) {
  await this.logLoginTry('generate', code);
  this.meta.loginCode = code;
  return this.save();
};

userSchema.methods.resetLoginCode = function() {
  this.meta.loginCode = null;
  return this.save();
};

userSchema.methods.addProject = function(uid: string) {
  this.project.push(uid);
  return this.save();
};

userSchema.statics.findUser = function(query: string, type: string = 'none') {
  if (type == 'email') {
    return this.findOne({ email: query }).exec();
  } else if (type == 'username') {
    return this.findOne({ username: query }).exec();
  } else if (type == 'uid') {
    return this.findOne({ uid: query }).exec();
  } else {
    return this.findOne()
      .or([{ email: query }, { username: query }])
      .exec();
  }
};

export const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;
