import {z, ZodType} from "zod";

export class OrderValidation {

  static readonly action: ZodType = z.object({
    action: z.enum(['process', 'cancel']),
    id: z.number().min(1),
    items: z.array(z.any())
  });
}