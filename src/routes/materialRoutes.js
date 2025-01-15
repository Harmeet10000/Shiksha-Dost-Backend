
import express from "express";
import { uploadFile } from "../controllers/materialController.js";
import { upload } from "../services/s3.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/upload", upload.single("file"), uploadFile);

export default router;