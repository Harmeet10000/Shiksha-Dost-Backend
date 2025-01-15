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
} from "../controllers/authController.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/loginMentor", loginMentor);
router.post("/signupMentor", signupMentor);

router.use(protect);

router.get("/verify-email/:token", verifyEmail);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", updatePassword);
// router.patch("/updateMe", updateMe);

router.use(restrictTo("admin"));




export default router;
