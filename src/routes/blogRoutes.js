import express from "express";
import {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  featureBlog,
  getMentorBlogs,
} from "../controllers/blogController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { increaseVisits } from "../middlewares/increaseVisits.js";
import { getUploadS3URL } from "../helpers/s3.js";


const router = express.Router();

router.use(protect);
router.get("/getAllBlogs", getAllBlogs);
router.post("/getUploadS3URL", getUploadS3URL);
router.get("/:slug", increaseVisits, getBlog);

router.use(restrictTo("mentor"));

router.post("/createBlog", createBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id", updateBlog);
router.patch("/feature/:id", featureBlog);
router.get("/getMentorBlogs/:id", getMentorBlogs);

export default router;
