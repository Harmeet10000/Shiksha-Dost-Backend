import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Comment } from "../models/commentModel.js";


export const getBlogComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ blog: req.params.blogId }).populate(
    "user"
  );
  res.status(200).json({
    status: "success",
    results: comments.length,
    data: {
      comments,
    },
  });
});

export const addComment = catchAsync(async (req, res, next) => {
  const newComment = await Comment.create({
    user: req.body.user,
    blog: req.params.blogId,
    desc: req.body.desc,
  });
  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) {
    return next(new AppError("No comment found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});