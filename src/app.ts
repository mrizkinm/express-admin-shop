import express from "express";
import cors from "cors";
import helmet from "helmet";
import xssClean from "xss-clean";
import sanitizeMiddleware from "./middlewares/sanitizeMiddleware";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import limiter from "./middlewares/limiter";
import path from "path";
import errorMiddleware from "./middlewares/errorMiddleware";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";
import shopRoute from "./routes/shopRoute";
import orderRoute from "./routes/orderRoute";
import customerRoute from "./routes/customerRoute";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(cookieParser());
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

// Routes
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/shop", shopRoute);
app.use("/api/order", orderRoute);
app.use("/api/customer", customerRoute);

// Error Handling Middleware
app.use(errorMiddleware);

export default app;