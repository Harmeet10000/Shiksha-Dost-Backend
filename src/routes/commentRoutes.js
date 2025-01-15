import express from "express";
import {
  getBlogComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/:blogId").get(getBlogComments)
router.route("/:blogId").post(addComment);
router.route("/:id").delete(deleteComment);

export default router;
