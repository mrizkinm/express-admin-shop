import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10); // Enkripsi password

  // Menambahkan 10 customer palsu
  for (let i = 0; i < 10; i++) {
    await prisma.customer.create({
      data: {
        name: faker.name.fullName(), // Nama palsu
        email: faker.internet.email(), // Email palsu
        phone: faker.phone.number(), // Nomor telepon palsu
        address: faker.address.streetAddress(), // Alamat palsu
        password: hashedPassword, // Password terenkripsi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log("10 fake customers created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });