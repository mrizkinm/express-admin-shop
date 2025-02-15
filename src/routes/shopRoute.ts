import { Router } from "express";
import { ShopController } from "../controllers/shopController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, ShopController.getData);
router.patch("/", authMiddleware, ShopController.updateShop);

export default router;