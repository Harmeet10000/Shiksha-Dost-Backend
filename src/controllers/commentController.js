import catchAsync from "../utils/catchAsync.js";
import { createOne, deleteOne } from "./handlerFactory.js";
import { Comment } from "../models/commentModel.js";

export const addComment = createOne(Comment);

export const deleteComment = deleteOne(Comment);

// eslint-disable-next-line no-unused-vars
export const replyComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { desc } = req.body;
  const user = req.user._id;

  const parentComment = await Comment.findById(commentId);

  const reply = {
    user,
    desc,
    createdAt: new Date(),
  };

  parentComment.replies = parentComment.replies || []; // Initialize if `replies` is null
  parentComment.replies.push(reply);

  await parentComment.save();

  res.status(200).json({
    status: "success",
    data: {
      reply,
    },
  });
});
