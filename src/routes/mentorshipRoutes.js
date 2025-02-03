import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { createMentorship, sendMeetMail } from "../controllers/mentorshipController.js";


const router = express.Router();

router.use(protect);
router.post("/create", createMentorship);


export default router;
