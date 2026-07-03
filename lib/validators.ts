import { z } from "zod";

// Passenger booking form
export const passengerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  nationality: z.string().min(1, "Select your nationality"),
  passportNo: z.string().optional(),
  passengers: z.number().min(1).max(9),
  specialRequests: z.string().optional(),
  agreeToTerms: z.literal(true, { error: "You must agree to the terms" }),
});

export type PassengerSchema = z.infer<typeof passengerSchema>;

// Contact form
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactSchema = z.infer<typeof contactSchema>;
