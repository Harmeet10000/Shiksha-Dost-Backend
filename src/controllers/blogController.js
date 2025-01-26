import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Blog } from "../models/blogModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";

export const getAllBlogs = getAll(Blog, [
  {
    path: "author",
    select: "name profile_imageURL",
  },
  {
    path: "comments",
    populate: [
      {
        path: "user",
        select: "name profile_imageURL",
      },
      {
        path: "replies.user",
        select: "name profile_imageURL",
      },
    ],
  },
]);

export const getBlog = getOne(Blog, [
  {
    path: "author",
    select: "name profile_imageURL",
  },
  {
    path: "comments",
    populate: [
      {
        path: "user",
        select: "name profile_imageURL",
      },
      {
        path: "replies.user",
        select: "name profile_imageURL",
      },
    ],
  },
]);

export const createBlog = createOne(Blog);

export const deleteBlog = deleteOne(Blog);

export const updateBlog = updateOne(Blog);

export const getMentorBlogs = getAll(Blog);

export const featureBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { isFeatured: true },
    { new: true }
  );
  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

export const unfeatureBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { isFeatured: false },
    { new: true }
  );
  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

export const likeBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

export const disLikeBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { likes: -1 } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

export const shareBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { shares: 1 } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});
