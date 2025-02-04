import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  {
    timestamps: true,
  }
);

export const Like = mongoose.model("Like", likeSchema);

