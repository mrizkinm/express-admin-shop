import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { CategoryValidation } from "../validations/categoryValidation";
import { ResponseError } from "../errors/responseError";

export class CategoryController {

  static async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CategoryService.getCategory(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new ResponseError(400, "Invalid input");
      }

      const data = await CategoryService.getDetailCategory(categoryId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || req.files.length === 0) {
        throw new ResponseError(400, { images: "Image is required"} );
      }
      
      const result = CategoryValidation.addCategory.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const response = await CategoryService.addCategory(req.body, req.files as Express.Multer.File[], req.protocol, req.get('host'));
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new ResponseError(400, "Invalid input");
      }

      const result = CategoryValidation.updateCategory.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const response = await CategoryService.updateCategory(req.body, categoryId, req.files as Express.Multer.File[], req.protocol, req.get('host'));
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}