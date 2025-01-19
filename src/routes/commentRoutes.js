import express from "express";
import {
  getBlogComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/:blogId").get(getBlogComments)
router.route("/:blogId").post(addComment);

router.use(restrictTo("mentor", "student"));

router.route("/:id").delete(deleteComment);

export default router;
