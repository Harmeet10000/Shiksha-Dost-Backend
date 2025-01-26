import express from "express";
import {
  addComment,
  deleteComment,
  replyComment,
} from "../controllers/commentController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/:blogId").post(restrictTo("student"), addComment);
router.route("/reply/:commentId").post(restrictTo("student"), replyComment);

router.use(restrictTo("mentor", "student"));
router.route("/:id").delete(deleteComment);

export default router;
