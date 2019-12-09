import * as mongoose from 'mongoose';
const { Schema } = mongoose;

const Post = new Schema({
  id: { type: String, required: true },
  ownerId: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  title: { type: String, required: true },
  quillDelta: { type: Object },
});

export default Post;
