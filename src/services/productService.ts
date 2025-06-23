import prisma from "../config/prisma";
import { ResponseError } from "../errors/responseError";
import path from "path";
import fs from "fs";

export class ProductService {
  static async getProduct(req: {page?: string, limit?: string, categories?: any, search?: string}) {
    const page =  req.page ? Number(req.page) : undefined;
    const limit =  req.limit ? Number(req.limit) : undefined;
    const categories =  req.categories || undefined;
    const search =  req.search || undefined;
    const skip = page && limit ? (page - 1) * limit : undefined;

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
      skip: skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      time: currentTime,
      total: totalProducts,
      offset: skip,
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
        category: true,
        images: true
      }
    })
    return product;
  }

  // private static async saveBase64Image(base64String: string, folder: string) {
  //   const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  //   if (!matches) {
  //     throw new ResponseError(400, "Invalid Base64 format");
  //   }
  
  //   const ext = matches[1]; // Ekstensi file (png, jpg, dll.)
  //   const base64Data = matches[2]; // Data Base64 tanpa prefix
  //   const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`; // Nama file unik
  //   const filePath = path.join(folder, fileName);
  
  //   fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
  
  //   return fileName; // Kembalikan nama file
  // }

  static async addProduct(req: { name: string, price: number, categoryId: number, description: string, isFeatured: boolean, isArchived: boolean, quantity: number }, files: Express.Multer.File[], protocol: any, host: any) {
    const { name, price, categoryId, description, isFeatured, isArchived, quantity } = req;

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
          categoryId: Number(categoryId),
          price: Number(price),
          quantity: Number(quantity),
          description,
          isFeatured: isFeatured === true || (typeof isFeatured === "string" && isFeatured === "true"),
          isArchived: isArchived === true || (typeof isArchived === "string" && isArchived === "true"),
        },
      });

      const imageUrls: string[] = [];

      for (const file of files) {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const filePath = path.join(uploadFolder, fileName);

        fs.writeFileSync(filePath, file.buffer);

        imageUrls.push(`${protocol}://${host}/product/${fileName}`);
      }

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

  static async updateProduct(req: { name?: string, price?: number, categoryId?: number, description?: string, isFeatured: boolean, isArchived: boolean, quantity: number }, productId: string, files?: Express.Multer.File[], protocol?: any, host?: any) {
    // const updateData = Object.fromEntries(
    //   Object.entries(req).filter(([_, value]) => value !== undefined && value !== "")
    // );
    
    // delete updateData.images;

    // await prisma.product.updateMany({
    //   where: {
    //     id: parseInt(productId)
    //   },
    //   data: updateData
    // })

    // return { message: "Success to update data" };

    const updateData: any = {};

    if (req.name !== undefined) updateData.name = req.name;
    if (req.categoryId !== undefined) updateData.categoryId = Number(req.categoryId);
    if (req.price !== undefined) updateData.price = Number(req.price);
    if (req.quantity !== undefined) updateData.quantity = Number(req.quantity);
    if (req.description !== undefined) updateData.description = req.description;

    if (req.isFeatured !== undefined) {
      updateData.isFeatured =
        req.isFeatured === true ||
        (typeof req.isFeatured === "string" && req.isFeatured === "true");
    }

    if (req.isArchived !== undefined) {
      updateData.isArchived =
        req.isArchived === true ||
        (typeof req.isArchived === "string" && req.isArchived === "true");
    }
    
    // Folder upload
    const uploadFolder = path.join(__dirname, "../../public/uploads/product");
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    
    const result = await prisma.$transaction(async (tx) => {
      // Update data product

      const product = await tx.product.update({
        where: {
          id: parseInt(productId),
        },
        data: updateData,
      });

      let imageUrls: string[] = [];

      if (files && files.length > 0) {
        // Optional: Hapus gambar lama dari DB (dan file system kalau mau)
        const existingImages = await tx.image.findMany({ where: { productId: product.id } });

        for (const image of existingImages) {
          const filename = image.url.split("/").pop();
          const filePath = path.join(uploadFolder, filename || "");
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        await tx.image.deleteMany({ where: { productId: product.id } });

        // Simpan gambar baru
        for (const file of files) {
          const ext = path.extname(file.originalname);
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
          const filePath = path.join(uploadFolder, fileName);

          fs.writeFileSync(filePath, file.buffer);

          imageUrls.push(`${protocol}://${host}/product/${fileName}`);
        }

        await tx.image.createMany({
          data: imageUrls.map((url) => ({
            productId: product.id,
            url,
          })),
        });
      }

      return { product, imageUrls };
    });

    return result;
  }
}