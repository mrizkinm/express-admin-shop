import prisma from "../config/prisma";
import { ResponseError } from "../errors/responseError";
import bcrypt from "bcrypt";

export class CustomerService {

  static async getCustomer(req: {page?: string, limit?: string, search?: string}) {
    const page =  req.page ? Number(req.page) : 1;
    const limit =  req.limit ? Number(req.limit) : 10;
    const search =  req.search ? req.search : undefined;

    // Query products from database
    const whereClause = {
      AND: [
        search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {},
      ],
    };

    const total = await prisma.customer.count({ where: whereClause });
    const customers = await prisma.customer.findMany({
      where: whereClause,
      include: { orders: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      time: currentTime,
      total: total,
      offset: (page - 1) * limit,
      limit,
      data: customers,
    };
  }

  static async getDetailCustomer(customerId: string) {
    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(customerId)
      },
      include: {
        orders: true
      }
    })
    return customer;
  }

  static async addCustomer(req: { name: string, email: string, phone: string, address: string, password: string }) {
    const { name, email, phone, password, address } = req;

    const existingUser = await prisma.customer.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ResponseError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        password: hashedPassword
      }
    })

    return customer
  }

  static async updateCustomer(req: { name?: string, email?: string, phone?: string, address?: string, password?: string }, customerId: string) {
    const updateData = Object.fromEntries(
      Object.entries(req).filter(([_, value]) => value !== undefined && value !== "")
    );

    await prisma.customer.updateMany({
      where: {
        id: parseInt(customerId)
      },
      data: updateData
    })

    return { msg: "Success to update data" };
  }
}