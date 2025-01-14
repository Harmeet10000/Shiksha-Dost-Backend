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
import {
  updateMe,
  deleteMe,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signupMentor", signupMentor);
router.post("/login", login);
router.post("/loginMentor", loginMentor);

router.get("/verify-email/:token", verifyEmail);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Protect all routes after this middleware
// router.use(protect);

router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
