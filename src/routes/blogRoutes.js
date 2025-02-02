import express from "express";
import {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  featureBlog,
  getMentorBlogs,
  unfeatureBlog,
  toggleLikeBlog,
  shareBlog,
  saveBlog,
  getLatestBlog,
  getProminentBlogs,
  toggleProminentBlog,
  getFeaturedBlog,
} from "../controllers/blogController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { increaseVisits } from "../middlewares/increaseVisits.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();

router.use(protect);
router.get("/getAllBlogs", getAllBlogs);
router.post("/getUploadS3URL", getUploadS3URL);
router.post("/like/:id", toggleLikeBlog);
router.post("/share/:id", shareBlog);
router.patch("/save-blog/:blogId", saveBlog);
router.get("/getProminentBlogs", getProminentBlogs);
router.get("/getLatestBlogs", getLatestBlog);
router.post("/toggleProminentBlog/:id", restrictTo("admin"), toggleProminentBlog);
router.get("/getFeaturedBlog", getFeaturedBlog);
router.get("/:slug", increaseVisits, getBlog);

router.use(restrictTo("mentor"));
router.post("/createBlog", createBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id", updateBlog);
router.patch("/feature/:id", featureBlog);
router.patch("/unfeature/:id", unfeatureBlog);
router.get("/getMentorBlogs/:id", getMentorBlogs);

export default router;
