import { z } from "zod";

// Individual user data schema
export const userDataSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    parent_name: z.string().min(3).max(50),
    parent_phone: z.string().min(10).max(10),
    grade: z.string().min(1).max(4),
    category: z.enum(['Level 1', 'Level 2', 'Level 3']),
    gender: z.enum(['male', 'female']),
});

// Complete registration request schema
export const registrationSchema = z.object({
    user: userDataSchema,
});

// Legacy schema for backward compatibility
export const userSchema = userDataSchema;