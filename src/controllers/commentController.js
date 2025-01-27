import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { createOne, deleteOne, getAll } from "./handlerFactory.js";
import { Comment } from "../models/commentModel.js";

export const addComment = createOne(Comment);

export const deleteComment = deleteOne(Comment);

export const replyComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { desc } = req.body;
  const user = req.user._id;
  console.log(commentId, desc);
  const parentComment = await Comment.findById(commentId);

  const reply = {
    user,
    desc,
    createdAt: new Date(),
  };

  parentComment.replies = parentComment.replies || []; // Initialize if `replies` is null
  parentComment.replies.push(reply);

  await parentComment.save();

  const updatedComment = await Comment.findById(commentId).populate({
    path: "replies.user",
    select: "name profile_imageURL",
  });

  res.status(200).json({
    status: "success",
    data: {
      reply: updatedComment.replies.slice(-1)[0],
    },
  });
});
