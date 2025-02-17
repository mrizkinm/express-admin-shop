import {z, ZodType} from "zod";

export class UserValidation {

  static readonly login: ZodType = z.object({
    email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
    password: z.string().min(6, "Password harus memiliki minimal 6 karakter"),
  });

  static readonly logout: ZodType = z.object({
    id: z.number().int()
  });

  static readonly updateAccount: ZodType = z.object({
    name: z.string().min(3, { message: 'Nama minimal 3 karakter' }).max(50, { message: 'Nama maksimal 50 karakter' }).optional(),
    email: z.string().email({ message: 'Format email tidak valid' }).optional(),
    id: z.number().int()
  });

  static readonly password: ZodType = z.object({
    id: z.number().int(),
    currentPassword: z.string().min(1, { message: 'Password saat ini harus diisi' }),
    newPassword: z.string().min(6, { message: 'Password minimal 6 karakter' }),
    confirmPassword: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });
}