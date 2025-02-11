import {z, ZodType} from "zod";

export class ShopValidation {

  static readonly updateShop: ZodType = z.object({
    name: z.string()
      .min(3, { message: 'Nama minimal 3 karakter' })
      .max(50, { message: 'Nama maksimal 50 karakter' }).optional(),
    address: z.string().min(1).optional(),
    phone: z.string().max(15).optional(),
    email: z.string().min(1).email().optional(),
    description: z.string().min(1).optional(),
    images: z.array(z.any()).optional(),
  });
}