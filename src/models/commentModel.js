import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
