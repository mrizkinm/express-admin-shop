import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { ResponseError } from "../errors/responseError";

export class UserService {

  static async account(req: { name?: string, email?: string, id: number}) {
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