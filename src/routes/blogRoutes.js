import express from "express";
import {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  featureBlog,
} from "../controllers/blogController.js";
import increaseVisits from "../middlewares/increaseVisits.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/:id", increaseVisits, getBlog);
router.get("/getAllBlogs", getAllBlogs);

router.use(protect);
router.use(restrictTo("admin", "mentor"));

router.post("/createBlog", createBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id", updateBlog);
router.patch("/:id/feature", featureBlog);

export default router;
