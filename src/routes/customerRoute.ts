import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Get customers list
 *     description: Retrieves a list of customers with pagination and search functionality.
 *     tags:
 *       - Customer
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
 *         description: Keyword to search for in customer names, emails or phones.
 *     responses:
 *       200:
 *         description: Successfully retrieved customers list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-18T07:23:41.759Z"
 *                 total:
 *                   type: integer
 *                   example: 11
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
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Don Lehner Cameron"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "Margarita65@hotmail.com"
 *                       phone:
 *                         type: string
 *                         example: "971.916.9059 x751"
 *                       address:
 *                         type: string
 *                         example: "609 Schinner Oval"
 *                       password:
 *                         type: string
 *                         description: Hashed password (not visible in production)
 *                         example: "$2b$10$3.dOpPqGY1uaw4vmeNvdvuas44//pXBn6Tc15iNVlSORNIJWdM5K6"
 *                       token:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-06T15:09:14.492Z"
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
router.get("/", authMiddleware, CustomerController.getCustomer);

/**
 * @swagger
 * /api/customer/{customerId}:
 *   get:
 *     summary: Get customer details by ID.
 *     description: This endpoint retrieves detailed information about a specific customer, including their contact information.
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: customerId
 *         in: path
 *         description: The unique identifier of the customer.
 *         required: true
 *         type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Successfully retrieved customer details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier for the customer.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The full name of the customer.
 *                   example: 'Don Lehner Cameron'
 *                 email:
 *                   type: string
 *                   description: The email address of the customer.
 *                   example: 'Margarita65@hotmail.com'
 *                 phone:
 *                   type: string
 *                   description: The phone number of the customer.
 *                   example: '971.916.9059 x751'
 *                 address:
 *                   type: string
 *                   description: The address of the customer.
 *                   example: '609 Schinner Oval'
 *                 password:
 *                   type: string
 *                   description: The hashed password of the customer (do not expose this in response).
 *                   example: '$2b$10$3.dOpPqGY1uaw4vmeNvdvuas44//pXBn6Tc15iNVlSORNIJWdM5K6'
 *                 token:
 *                   type: string
 *                   description: The authentication token for the customer.
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRvbiBMZWhuZXIgQ2FtZXJvbiIsImVtYWlsIjoiTWFyZ2FyaXRhNjVAaG90bWFpbC5jb20iLCJwaG9uZSI6Ijk3MS45MTYuOTA1OSB4NzUxIiwiYWRkcmVzcyI6IjYwOSBTY2hpbm5lciBPdmFsIiwiaWF0IjoxNzM5Nzc2NDg2LCJleHAiOjE3NDAzODEyODZ9.f_t4wQW4fNMYGPx1jP-ZYqR0CNbs0Y5Hl9TwNegmNlY'
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the customer account was created.
 *                   example: '2025-02-06T15:09:14.492Z'
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
router.get("/:id", authMiddleware, CustomerController.getDetailCustomer);
router.post("/", authMiddleware, CustomerController.addCustomer);
router.patch("/:id", authMiddleware, CustomerController.updateCustomer);

export default router;