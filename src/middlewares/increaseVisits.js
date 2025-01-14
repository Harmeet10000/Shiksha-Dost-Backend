import { Blog } from "../models/blogModel.js";

const increaseVisits = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "No blog found with that ID",
      });
    }

    blog.visits += 1;
    await blog.save();

    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};


export default increaseVisits;
