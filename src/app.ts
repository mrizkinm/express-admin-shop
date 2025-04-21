import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import xssClean from "xss-clean";
import sanitizeMiddleware from "./middlewares/sanitizeMiddleware";
import limiter from "./middlewares/limiterMiddleware";
import path from "path";
import errorMiddleware from "./middlewares/errorMiddleware";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";
import shopRoute from "./routes/shopRoute";
import orderRoute from "./routes/orderRoute";
import customerRoute from "./routes/customerRoute";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./config/swagger";
import { logger } from "./utils/logger";

const app = express();
setupSwagger(app);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Middleware
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(cookieParser());
app.use(xssClean());
app.use(sanitizeMiddleware);
app.use(express.json());
app.use(limiter);
app.use(helmet());

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

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

// Route dengan error handling
app.get('/error', (req, res) => {
  try {
    throw new Error('Simulated error');
  } catch (err) {
    logger.error('Error occurred', { error: err });
    res.status(500).send('Internal Server Error');
  }
});

app.get("/", (req: Request, res: Response) => {
  res.status(403).json({ errors: "Forbidden" });
});

export default app;