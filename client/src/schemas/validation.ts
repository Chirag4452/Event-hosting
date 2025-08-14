import { z } from 'zod';

// Registration schema with validation rules
export const registrationSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  
  email: z
    .string()
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  
  event_type: z
    .string()
    .min(1, 'Please select an event type'),
  
  participant_type: z
    .string()
    .min(1, 'Please select a participant type'),
  
  emergency_contact: z
    .string()
    .min(3, 'Emergency contact name must be at least 3 characters long')
    .max(50, 'Emergency contact name cannot exceed 50 characters'),
  
  age: z
    .number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age cannot exceed 120'),
});

// Infer TypeScript type from the schema
export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Validation function
export const validateRegistrationData = (data: unknown): RegistrationFormData => {
  return registrationSchema.parse(data);
};

// Safe validation function that returns validation result
export const safeValidateRegistrationData = (data: unknown): { success: boolean; data?: RegistrationFormData; errors?: z.ZodError } => {
  try {
    const validatedData = registrationSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    return { success: false };
  }
};
