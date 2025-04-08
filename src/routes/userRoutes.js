import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import {
  blockMentor,
  blockStudent,
  deleteMentor,
  deleteStudent,
  getUserDPPs,
  getUserMentorship,
  getUserStats,
  mentorshipGiven,
  submitDPP,
  updateStudentProfile,
} from "../controllers/userController.js";
import { getUploadS3URL } from "../helpers/s3.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /users/submitDPP:
 *   post:
 *     tags: [Users]
 *     summary: Submit DPP answers
 *     description: Submit answers for a Daily Practice Problem
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dppId
 *               - answers
 *             properties:
 *               dppId:
 *                 type: string
 *                 description: ID of the Daily Practice Problem
 *               answers:
 *                 type: array
 *                 description: Array of user's selected answers
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: DPP submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: number
 *                       example: 8
 *                     total:
 *                       type: number
 *                       example: 10
 */
router.post("/submitDPP", submitDPP);

/**
 * @swagger
 * /users/getUserDPPs:
 *   get:
 *     tags: [Users]
 *     summary: Get user's DPPs
 *     description: Get all DPPs attempted by the logged in user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: List of user's DPPs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     dpps:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dppId:
 *                             $ref: '#/definitions/DPP'
 *                           score:
 *                             type: number
 *                             example: 8
 *                           totalQuestions:
 *                             type: number
 *                             example: 10
 *                           submittedAt:
 *                             type: string
 *                             format: date-time
 */
router.get("/getUserDPPs", getUserDPPs);

/**
 * @swagger
 * /users/updateProfileImage/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user profile image
 *     description: Update a user's profile image URL
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photo
 *             properties:
 *               photo:
 *                 type: string
 *                 description: URL of the profile image
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/definitions/User'
 */
router.patch("/updateProfileImage/:id", updateStudentProfile);

/**
 * @swagger
 * /users/getUploadS3URL:
 *   post:
 *     tags: [Users]
 *     summary: Get S3 upload URL
 *     description: Get a pre-signed URL for uploading files to Amazon S3
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - fileType
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Name of the file to upload
 *               fileType:
 *                 type: string
 *                 description: MIME type of the file
 *     responses:
 *       200:
 *         description: Pre-signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 signedRequest:
 *                   type: string
 *                   description: Pre-signed URL for upload
 *                 url:
 *                   type: string
 *                   description: URL to access the file after upload
 */
router.post("/getUploadS3URL", getUploadS3URL);

/**
 * @swagger
 * /users/get:
 *   get:
 *     tags: [Users]
 *     summary: Get user's mentorships
 *     description: Get all mentorships for the logged in user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: List of user's mentorships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     mentorships:
 *                       type: array
 *                       items:
 *                         $ref: '#/definitions/Mentorship'
 */
router.get("/get", getUserMentorship);

router.use(restrictTo("admin"));

/**
 * @swagger
 * /users/blockMentor/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Block mentor (Admin only)
 *     description: Blocks a mentor account from accessing the platform
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mentor ID
 *     responses:
 *       200:
 *         description: Mentor blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     mentor:
 *                       $ref: '#/definitions/Mentor'
 */
router.patch("/blockMentor/:id", blockMentor);

/**
 * @swagger
 * /users/deleteMentor/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete mentor (Admin only)
 *     description: Permanently deletes a mentor account
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mentor ID
 *     responses:
 *       204:
 *         description: Mentor deleted successfully
 */
router.delete("/deleteMentor/:id", deleteMentor);

/**
 * @swagger
 * /users/blockStudent/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Block student (Admin only)
 *     description: Blocks a student account from accessing the platform
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/definitions/User'
 */
router.patch("/blockStudent/:id", blockStudent);

/**
 * @swagger
 * /users/deleteStudent/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete student (Admin only)
 *     description: Permanently deletes a student account
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       204:
 *         description: Student deleted successfully
 */
router.delete("/deleteStudent/:id", deleteStudent);

/**
 * @swagger
 * /users/getUserStats:
 *   get:
 *     tags: [Users]
 *     summary: Get user statistics (Admin only)
 *     description: Get statistics about users on the platform
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       example: 1250
 *                     activeUsers:
 *                       type: number
 *                       example: 1050
 *                     newUsersThisMonth:
 *                       type: number
 *                       example: 78
 */
router.get("/getUserStats", getUserStats);

/**
 * @swagger
 * /users/mentorshipGiven:
 *   get:
 *     tags: [Users]
 *     summary: Get mentorship statistics (Admin only)
 *     description: Get statistics about mentorships provided on the platform
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Mentorship statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalMentorships:
 *                       type: number
 *                       example: 350
 *                     activeMentorships:
 *                       type: number
 *                       example: 120
 *                     completedMentorships:
 *                       type: number
 *                       example: 230
 */
router.get("/mentorshipGiven", mentorshipGiven);

export default router;