import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { logger } from "../utils/logger";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    logger.error(`401 Unauthorized - No token | ${req.method} ${req.url}`);
    res.status(401).json({ errors: "Unauthorized: No token provided" });
    return;
  }

  try {
    const storedToken  = await prisma.user.findFirst({
      where: { token: token },
    });

    if (!storedToken) {
      logger.error(`401 Unauthorized - Invalid token | ${req.method} ${req.url}`);
      res.status(401).json({ errors: "Unauthorized: Invalid token" });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // Menyimpan user yang terautentikasi di request
    next();
  } catch (error: any) {
    logger.error(`Token verification failed: ${error.message} | ${req.method} ${req.url}`);
    res.status(401).json({ errors: "Unauthorized: Invalid token" });
    return;
  }
};

export default authMiddleware;