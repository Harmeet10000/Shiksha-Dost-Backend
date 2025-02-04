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

router.get("/", (req, res) =>{
  res.json({ message: "Welcome to the Mentorship API 🚀. Running in ECS 🎉" });
});
router.get("/health", (req, res) => {
  res.status(200).json({ message: "Everything is good here 👀" });
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/loginMentor", loginMentor);
router.post("/signupMentor", signupMentor);
router.get("/verify-email/:token", verifyEmail);


router.use(protect);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", updatePassword);

router.use(restrictTo("admin"));




export default router;
