import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  blockMentor,
  blockStudent,
  deleteMentor,
  deleteStudent,
  getUserDPPs,
  submitDPP,
  updateStudentProfile,
} from "../controllers/userController.js";
import { checkout, paymentVerification } from "../helpers/razorpay.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();

// router.use(protect);
router.post("/submitDPP", submitDPP);
router.get("/getUserDPPs", getUserDPPs);
router.post("/checkout", checkout);
router.post("/paymentverification", paymentVerification);
router.patch("/updateProfileImage/:id", updateStudentProfile);
router.post("/getUploadS3URL", getUploadS3URL);

router.use(restrictTo("admin"));
router.patch("/blockMentor/:id", blockMentor);
router.delete("/deleteMentor/:id", deleteMentor);
router.patch("/blockStudent/:id", blockStudent);
router.delete("/deleteStudent/:id", deleteStudent);

export default router;
