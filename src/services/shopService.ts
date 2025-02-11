import prisma from "../config/prisma";
import { ResponseError } from "../errors/responseError";
import path from "path";
import fs from "fs";

export class ShopService {
  static async getData() {
    const shop = await prisma.shop.findUnique({
      where: {
        id: 1
      }
    })

    return shop;
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

  static async updateShop(req: { name?: string, phone?: string, address?: string, email?: string, description?: string, images?: any[] }, protocol: any, host: any) {
    const updateData = Object.fromEntries(
      Object.entries(req).filter(([_, value]) => value !== undefined && value !== "")
    );

    // Tentukan lokasi penyimpanan
    const uploadFolder = path.join(__dirname, "../../public/uploads/shop");

    // Pastikan folder ada
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    // Simpan semua gambar dari Base64 menjadi file
    const imageUrls = req.images?.map((base64: string) => {
      const fileName = this.saveBase64Image(
        base64,
        uploadFolder
      );
      return `${protocol}://${host}/uploads/${fileName}`;
    });

    // Jika ada gambar, tambahkan ke updateData
    if (imageUrls?.length) {
      updateData.image = imageUrls[0]; // Menyimpan hanya gambar pertama
    }

    const shop = await prisma.shop.update({
      where: {
        id: 1
      },
      data: updateData
    })

    return shop
  }
}