import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  blockMentor,
  blockStudent,
  deleteMentor,
  deleteStudent,
  getUserDPPs,
  saveBlog,
  submitDPP,
} from "../controllers/userController.js";
import { checkout, paymentVerification } from "../helpers/razorpay.js";

const router = express.Router();

router.use(protect);
router.post("/submitDPP", submitDPP);
router.get("/getUserDPPs", getUserDPPs);
router.post("/checkout", checkout);
router.post("/paymentverification", paymentVerification);
router.patch("/save/:id", saveBlog);

router.use(restrictTo("admin"));
router.patch("/blockMentor/:id", blockMentor);
router.delete("/deleteMentor/:id", deleteMentor);
router.patch("/blockStudent/:id", blockStudent);
router.delete("/deleteStudent/:id", deleteStudent);

export default router;
