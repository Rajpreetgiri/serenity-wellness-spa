import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password too long"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric"),
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(72),
});

// ─── Booking ──────────────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  therapist: z.string().min(1, "Therapist is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  notes: z.string().max(500).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  cancellationReason: z.string().max(200).optional(),
});

// ─── Service ──────────────────────────────────────────────────────────────────

export const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(["Relaxation", "Therapeutic", "Luxury", "Couples", "Specialty"]),
  duration: z.number().int().min(15).max(480),
  price: z.number().min(0).max(9999),
  description: z.string().min(10).max(1000),
  image: z.string().optional(),
  therapists: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
});

// ─── User Profile ─────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  phone: z.string().max(20).optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse and return data or throw formatted error response */
export function parseBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };

  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join(".") || "root";
    if (!errors[field]) errors[field] = [];
    errors[field].push(issue.message);
  }
  return { success: false, errors };
}
