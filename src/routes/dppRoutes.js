import express from "express";
import {
  createDPP,
  deleteDPP,
  getAllDPP,
  getDPP,
  updateDPP,
} from "../controllers/dppController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();


router.use(protect);

router.post("/getUploadS3URL", getUploadS3URL);
router.route("/getAllDPP").get(getAllDPP);
router.route("/createDPP").post(restrictTo("admin"), createDPP);
router.route("/getDPP/:id").get(getDPP);
router.route("/updateDPP/:id").patch(restrictTo("admin"), updateDPP);
router.route("/deleteDPP/:id").delete(restrictTo("admin"), deleteDPP);

export default router;
