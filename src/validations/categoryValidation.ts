import {z, ZodType} from "zod";

export class CategoryValidation {

  static readonly addCategory: ZodType = z.object({
    name: z.string().min(1)
  });

  static readonly updateCategory: ZodType = z.object({
    name: z.string().min(1)
  });
}