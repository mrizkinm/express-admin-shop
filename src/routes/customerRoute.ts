import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, CustomerController.getCustomer);
router.get("/:id", authMiddleware, CustomerController.getDetailCustomer);
router.post("/", authMiddleware, CustomerController.addCustomer);
router.patch("/:id", authMiddleware, CustomerController.updateCustomer);

export default router;