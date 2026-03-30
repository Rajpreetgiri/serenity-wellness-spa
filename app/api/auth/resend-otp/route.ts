import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { cacheSet, cacheExists } from "@/lib/server/cache";
import { sendOTPEmail } from "@/lib/server/email";
import { resendOtpSchema, parseBody } from "@/lib/server/validations";
import { rateLimit } from "@/lib/server/rate-limit";
import { ok, badRequest, notFound, tooManyRequests, serverError } from "@/lib/server/response";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    // 3 OTP requests per 5 minutes per IP
    const limit = await rateLimit(req, { key: "resend-otp", max: 3, windowSeconds: 300 });
    if (!limit.allowed) {
      return tooManyRequests(`Too many OTP requests. Try again in ${limit.retryAfter}s`);
    }

    const body = await req.json();
    const parsed = parseBody(resendOtpSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { email } = parsed.data;

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return notFound("No account found with this email");
    if (user.isVerified) return badRequest("Email is already verified");

    const otp = generateOTP();
    await cacheSet(`otp:${email}`, JSON.stringify({ otp, attempts: 0 }), 300);
    await sendOTPEmail(email, user.name, otp).catch((err) =>
      console.error("[Email] OTP send failed:", err.message)
    );

    return ok(null, "New OTP sent to your email");
  } catch (err) {
    console.error("[POST /api/auth/resend-otp]", err);
    return serverError();
  }
}
