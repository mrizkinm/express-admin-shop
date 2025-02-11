import express from "express";
import cors from "cors";
import helmet from "helmet";
import xssClean from "xss-clean";
import sanitizeMiddleware from "./middlewares/sanitizeMiddleware";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import limiter from "./middlewares/limiter";
import path from "path";

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(xssClean());
app.use(sanitizeMiddleware);
app.use(express.json());
app.use(loggerMiddleware);
app.use(limiter);
app.use(helmet());

// Middleware untuk mengizinkan akses ke folder "uploads"
app.use("/product", express.static(path.join(__dirname, "../public/uploads/product")));
app.use("/category", express.static(path.join(__dirname, "../public/uploads/category")));
app.use("/shop", express.static(path.join(__dirname, "../public/uploads/shop")));

export default app;