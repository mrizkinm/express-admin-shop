import {z, ZodType} from "zod";

export class ProductValidation {

  static readonly addProduct: ZodType = z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    categoryId: z.coerce.number().min(1),
    isFeatured: z.coerce.boolean(), // string → boolean
    isArchived: z.coerce.boolean(), // string → boolean
    description: z.string().min(1),
    quantity: z.coerce.number().min(0),
  });

  static readonly updateProduct: ZodType = z.object({
    name: z.string().min(1).optional(),
    price: z.coerce.number().min(1).optional(),
    categoryId: z.coerce.number().min(1).optional(),
    isFeatured: z.coerce.boolean(), // string → boolean
    isArchived: z.coerce.boolean(), // string → boolean
    description: z.string().min(1).optional(),
    quantity: z.coerce.number().min(0).optional(),
  });
}