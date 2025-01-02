import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { getAllMentor } from "../controllers/mentorController.js";


const router = express.Router();

router.get("/getAllMentor", getAllMentor);


export default router;
