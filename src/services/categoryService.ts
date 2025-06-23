import prisma from "../config/prisma";
import { ResponseError } from "../errors/responseError";
import path from "path";
import fs from "fs";

export class CategoryService {

  static async getCategory(req: {page?: string, limit?: string, search?: string}) {
    const page =  req.page ? Number(req.page) : undefined;
    const limit =  req.limit ? Number(req.limit) : undefined;
    const search =  req.search || undefined;
    const skip = page && limit ? (page - 1) * limit : undefined;
    
    // Query products from database
    const whereClause = {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" as const } } : {},
      ],
    };

    const total = await prisma.category.count({ where: whereClause });
    const categories = await prisma.category.findMany({
      where: whereClause,
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
      data: categories,
    };
  }

  static async getDetailCategory(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(categoryId)
      }
    })
    return category;
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

  static async addCategory(req: { name: string }, files: Express.Multer.File[], protocol: any, host: any) {
    const { name } = req;

    // Tentukan lokasi penyimpanan
    const uploadFolder = path.join(__dirname, "../../public/uploads/category");

    // Pastikan folder ada
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const filePath = path.join(uploadFolder, fileName);

      fs.writeFileSync(filePath, file.buffer);

      imageUrls.push(`${protocol}://${host}/category/${fileName}`);
    }

    // Mulai transaksi Prisma
    const category = await prisma.category.create({
      data: {
        name,
        image: imageUrls[0]
      }
    });
    
    return category;
  }

  static async updateCategory(req: {name?: string}, categoryId: string, files?: Express.Multer.File[], protocol?: any, host?: any) {
    const updateData = Object.fromEntries(
      Object.entries(req).filter(([_, value]) => value !== undefined && value !== "")
    );

    if (files) {
      // Tentukan lokasi penyimpanan
      const uploadFolder = path.join(__dirname, "../../public/uploads/category");

      // Pastikan folder ada
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      const imageUrls: string[] = [];

      for (const file of files) {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const filePath = path.join(uploadFolder, fileName);

        fs.writeFileSync(filePath, file.buffer);

        imageUrls.push(`${protocol}://${host}/category/${fileName}`);
      }

      updateData.image = imageUrls[0]; // Update hanya dengan gambar pertama
    }

    await prisma.category.updateMany({
      where: {
        id: parseInt(categoryId)
      },
      data: updateData
    })

    return { message: "Success to update data" };
  }
}