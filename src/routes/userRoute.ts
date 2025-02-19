import { Router } from "express";
import { UserController } from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Endpoint to login and get JWT token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "examplejwttoken"
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Don Lehner Cameron"
 *                 email:
 *                   type: string
 *                   example: "margarita65@hotmail.com"
 *                 phone:
 *                   type: string
 *                   example: "971.916.9059 x751"
 *                 address:
 *                   type: string
 *                   example: "609 Schinner Oval"
 *       401:
 *         description: Login failed (username or password is wrong)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Username or password is wrong"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.post("/login", UserController.login);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout user
 *     description: Endpoint untuk logout user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       401:
 *         description: Logout failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Unauthorized: Invalid token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.post("/logout", authMiddleware, UserController.logout);

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     summary: Update user account
 *     description: Update user profile information
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *                 description: "Optional name of the user"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: "Optional email of the user"
 *     responses:
 *       200:
 *         description: User successfully updated
 *       400:
 *         description: "Bad Request"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Invalid input"
 *       401:
 *         description: "Invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Unauthorized: Invalid token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.patch("/profile", authMiddleware, UserController.profile);


/**
 * @swagger
 * /api/user/password:
 *   patch:
 *     summary: Change user password
 *     description: Change user password information
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               currentPassword:
 *                 type: string
 *                 example: "currentpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "confirmpassword123"
 *     responses:
 *       200:
 *         description: Password successfully changed
 *       400:
 *         description: Validation failed
 *       401:
 *         description: "Invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Unauthorized: Invalid token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.patch("/password", authMiddleware, UserController.changePassword);

export default router;