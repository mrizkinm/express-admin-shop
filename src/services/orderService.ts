import prisma from "../config/prisma";
import { ResponseError } from "../errors/responseError";

export class OrderService {

  static async getSummary() {
    // Fetch summary data
    const totalCategories = await prisma.category.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.customer.count();

    // Fetch recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "Pending" },
      include: {
        items: true,
        customer: true, // Include customer data
      },
    });

    const summary = {
      summary: {
        totalCategories,
        totalProducts,
        totalOrders,
        totalCustomers,
      },
      recentOrders
    }
    return summary
  }

  static async getOrder(req: {page?: string, limit?: string, status?: string, search?: string}) {
    const page =  req.page ? Number(req.page) : undefined;
    const limit =  req.limit ? Number(req.limit) : undefined;
    const status =  req.status || undefined;
    const search =  req.search || undefined;
    const skip = page && limit ? (page - 1) * limit : undefined;

    // Convert status string to array if exists
    const statusArray = status ? status.split(".").map(String) : [];

    // Query products from database
    const whereClause = {
      AND: [
        search
        ? {
            OR: [
              { customer: { name: { contains: search, mode: "insensitive" as const } } },
              { orderTrxId: { contains: search, mode: "insensitive" as const } }
            ],
          }
        : {},
        statusArray.length > 0 ? { status: { in: statusArray } } : {},
      ],
    };

    const total = await prisma.order.count({ where: whereClause });
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: true,
        items: {
          include: {
            product: true, // Biar dapet detail produk juga
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      time: currentTime,
      total: total,
      offset: skip,
      limit,
      data: orders,
    };
  }

  static async getDetailOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: {
        id: parseInt(orderId)
      },
      include: {
        items: {
          include: {
            product: true // Ini akan menyertakan informasi produk
          }
        },
        customer: true,
      }
    })
    return order;
  }

  static async action(req: { action: string, id: number, items: any[]}) {
    const { action, id, items } = req;

    let status = "";
    if (action === "process") {
      await prisma.order.updateMany({
        where: {
          id: id
        },
        data: {
          status: "Processed"
        }
      })
      status = "Processed"
    }
    if (action === "cancel") {
      const result = await this.updateProductStockFromOrder(id, items);
      status = "Canceled"
      if (!result.success) {
        throw new ResponseError(result.httpStatus, result.error);
      }
    }

    return { message: `Success to ${action} order ${id}`, status: status }
  }

  private static async updateProductStockFromOrder(id: number, items: any[]) {
    try {
      const updateProductQuantities = await prisma.$transaction(async (tx) => {
        // Update status order menjadi Canceled
        await tx.order.updateMany({
          where: {
            id: id
          },
          data: {
            status: "Canceled"
          }
        });
   
        // Cek stok untuk semua produk
        const products = await Promise.all(items.map(item =>
          tx.product.findUnique({
            where: { id: item.productId }
          })
        ));
   
        // Validasi stok
        items.forEach((item, index) => {
          const product = products[index];
          if (!product) {
            throw new ResponseError(400, `Product with id ${item.productId} not found`);
          }
          if (product.quantity < item.quantity) {
            throw new ResponseError(400, `Insufficient stock for product ${item.productId}`);
          }
        });
   
        // Jika semua stok mencukupi, lakukan update
        const updates = await Promise.all(items.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          })
        ));
   
        return updates;
      });
   
      return {
        success: true,
        data: updateProductQuantities,
        httpStatus: 200
      };
   
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        httpStatus: 500
      };
    }
   }
}