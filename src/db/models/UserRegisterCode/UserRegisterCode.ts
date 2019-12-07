import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const UserRegisterCode = new Schema({
  createdAt: { type: Date, default: new Date(), expires: 1800 },
  email: { type: String, required: true },
  username: { type: String, required: true },
  code: { type: String, required: true },
});

export default UserRegisterCode;
