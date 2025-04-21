import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserValidation } from "../validations/userValidation";
import { ResponseError } from "../errors/responseError";

export class UserController {

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = UserValidation.login.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const response = await UserService.login(req.body);
      res.json({ token: response.token, ...response.user });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Mengambil Authorization Header
      const refreshToken = req.header("Authorization")?.split(" ")[1];
      if (!refreshToken) {
        throw new ResponseError(401, "Unauthorized: No token provided");
      }

      const response = await UserService.logout(refreshToken);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = UserValidation.updateAccount.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
  
        // Ubah format menjadi { fieldName: "Error message" }
        const simplifiedErrors = Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
        );
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const newUser = await UserService.profile(req.body);
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
  
        throw new ResponseError(400, simplifiedErrors);
      }

      const newUser = await UserService.changePassword(req.body);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
}