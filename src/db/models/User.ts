import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  project: { type: [String] },
  meta: {
    createdAt: { type: Date, default: new Date() },
    log: {
      login: {
        type: [Date],
        default: [new Date()],
      },
    },
  },
});

export default userSchema;
