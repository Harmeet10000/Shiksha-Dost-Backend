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

export const getAllBlogs = getAll(Blog, [
  {
    path: "author",
    select: "name profile_imageURL",
  },
  {
    path: "comments",
    options: { sort: { createdAt: -1 } },
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
    options: { sort: { createdAt: -1 } },
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
  console.log("hello");
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


export const saveBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    // Check if blog exists
    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Find the user and update their savedPosts
    const user = await User.findById(req.user._id);

    // Check if blog is already saved
    const alreadySaved = user.savedPosts.some(
      (post) => post.blogId.toString() === blogId
    );

    if (alreadySaved) {
      // Remove the blog if it's already saved (toggle functionality)
      user.savedPosts = user.savedPosts.filter(
        (post) => post.blogId.toString() !== blogId
      );
    } else {
      // Add the blog to savedPosts
      user.savedPosts.push({ blogId });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate({
      path: "savedPosts.blogId",
      select: "slug title cover_image desc author createdAt",
      populate: {
        path: "author",
        select: "name profile_imageURL", // Populate author with name and email or any other fields
      },
    });

    res.status(200).json({
      action: alreadySaved ? "remove" :"add",
      message: alreadySaved
        ? "Blog removed from saved posts"
        : "Blog added to saved posts",
      savedPosts: updatedUser.savedPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
