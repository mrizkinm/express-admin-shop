import prisma from "../src/config/prisma";

export class UserTest {

    static async delete() {
        await prisma.user.deleteMany({
            where: {
              email: "test@example.com"
            }
        })
    }

    static async create() {
        await prisma.user.create({
          data: {
            email: 'test@example.com',
            password: '$2b$10$3.dOpPqGY1uaw4vmeNvdvuas44//pXBn6Tc15iNVlSORNIJWdM5K6',
            name: 'Test',
          },
        })
    }
  }