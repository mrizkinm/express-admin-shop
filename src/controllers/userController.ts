import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserValidation } from "../validations/userValidation";

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
  
        res.status(400).json({ errors: simplifiedErrors });
        return;
      }

      const response = await UserService.login(req.body);

      // Set refresh token sebagai cookie
      res.cookie("token", response.token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      });
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
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
      }

      const response = await UserService.logout(refreshToken);
      // Hapus cookie di browser
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

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