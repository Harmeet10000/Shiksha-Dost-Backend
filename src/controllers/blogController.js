import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Blog } from "../models/blogModel.js";
import APIFeatures from "../utils/apiFeatures.js";

export const getAllBlogs = catchAsync(async (req, res, next) => {
  console.log("getAllBlogs", req.query);
  const features = new APIFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query;

  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

export const getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate("mentor");
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

export const createBlog = catchAsync(async (req, res, next) => {
  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  slug = `${slug}-${Date.now()}`;

  const newBlog = new Blog({ author: req.user._id, slug, ...req.body });

  const blog = await newBlog.save();
  res.status(200).json(blog);
});

export const deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

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

export const updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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


export const getMentorBlogs = catchAsync(async (req, res, next) => {
  const { id } = req.params; 
 
  const blogs = await Blog.find({ author: id });

   if (!blogs || blogs.length === 0) {
    return next(new AppError("No blogs found for the specified mentor", 404));
  }

   res.status(200).json({
    status: "success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});