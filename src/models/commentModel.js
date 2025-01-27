import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    replies: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User", // Also reference User for replies
        },
        desc: String,
        createdAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Index on `blog` field to optimize queries for fetching comments related to a specific blog
commentSchema.index({ blog: 1 });

// Index on `user` field to optimize queries for fetching comments made by a specific user
commentSchema.index({ user: 1 });

// Compound index on `blog` and `user` to optimize queries where both are involved
commentSchema.index({ blog: 1, user: 1 });

// Text index on `desc` for full-text search across comment descriptions
commentSchema.index({ desc: "text" });

// TTL index on `createdAt` to automatically remove comments after a certain period (optional)
commentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 30 }); // Example: 30 days

export const Comment = mongoose.model("Comment", commentSchema);
