import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    parentName: z.string().min(3).max(50),
    parentPhone: z.string().min(10).max(10),
    grade: z.string().min(1).max(2),
});

export const paymentSchema = z.object({
    amount: z
      .number()
      .positive("Amount must be a positive number"),
    
    currency: z
      .string()
      .default("INR"),
    
    orderId: z
      .string()
      .min(1, "Order ID is required")
  });