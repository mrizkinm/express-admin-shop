import { Router } from "express";
import { UserController } from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", UserController.login);
router.post("/logout", authMiddleware, UserController.logout);
router.patch("/profile", UserController.profile);
router.patch("/password", authMiddleware, UserController.changePassword);

export default router;