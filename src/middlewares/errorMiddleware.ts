import { NextFunction, Request, Response } from "express";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
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
};

export default errorMiddleware;