import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { checkout, fetchReceipt, paymentVerification } from "../helpers/razorpay.js";

const router = express.Router();

router.post("/paymentverification", paymentVerification);

router.use(protect);
router.get("/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);
router.post("/checkout", checkout);
router.post("/receipt/:mentorshipId", fetchReceipt);


export default router;
