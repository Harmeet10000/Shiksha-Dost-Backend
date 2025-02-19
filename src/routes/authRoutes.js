import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  forgotPassword,
  login,
  loginMentor,
  resetPassword,
  signup,
  signupMentor,
  updatePassword,
  verifyEmail,
  getAuthUrl,
  handleCallback,
} from "../controllers/authController.js";

const router = express.Router();





router.post("/signup", signup);
router.post("/login", login);
router.post("/loginMentor", loginMentor);
router.post("/signupMentor", signupMentor);
router.get("/verify-email/:token", verifyEmail);
router.get("/google", getAuthUrl);
router.get("/google/callback", handleCallback);

router.use(protect);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", updatePassword);

router.use(restrictTo("admin"));

export default router;
