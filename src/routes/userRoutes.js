import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { blockMentor } from "../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.patch("/blockMentor/:id", blockMentor);

export default router;
