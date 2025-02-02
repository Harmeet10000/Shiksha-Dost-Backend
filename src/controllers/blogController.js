import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Blog } from "../models/blogModel.js";
import { Like } from "../models/likeModel.js";
import { User } from "../models/userModel.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.js";

export const getAllBlogs = getAll(Blog);

export const getBlog = getOne(Blog);

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

// eslint-disable-next-line no-unused-vars
export const toggleLikeBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({ blog: id, user: userId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    await Blog.findByIdAndUpdate(id, { $inc: { likes: -1 } });

    return res.status(200).json({ action: "dislike", message: "Blog unliked" });
  } else {
    await Like.create({ user: userId, blog: id });
    await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } });

    return res.status(200).json({ action: "like", message: "Blog liked" });
  }
});
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
export const saveBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const userId = req.user.id;
  console.log("blogId", blogId);

  const blogExists = await Blog.findById(blogId);
  if (!blogExists) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const user = await User.findById(userId);

  const alreadySaved = user.savedBlogs.some(
    (post) => post.blogId.id === blogId
  );
  // const AS = user.savedBlogs.some((post) => console.log("alreadySaved", post.blogId.id));

  if (alreadySaved) {
    user.savedBlogs = user.savedBlogs.filter(
      (post) => post.blogId.id !== blogId
    );
  } else {
    user.savedBlogs.push({ blogId });
  }

  await user.save();

  const updatedUser = await User.findById(req.user._id);

  res.status(200).json({
    action: alreadySaved ? "remove" : "add",
    message: alreadySaved
      ? "Blog removed from saved posts"
      : "Blog added to saved posts",
    savedBlogs: updatedUser.savedBlogs,
  });
});
// eslint-disable-next-line no-unused-vars
export const getLatestBlog = catchAsync(async (req, res, next) => {
  const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    success: true,
    count: latestBlogs.length,
    data: latestBlogs,
  });
});

export const getFeaturedBlog = catchAsync(async (req, res, next) => {
  const featuredBlog = await Blog.findOne({ isFeatured: true });

  res.status(200).json({
    success: true,
    data: featuredBlog,
  });
});

// eslint-disable-next-line no-unused-vars
export const toggleProminentBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  blog.isProminent = !blog.isProminent;
  await blog.save();

  res.status(200).json({
    action: blog.isProminent ? "marked" : "unmarked",
    message: blog.isProminent
      ? "Blog marked as prominent"
      : "Blog unmarked as prominent",
    isProminent: blog.isProminent,
  });
});
// eslint-disable-next-line no-unused-vars
export const getProminentBlogs = catchAsync(async (req, res, next) => {
  const prominentBlogs = await Blog.find({ isProminent: true }).limit(10);

  res.status(200).json({
    success: true,
    count: prominentBlogs.length,
    data: prominentBlogs,
  });
});
