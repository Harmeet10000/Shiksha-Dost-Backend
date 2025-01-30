import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { createMentorship, sendMeetMail } from "../controllers/mentorshipController.js";
import { fetchReceipt } from "../helpers/razorpay.js";

const router = express.Router();

router.use(protect);
router.post("/create", createMentorship);
router.post("/fetchReceipt", fetchReceipt)


export default router;


// meet link, email Controller, getmentorship user&mentor, receipt-1