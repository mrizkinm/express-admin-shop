import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, CategoryController.getCategory);
router.get("/:id", authMiddleware, CategoryController.getDetailCategory);
router.post("/", authMiddleware, CategoryController.addCategory);
router.patch("/:id", authMiddleware, CategoryController.updateCategory);

export default router;