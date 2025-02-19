import { Router } from "express";
import { ShopController } from "../controllers/shopController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/shop:
 *   get:
 *     summary: Get shop information
 *     description: Get shop data information
 *     tags:
 *       - Shop
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "example shop"
 *                 address:
 *                   type: string
 *                   example: "example address"
 *                 phone:
 *                   type: string
 *                   example: "example phone"
 *                 email:
 *                   type: string
 *                   example: "example email"
 *                 description:
 *                   type: string
 *                   example: "example description"
 *                 image:
 *                   type: string
 *                   example: "http://test.io/test.png"
 *       401:
 *         description: Invalid token
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
router.get("/", authMiddleware, ShopController.getData);

/**
 * @swagger
 * /api/shop:
 *   patch:
 *     summary: Update shop information
 *     description: Update user profile information
 *     tags:
 *       - Shop
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gundam Base"
 *                 description: "Optional name of the shop"
 *               email:
 *                 type: string
 *                 example: "shop@example.com"
 *                 description: "Optional email of the shop"
 *               phone:
 *                 type: string
 *                 example: "089876567654"
 *                 description: "Optional phone number of the shop"
 *               address:
 *                 type: string
 *                 example: "example address"
 *                 description: "Optional address of the shop"
 *               description:
 *                 type: string
 *                 example: "example description"
 *                 description: "Optional description of the shop"
 *               images:
 *                 type: array
 *                 example: "example description"
 *                 description: "Image logo of the shop"
 *     responses:
 *       200:
 *         description: Shop successfully updated
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
router.patch("/", authMiddleware, ShopController.updateShop);

export default router;