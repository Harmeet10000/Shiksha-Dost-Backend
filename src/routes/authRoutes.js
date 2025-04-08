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




/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/definitions/User'
 */


router.post("/signup", signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/definitions/User'
 */
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
