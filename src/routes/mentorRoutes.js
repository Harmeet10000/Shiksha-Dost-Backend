import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { getAllMentor, updateMentor } from "../controllers/mentorController.js";
import { upload } from "../services/s3.js";


const router = express.Router();

router.use(protect);

router.get("/getAllMentor", getAllMentor);
router.patch("/:id", restrictTo("mentor"), upload.single("file"), updateMentor);


export default router;
