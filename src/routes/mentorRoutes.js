import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  getAllMentor,
  getUnavailability,
  removeUnavailability,
  unavailabilityUpdate,
  updateMentor,
} from "../controllers/mentorController.js";

const router = express.Router();

router.use(protect);

router.get("/getAllMentor", getAllMentor);

router.use(restrictTo("mentor"));

router.patch("/:id", updateMentor);
router.patch("/unavailability/:id", unavailabilityUpdate);
router.get("/unavailability/:id", getUnavailability);
router.patch("/removeUnavailability/:id", removeUnavailability);

export default router;
