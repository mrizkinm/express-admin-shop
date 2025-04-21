import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { OrderValidation } from "../validations/orderValidation";
import { ResponseError } from "../errors/responseError";

export class OrderController {

  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OrderService.getSummary();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OrderService.getOrder(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      if (!orderId) {
        throw new ResponseError(400, "Invalid input");
      }

      const data = await OrderService.getDetailOrder(orderId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async action(req: Request, res: Response, next: NextFunction) {
    try {
      const result = OrderValidation.action.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const response = await OrderService.action(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

}