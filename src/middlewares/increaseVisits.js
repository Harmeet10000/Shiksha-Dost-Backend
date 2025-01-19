import { Blog } from "../models/blogModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const increaseVisits = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  console.log("Slug", req.params.slug);

  const blog = await Blog.findOneAndUpdate(
    { slug },
    { $inc: { visit: 1 } },
    { new: true } // Returns the updated document
  );

  if (!blog) {
    return next(new AppError("Blog not found with the given slug", 404));
  }

  next();
});


