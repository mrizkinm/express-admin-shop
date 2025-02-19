import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseError } from "../errors/responseError";

export class UserService {

  static async login(req: { email: string, password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: req.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      }
    });

    if (!user || !(await bcrypt.compare(req.password, user.password))) {
      throw new ResponseError(401, "Username or password is wrong");
    }

    // Generate token
    const tokenJwt = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        token: tokenJwt
      }
    });
    
    const { password, ...userWithoutPass } = user;
    return { token: tokenJwt, user: userWithoutPass };
  }

  static async logout(refreshToken: string) {
    const storedToken  = await prisma.user.findFirst({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new ResponseError(401, "Invalid refresh token");
    }

    await prisma.user.updateMany({
      where: { token: refreshToken },
      data: { token: null },
    });
  
    return { message: 'Logout successful' };
  }

  static async profile(req: { name?: string, email?: string, id: number}) {
    // Cocokkan token dengan token di database
    const findUser = await prisma.user.findUnique({
      where: { id: req.id },
    });

    if (!findUser) {
      throw new ResponseError(404, "User not found");
    }

    // Filter hanya field yang dikirim oleh user
    const updateData = Object.fromEntries(
      Object.entries(req).filter(([_, value]) => value !== undefined && value !== "")
    );

    delete updateData.id;

    const user = await prisma.user.update({
      where: {
        id: req.id
      },
      data: updateData
    });

    return user
  }

  static async changePassword(req: { currentPassword: string, newPassword: string, confirmPassword: string, id: number }) {
    // Cocokkan token dengan token di database
    const findUser = await prisma.user.findUnique({
      where: { id: req.id },
    });

    if (!findUser) {
      throw new ResponseError(404, "User not found");
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(req.currentPassword, findUser.password);
    if (!isValidPassword) {
      throw new ResponseError(401, "Password lama salah");
    }

    // Hash the password
    const hash = await bcrypt.hash(req.newPassword, 10);

    const user = await prisma.user.update({
      where: {
        id: req.id
      },
      data: {
        password: hash
      }
    });

    return user
  }
}