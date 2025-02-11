import { NextFunction, Request, Response } from "express";
import { CustomerService } from "../services/customerService";
import { CustomerValidation } from "../validations/customerValidation";

export class CustomerController {

  static async getCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CustomerService.getCustomer(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.params.id;
      if (!customerId) {
        res.status(400).json({ errors: "Invalid input" });
      }

      const data = await CustomerService.getDetailCustomer(customerId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async addCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = CustomerValidation.addCustomer.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        res.status(400).json({ errors: simplifiedErrors });
      }

      const response = await CustomerService.addCustomer(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.params.id;
      if (!customerId) {
        res.status(400).json({ errors: "Invalid input" });
      }

      const result = CustomerValidation.updateCustomer.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        res.status(400).json({ errors: simplifiedErrors });
      }

      const response = await CustomerService.updateCustomer(req.body, customerId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}