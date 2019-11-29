import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const UserLoginCode = new Schema({
  createdAt: { type: Date, default: new Date(), expires: 1800 },
  uid: { type: String, required: true },
  code: { type: String, required: true },
});

export default UserLoginCode;
