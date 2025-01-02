import express from "express";
import {
  getBlogComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();


router.route("/:blogId").get(getBlogComments).post(addComment);

router.route("/:id").delete(deleteComment);

export default router;
