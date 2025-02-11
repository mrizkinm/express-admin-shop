import prisma from "../config/prisma";
import { ResponseError } from "../errors/responseError";
import path from "path";
import fs from "fs";

export class ProductService {
  static async getProduct(req: {page?: string, limit?: string, categories?: any, search?: string}) {
    const page =  req.page ? Number(req.page) : 1;
    const limit =  req.limit ? Number(req.limit) : 10;
    const categories =  req.categories ? req.categories : undefined;
    const search =  req.search ? req.search : undefined;

    // Convert categories string to array if exists
    const categoriesArray = categories ? categories.split(".").map(Number) : [];

    // Query products from database
    const whereClause = {
      AND: [
        search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {},
        categoriesArray.length > 0 ? { categoryId: { in: categoriesArray } } : {},
        { isArchived: false },
      ],
    };

    const totalProducts = await prisma.product.count({ where: whereClause });
    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true, images: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      time: currentTime,
      total: totalProducts,
      offset: (page - 1) * limit,
      limit,
      data: products,
    };

  }

  static async getDetailProduct(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(productId)
      },
      include: {
        category: true
      }
    })
    return product;
  }

  private static async saveBase64Image(base64String: string, folder: string) {
    const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      throw new ResponseError(400, "Invalid Base64 format");
    }
  
    const ext = matches[1]; // Ekstensi file (png, jpg, dll.)
    const base64Data = matches[2]; // Data Base64 tanpa prefix
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`; // Nama file unik
    const filePath = path.join(folder, fileName);
  
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
  
    return fileName; // Kembalikan nama file
  }

  static async addProduct(req: { name: string, price: string, categoryId: string, description: string, isFeatured: string, isArchived: string, quantity: string, images: any[] }, protocol: any, host: any) {
    const name = req.name;
    const price = req.price;
    const categoryId = req.categoryId;
    const description = req.description;
    const isFeatured = req.isFeatured;
    const isArchived = req.isFeatured;
    const quantity = req.quantity;
    const images = req.images;

    // Tentukan lokasi penyimpanan
    const uploadFolder = path.join(__dirname, "../../public/uploads/product");

    // Pastikan folder ada
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    // Mulai transaksi Prisma
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          categoryId: parseInt(categoryId),
          price: parseInt(price),
          quantity: parseInt(quantity),
          description,
          isFeatured: isFeatured === "true", // Mengkonversi dari string
          isArchived: isArchived === "true", // Mengkonversi dari string
        },
      });

       // Simpan semua gambar dari Base64 menjadi file
       const imageUrls = images.map((base64: string) => {
        const fileName = this.saveBase64Image(
          base64,
          uploadFolder
        );
        return `${protocol}://${host}/uploads/${fileName}`;
      });

      // Simpan gambar ke database
      if (imageUrls.length > 0) {
        await tx.image.createMany({
          data: imageUrls.map((url) => ({
            productId: product.id,
            url,
          })),
        });
      }

      return { product, imageUrls };
    });

    return result
  }

  static async updateProduct(req: { name?: string, price?: string, categoryId?: string, description?: string, isFeatured?: string, isArchived?: string, quantity?: string }, productId: string) {
    const updateData = Object.fromEntries(
      Object.entries(req).filter(([_, value]) => value !== undefined && value !== "")
    );

    await prisma.product.updateMany({
      where: {
        id: parseInt(productId)
      },
      data: updateData
    })

    return { msg: "Success to update data" };
  }
}