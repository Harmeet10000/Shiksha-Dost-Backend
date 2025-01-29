import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  getAllMentor,
  checkUnavailability,
  removeUnavailability,
  unavailabilityUpdate,
  updateMentor,
  getUnavailability,
} from "../controllers/mentorController.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();


router.use(protect);
router.get("/getAllMentor", getAllMentor);


router.use(restrictTo("mentor"));
router.patch("/:id", updateMentor);
router.patch("/unavailability/:id", unavailabilityUpdate);
router.get("/checkUnavailability/:id", checkUnavailability);
router.get("/unavailability/:id", getUnavailability);

router.patch("/removeUnavailability/:id", removeUnavailability);
router.post("/getUploadS3URL", getUploadS3URL);


export default router;
