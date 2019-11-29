import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const User = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  meta: {
    createdAt: { type: Date, default: new Date() },
  },
});

export default User;
