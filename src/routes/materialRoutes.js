
import express from "express";
import { addMaterial, getMaterial } from "../controllers/materialController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();

router.use(protect);

router.post("/addMaterial", addMaterial);
router.get("/getMaterial", getMaterial);

router.use(restrictTo("admin"));
router.post("/getUploadS3URL", getUploadS3URL);
export default router;vb