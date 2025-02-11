import { Request, Response, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: ["b", "i", "strong", "em", "p", "ul", "li"], // Hanya izinkan tag aman
          allowedAttributes: {}, // Hapus semua atribut seperti onclick, style, dll.
        });
      }
    }
  }
  next();
};

export default sanitizeMiddleware;