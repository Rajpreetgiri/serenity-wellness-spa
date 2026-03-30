import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { cacheGet, cacheSet } from "@/lib/server/cache";
import { sendOTPEmail } from "@/lib/server/email";
import { registerSchema, parseBody } from "@/lib/server/validations";
import { rateLimit } from "@/lib/server/rate-limit";
import { ok, created, badRequest, conflict, tooManyRequests, serverError } from "@/lib/server/response";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per 15 min per IP
    const limit = await rateLimit(req, { key: "register", max: 5, windowSeconds: 900 });
    if (!limit.allowed) {
      return tooManyRequests(`Too many requests. Try again in ${limit.retryAfter}s`);
    }

    const body = await req.json();
    const parsed = parseBody(registerSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { name, email, password, phone } = parsed.data;

    await connectDB();

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.isVerified) return conflict("Email is already registered");
      // Resend OTP for unverified user
      const otp = generateOTP();
      const otpKey = `otp:${email}`;
      await cacheSet(otpKey, JSON.stringify({ otp, attempts: 0 }), 300);
      await sendOTPEmail(email, existing.name, otp).catch(() => null);
      return ok({ email }, "OTP resent. Please verify your email.");
    }

    // Create unverified user
    const user = await User.create({ name, email, password, phone, isVerified: false });

    // Generate & store OTP
    const otp = generateOTP();
    await cacheSet(`otp:${email}`, JSON.stringify({ otp, attempts: 0 }), 300);

    // Send email (non-blocking — don't fail registration if email fails)
    await sendOTPEmail(email, name, otp).catch((err) =>
      console.error("[Email] OTP send failed:", err.message)
    );

    return created(
      { email: user.email },
      "Account created. Please check your email for the OTP."
    );
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    return serverError();
  }
}
