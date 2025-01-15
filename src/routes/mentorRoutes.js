import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { getAllMentor, unavailabilityUpdate, updateMentor } from "../controllers/mentorController.js";
import { upload } from "../services/s3.js";


const router = express.Router();

router.use(protect);

router.get("/getAllMentor", getAllMentor);

router.use(restrictTo("mentor"));

router.patch("/:id", upload.single("file"), updateMentor);
router.patch("/unavailability/:id", unavailabilityUpdate);


export default router;
