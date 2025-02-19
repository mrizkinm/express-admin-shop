import { Router } from "express";
import { ProductController } from "../controllers/productController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get a list of products with pagination and search options.
 *     description: Retrieves a list of products with pagination and search functionality.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination.
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page.
 *         required: false
 *         type: integer
 *         default: 10
 *       - name: search
 *         in: query
 *         description: Search term to filter products.
 *         required: false
 *         type: string
 *         default: ''
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-02-18T07:37:54.010Z'
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 offset:
 *                   type: integer
 *                   example: 0
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 61
 *                       categoryId:
 *                         type: integer
 *                         example: 20
 *                       name:
 *                         type: string
 *                         example: 'HG RX-78-2 Gundam'
 *                       price:
 *                         type: integer
 *                         example: 2989402
 *                       isFeatured:
 *                         type: boolean
 *                         example: true
 *                       isArchived:
 *                         type: boolean
 *                         example: false
 *                       description:
 *                         type: string
 *                         example: 'Model kit dari HG RX-78-2 Gundam, sangat detail dan kolektibel.'
 *                       quantity:
 *                         type: integer
 *                         example: 15
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: '2025-02-11T10:01:49.023Z'
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 20
 *                           name:
 *                             type: string
 *                             example: 'High Grade (HG)'
 *                           image:
 *                             type: string
 *                             example: 'https://picsum.photos/seed/1xBH0G/1716/86'
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: '2025-02-11T10:01:48.963Z'
 *                       images:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             productId:
 *                               type: integer
 *                               example: 61
 *                             url:
 *                               type: string
 *                               example: 'https://picsum.photos/seed/UWKpe3saG/640/480?blur=9'
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: '2025-02-11T10:01:49.041Z'
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
router.get("/", authMiddleware, ProductController.getProduct);

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Get product details by ID.
 *     description: This endpoint retrieves detailed information about a specific product, including its category, images, and other product details.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: The unique identifier of the product.
 *         required: true
 *         type: integer
 *         example: 61
 *     responses:
 *       200:
 *         description: Successfully retrieved product details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier for the product.
 *                   example: 61
 *                 categoryId:
 *                   type: integer
 *                   description: The ID of the product's category.
 *                   example: 20
 *                 name:
 *                   type: string
 *                   description: The name of the product.
 *                   example: 'HG RX-78-2 Gundam'
 *                 price:
 *                   type: integer
 *                   description: The price of the product.
 *                   example: 2989402
 *                 isFeatured:
 *                   type: boolean
 *                   description: Whether the product is featured.
 *                   example: true
 *                 isArchived:
 *                   type: boolean
 *                   description: Whether the product is archived.
 *                   example: false
 *                 description:
 *                   type: string
 *                   description: A description of the product.
 *                   example: 'Model kit dari HG RX-78-2 Gundam, sangat detail dan kolektibel.'
 *                 quantity:
 *                   type: integer
 *                   description: The quantity of the product in stock.
 *                   example: 15
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the product was created.
 *                   example: '2025-02-11T10:01:49.023Z'
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the category.
 *                       example: 20
 *                     name:
 *                       type: string
 *                       description: The name of the category.
 *                       example: 'High Grade (HG)'
 *                     image:
 *                       type: string
 *                       description: The URL of the category's image.
 *                       example: 'https://picsum.photos/seed/1xBH0G/1716/86'
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the category was created.
 *                       example: '2025-02-11T10:01:48.963Z'
 *                 images:
 *                   type: array
 *                   description: The list of images for the product.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the image.
 *                         example: 1
 *                       productId:
 *                         type: integer
 *                         description: The product ID that the image belongs to.
 *                         example: 61
 *                       url:
 *                         type: string
 *                         description: The URL of the image.
 *                         example: 'https://picsum.photos/seed/UWKpe3saG/640/480?blur=9'
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the image was created.
 *                         example: '2025-02-11T10:01:49.041Z'
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
router.get("/:id", authMiddleware, ProductController.getDetailProduct);

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     description: Adds a new product with base64-encoded images.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - images
 *               - price
 *               - categoryId
 *               - isFeatured
 *               - isArchived
 *               - description
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "RG Sazabi v2"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: base64
 *                 maxItems: 5
 *                 example: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAA..."]
 *               price:
 *                 type: integer
 *                 example: 1600000
 *               categoryId:
 *                 type: integer
 *                 example: 21
 *               isFeatured:
 *                 type: boolean
 *                 example: false
 *               isArchived:
 *                 type: boolean
 *                 example: false
 *               description:
 *                 type: string
 *                 example: "rg sazabi ver 2"
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 87
 *                     categoryId:
 *                       type: integer
 *                       example: 21
 *                     name:
 *                       type: string
 *                       example: "RG Sazabi v2"
 *                     price:
 *                       type: integer
 *                       example: 1600000
 *                     isFeatured:
 *                       type: boolean
 *                       example: false
 *                     isArchived:
 *                       type: boolean
 *                       example: false
 *                     description:
 *                       type: string
 *                       example: "rg sazabi ver 2"
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-18T09:30:24.382Z"
 *                 imageUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["http://example.com/1739866214580-giv42m.png"]
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
router.post("/", authMiddleware, ProductController.addProduct);

/**
 * @swagger
 * /api/product/{productId}:
 *   patch:
 *     summary: Update product information
 *     description: Update the details of a product based on the provided request body.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 23
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: "RG Sazabi V2"
 *               price:
 *                 type: integer
 *                 description: Price of the product in the local currency
 *                 example: 1600000
 *               categoryId:
 *                 type: integer
 *                 description: ID of the category to which the product belongs
 *                 example: 21
 *               isFeatured:
 *                 type: boolean
 *                 description: Whether the product is featured or not
 *                 example: false
 *               isArchived:
 *                 type: boolean
 *                 description: Whether the product is archived or not
 *                 example: false
 *               description:
 *                 type: string
 *                 description: Description of the product
 *                 example: "rg sazabi ver 2"
 *               quantity:
 *                 type: integer
 *                 description: Available stock quantity of the product
 *                 example: 32
 *     responses:
 *       200:
 *         description: Success to update data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success to update data
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
router.patch("/:id", authMiddleware, ProductController.updateProduct);

export default router;