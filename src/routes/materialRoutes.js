
import express from "express";
import { addMaterial } from "../controllers/materialController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/getUploadS3URL", getUploadS3URL);
router.post("/addMaterial", addMaterial);

export default router;