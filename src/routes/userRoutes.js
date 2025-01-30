import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  blockMentor,
  blockStudent,
  deleteMentor,
  deleteStudent,
  getUserDPPs,
  getUserMentorship,
  submitDPP,
  updateStudentProfile,
} from "../controllers/userController.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();

router.use(protect);
router.post("/submitDPP", submitDPP);
router.get("/getUserDPPs", getUserDPPs);
router.patch("/updateProfileImage/:id", updateStudentProfile);
router.post("/getUploadS3URL", getUploadS3URL);
router.get("/get", getUserMentorship);

router.use(restrictTo("admin"));
router.patch("/blockMentor/:id", blockMentor);
router.delete("/deleteMentor/:id", deleteMentor);
router.patch("/blockStudent/:id", blockStudent);
router.delete("/deleteStudent/:id", deleteStudent);

export default router;
