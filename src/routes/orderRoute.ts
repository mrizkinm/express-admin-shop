import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get orders list
 *     description: Retrieves a list of orders with pagination and search functionality.
 *     tags:
 *       - Order
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
 *         description: Keyword to search for in order transaction IDs or customer names.
 *     responses:
 *       200:
 *         description: Successfully retrieved orders list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-18T07:29:05.530Z"
 *                 total:
 *                   type: integer
 *                   example: 2
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
 *                         example: 2
 *                       orderTrxId:
 *                         type: string
 *                         example: "TRX-1739631222720"
 *                       customerId:
 *                         type: integer
 *                         example: 1
 *                       info:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Don Lehner Cameron"
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "Margarita65@hotmail.com"
 *                           phone:
 *                             type: string
 *                             example: "971.916.9059 x751"
 *                           address:
 *                             type: string
 *                             example: "609 Schinner Oval"
 *                       totalAmount:
 *                         type: integer
 *                         example: 3338425
 *                       status:
 *                         type: string
 *                         example: "Pending"
 *                       snapToken:
 *                         type: string
 *                         example: "43fbcc24-b7b6-4f46-ae52-b38e5460f96a"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-15T14:53:42.722Z"
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Don Lehner Cameron"
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "Margarita65@hotmail.com"
 *                           phone:
 *                             type: string
 *                             example: "971.916.9059 x751"
 *                           address:
 *                             type: string
 *                             example: "609 Schinner Oval"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-06T15:09:14.492Z"
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
router.get("/", authMiddleware, OrderController.getOrder);

/**
 * @swagger
 * /api/order/{orderId}:
 *   get:
 *     summary: Get order details by ID.
 *     description: This endpoint retrieves detailed information about a specific order, including the customer information, order items, and the status of the order.
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: The unique identifier of the order.
 *         required: true
 *         type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Successfully retrieved order details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier for the order.
 *                   example: 2
 *                 orderTrxId:
 *                   type: string
 *                   description: The transaction ID of the order.
 *                   example: 'TRX-1739631222720'
 *                 customerId:
 *                   type: integer
 *                   description: The unique identifier of the customer who placed the order.
 *                   example: 1
 *                 info:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the customer.
 *                       example: 'Don Lehner Cameron'
 *                     email:
 *                       type: string
 *                       description: The email of the customer.
 *                       example: 'Margarita65@hotmail.com'
 *                     phone:
 *                       type: string
 *                       description: The phone number of the customer.
 *                       example: '971.916.9059 x751'
 *                     address:
 *                       type: string
 *                       description: The address of the customer.
 *                       example: '609 Schinner Oval'
 *                 totalAmount:
 *                   type: integer
 *                   description: The total amount of the order.
 *                   example: 3338425
 *                 status:
 *                   type: string
 *                   description: The status of the order.
 *                   example: 'Pending'
 *                 snapToken:
 *                   type: string
 *                   description: The token used to process payments for the order.
 *                   example: '43fbcc24-b7b6-4f46-ae52-b38e5460f96a'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the order was created.
 *                   example: '2025-02-15T14:53:42.722Z'
 *                 items:
 *                   type: array
 *                   description: The list of items in the order.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the order item.
 *                         example: 3
 *                       orderId:
 *                         type: integer
 *                         description: The ID of the order this item belongs to.
 *                         example: 2
 *                       productId:
 *                         type: integer
 *                         description: The ID of the product in the order.
 *                         example: 68
 *                       quantity:
 *                         type: integer
 *                         description: The quantity of the product ordered.
 *                         example: 1
 *                       price:
 *                         type: integer
 *                         description: The price of the product.
 *                         example: 1708727
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the item was added to the order.
 *                         example: '2025-02-15T14:53:42.722Z'
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: The unique identifier of the product.
 *                             example: 68
 *                           categoryId:
 *                             type: integer
 *                             description: The category ID of the product.
 *                             example: 19
 *                           name:
 *                             type: string
 *                             description: The name of the product.
 *                             example: 'MG Wing Gundam Zero EW'
 *                           price:
 *                             type: integer
 *                             description: The price of the product.
 *                             example: 1708727
 *                           isFeatured:
 *                             type: boolean
 *                             description: Whether the product is featured.
 *                             example: true
 *                           isArchived:
 *                             type: boolean
 *                             description: Whether the product is archived.
 *                             example: false
 *                           description:
 *                             type: string
 *                             description: A description of the product.
 *                             example: 'Model kit dari MG Wing Gundam Zero EW, sangat detail dan kolektibel.'
 *                           quantity:
 *                             type: integer
 *                             description: The quantity of the product in stock.
 *                             example: 49
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp when the product was created.
 *                             example: '2025-02-11T10:01:49.089Z'
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
router.post("/action", authMiddleware, OrderController.action);
router.get("/summary", authMiddleware, OrderController.getSummary);
router.get("/:id", authMiddleware, OrderController.getDetailOrder);

export default router;