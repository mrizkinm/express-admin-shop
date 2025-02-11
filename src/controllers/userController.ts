import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserValidation } from "../validations/userValidation";

export class UserController {

  static async account(req: Request, res: Response, next: NextFunction) {
    try {
      const result = UserValidation.updateAccount.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        res.status(400).json({ errors: simplifiedErrors });
      }

      const newUser = await UserService.account(req.body);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = UserValidation.password.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        res.status(400).json({ errors: simplifiedErrors });
      }

      const newUser = await UserService.changePassword(req.body);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
}