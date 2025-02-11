import {z, ZodType} from "zod";

export class CustomerValidation {

  static readonly addCustomer: ZodType = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    password: z.string().min(6)
  });

  static readonly updateCustomer: ZodType = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().min(1).optional(),
    phone: z.string().min(1).optional(),
    address: z.string().min(1).optional()
  });
}