import {z, ZodType} from "zod";

export class ProductValidation {

  static readonly addProduct: ZodType = z.object({
    name: z.string().min(1),
    images: z.array(z.any()),
    price: z.coerce.number().min(1),
    categoryId: z.coerce.number().min(1),
    isFeatured: z.boolean(),
    isArchived: z.boolean(),
    description: z.string().min(1),
    quantity: z.coerce.number().min(0),
  });

  static readonly updateProduct: ZodType = z.object({
    name: z.string().min(1).optional(),
    images: z.array(z.any()).optional(),
    price: z.coerce.number().min(1).optional(),
    categoryId: z.coerce.number().min(1).optional(),
    isFeatured: z.boolean().optional(),
    isArchived: z.boolean().optional(),
    description: z.string().min(1).optional(),
    quantity: z.coerce.number().min(0).optional(),
  });
}