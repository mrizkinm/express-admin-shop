import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/productService";
import { ProductValidation } from "../validations/productValidation";
import { ResponseError } from "../errors/responseError";

export class ProductController {
  static async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProductService.getProduct(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      if (!productId) {
        throw new ResponseError(400, "Invalid input");
      }

      const data = await ProductService.getDetailProduct(productId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new ResponseError(400, { images: "Image is required"} );
      }
      
      const result = ProductValidation.addProduct.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const response = await ProductService.addProduct(req.body, req.files as Express.Multer.File[], req.protocol, req.get('host'));
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      if (!productId) {
        throw new ResponseError(400, "Invalid input");
      }

      const result = ProductValidation.updateProduct.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const response = await ProductService.updateProduct(req.body, productId, req.files as Express.Multer.File[], req.protocol, req.get('host'));
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}