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


const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", increaseVisits, getBlog);
router.post("/", createBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id", updateBlog);
router.patch("/:id/feature", featureBlog);

export default router;
