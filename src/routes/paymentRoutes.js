import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { checkout, paymentVerification } from "../helpers/razorpay.js";

const router = express.Router();

router.post("/paymentverification", paymentVerification);

router.use(protect);
router.post("/checkout", checkout);
router.get("/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
);




export default router;
