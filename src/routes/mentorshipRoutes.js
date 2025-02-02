import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createMentorship } from "../controllers/mentorshipController.js";


const router = express.Router();

router.use(protect);
router.post("/create", createMentorship);

export default router;

// meet link, email Controller, getmentorship user&mentor, receipt-1
