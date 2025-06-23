import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import authMiddleware from "../middlewares/authMiddleware";
import { uploadImages } from "../utils/multer";

const router = Router();

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get product categories
 *     description: Retrieves a list of product categories with pagination and search functionality.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 2
 *         description: Number of items to return per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "example"
 *         description: Keyword to search for in category names.
 *     responses:
 *       200:
 *         description: Successfully retrieved product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-18T07:07:06.213Z"
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 18
 *                       name:
 *                         type: string
 *                         example: "Perfect Grade (PG)"
 *                       image:
 *                         type: string
 *                         format: uri
 *                         example: "https://picsum.photos/seed/7L0oT/821/363"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-11T10:01:48.963Z"
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
router.get("/", authMiddleware, CategoryController.getCategory);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   get:
 *     summary: Get category details by ID
 *     description: This endpoint fetches the category details including its name, image, and timestamps of when it was created and last updated.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         description: The ID of the category.
 *         required: true
 *         type: integer
 *         example: 18
 *     responses:
 *       200:
 *         description: Category details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 18
 *                 name:
 *                   type: string
 *                   example: 'Perfect Grade (PG)'
 *                 image:
 *                   type: string
 *                   example: 'https://picsum.photos/seed/7L0oT/821/363'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-02-11T10:01:48.963Z'
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
router.get("/:id", authMiddleware, CategoryController.getDetailCategory);

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     description: Adds a new category with a name and an image via FormData.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: "Metal Build"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the category.
 *     responses:
 *       200:
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 23
 *                 name:
 *                   type: string
 *                   example: "Metal Build"
 *                 image:
 *                   type: string
 *                   format: uri
 *                   example: "http://localhost:3003/uploads/category/1739866214580-giv42m.png"
 *       400:
 *         description: Invalid input
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
router.post("/", authMiddleware, uploadImages, CategoryController.addCategory);

/**
 * @swagger
 * /api/category/{categoryId}:
 *   patch:
 *     summary: Update category by ID
 *     description: Update category name and image by providing the ID.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 23
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "HG Daban"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new image file (optional)
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success to update data"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: string
 *                   example: "Invalid input"
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
router.patch("/:id", authMiddleware, uploadImages, CategoryController.updateCategory);

export default router;