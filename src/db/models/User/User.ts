import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  project: { type: [String] },
  meta: {
    loginCode: { type: String },
    createdAt: { type: Date, default: new Date() },
    log: {
      loginAt: {
        type: [Object],
        default: [],
      },
      loginTryAt: {
        type: [Object],
        default: [],
      },
    },
  },
});

export default userSchema;
