import { z } from "zod";

// Individual user data schema
export const userDataSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    parent_name: z.string().min(3).max(50),
    parent_phone: z.string().min(10).max(10),
    grade: z.string().min(1).max(2),
});

// Payment data schema
export const paymentSchema = z.object({
    amount: z
      .number()
      .positive("Amount must be a positive number"),
    
    currency: z
      .string()
      .default("INR"),
    
    order_id: z
      .string()
      .min(1, "Order ID is required")
});

// Complete registration request schema
export const registrationSchema = z.object({
    user: userDataSchema,
    payment: paymentSchema
});

// Legacy schema for backward compatibility
export const userSchema = userDataSchema;