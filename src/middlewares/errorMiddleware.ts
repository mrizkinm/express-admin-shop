import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // check error if object or string
  const msg = typeof err.message === 'string' ? err.message : JSON.stringify(err.message);

  logger.error(`Error: ${msg} | ${req.method} ${req.url}`);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong.';
  if (process.env.NODE_ENV === 'production') {
    res.status(status).json({
      errors: message
    });
  } else {
    // Di development, tampilkan pesan error lengkap dengan stack trace
    res.status(status).json({
      errors: message,
      stack: err.stack, // Ini akan menampilkan stack trace di development
    });
  }
  next();
};

export default errorMiddleware;