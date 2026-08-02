import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be at most 100 characters"),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be at most 100 characters"),

  phone: z
    .string()
    .max(20, "Phone must be at most 20 characters")
    .optional()
    .or(z.literal("")),
});

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be at most 100 characters"),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be at most 100 characters"),

  phone: z
    .string()
    .max(20, "Phone must be at most 20 characters")
    .optional()
    .or(z.literal("")),
});
