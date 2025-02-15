import { Router } from "express";
import { ProductController } from "../controllers/productController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, ProductController.getProduct);
router.get("/:id", authMiddleware, ProductController.getDetailProduct);
router.post("/", authMiddleware, ProductController.addProduct);
router.patch("/:id", authMiddleware, ProductController.updateProduct);

export default router;