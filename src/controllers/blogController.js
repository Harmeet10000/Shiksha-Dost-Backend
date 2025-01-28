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

import { User } from "../models/userModel.js";
import Like from "../models/likeModel.js";

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
  const userId = req.user._id;

  // Check if the user has already liked the blog
  const existingLike = await Like.findOne({ blog: id, user: userId });

  if (existingLike) {
    // Unlike the blog by deleting the like document
    await Like.findByIdAndDelete(existingLike._id);

    // Update user's like count in the user collection
    await Blog.findByIdAndUpdate(id, { $inc: { likes: -1 } });

    return res.status(200).json({action:"dislike", message: "Blog unliked" });
  } else {
    // Like the blog by creating a new like document
    await Like.create({ user: userId, blog: id });

    // Update user's like count in the user collection
    await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } });

    return res.status(200).json({action:"like" ,message: "Blog liked" });
  }
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

export const saveBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const userId = req.user.id;

  const blogExists = await Blog.findById(blogId);
  if (!blogExists) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const user = await User.findById(userId);

  const alreadySaved = user.savedBlogs.some(
    (post) => post.blogId.toString() === blogId
  );

  if (alreadySaved) {
    user.savedBlogs = user.savedBlogs.filter(
      (post) => post.blogId.toString() !== blogId
    );
  } else {
    user.savedBlogs.push({ blogId });
  }

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate({
    path: "savedBlogs.blogId",
    select: "slug title cover_image desc author createdAt",
    populate: {
      path: "author",
      select: "name profile_imageURL", // Populate author with name and email or any other fields
    },
  });

  res.status(200).json({
    action: alreadySaved ? "remove" : "add",
    message: alreadySaved
      ? "Blog removed from saved posts"
      : "Blog added to saved posts",
    savedBlogs: updatedUser.savedBlogs,
  });
});
