import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, OrderController.getOrder);
router.post("/action", authMiddleware, OrderController.action);
router.get("/summary", authMiddleware, OrderController.getSummary);
router.get("/:id", authMiddleware, OrderController.getDetailOrder);

export default router;