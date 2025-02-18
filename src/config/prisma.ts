import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);

  // Hapus updatedAt jika hasilnya berupa array atau objek tunggal
  if (Array.isArray(result)) {
    return result.map((item) => {
      if (item.updatedAt) delete item.updatedAt;
      return item;
    });
  }

  if (result && result.updatedAt) {
    delete result.updatedAt;
  }

  return result;
});

export default prisma;