import { z } from "zod";

export const addressSchema = z.object({
  address_line1: z
    .string()
    .min(1, "Address line 1 is required")
    .max(255, "Address line 1 must be at most 255 characters"),
  address_line2: z
    .string()
    .max(255, "Address line 2 must be at most 255 characters")
    .optional()
    .or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  state: z
    .string()
    .max(100, "State must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  postal_code: z
    .string()
    .max(20, "Postal code must be at most 20 characters")
    .optional()
    .or(z.literal("")),
  country: z.string().min(1, "Country is required").max(100),
  is_default: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
