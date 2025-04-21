import { NextFunction, Request, Response } from "express";
import { ShopService } from "../services/shopService";
import { ShopValidation } from "../validations/shopValidation";
import { ResponseError } from "../errors/responseError";

export class ShopController {

  static async getData(req: Request, res: Response, next: NextFunction) {
    try {
      const shop = await ShopService.getData();
      res.json(shop);
    } catch (error) {
      next(error);
    }
  }

  static async updateShop(req: Request, res: Response, next: NextFunction) {
    try {
      const result = ShopValidation.updateShop.safeParse(req.body);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;

        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );

        throw new ResponseError(400, simplifiedErrors);
      }

      const response = await ShopService.updateShop(req.body, req.protocol, req.get('host'));
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}