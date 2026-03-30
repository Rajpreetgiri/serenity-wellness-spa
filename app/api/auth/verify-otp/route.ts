import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { cacheGet, cacheDel } from "@/lib/server/cache";
import { verifyOtpSchema, parseBody } from "@/lib/server/validations";
import { ok, badRequest, notFound, serverError } from "@/lib/server/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseBody(verifyOtpSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { email, otp } = parsed.data;

    // Get stored OTP
    const stored = await cacheGet(`otp:${email}`);
    if (!stored) {
      return badRequest("OTP expired or not found. Please request a new one.");
    }

    const { otp: storedOtp, attempts } = JSON.parse(stored) as {
      otp: string;
      attempts: number;
    };

    // Max 3 attempts
    if (attempts >= 3) {
      await cacheDel(`otp:${email}`);
      return badRequest("Too many failed attempts. Please request a new OTP.");
    }

    if (otp !== storedOtp) {
      // Increment attempts
      const newAttempts = attempts + 1;
      const ttl = 300;
      await import("@/lib/server/cache").then((c) =>
        c.cacheSet(
          `otp:${email}`,
          JSON.stringify({ otp: storedOtp, attempts: newAttempts }),
          ttl
        )
      );
      return badRequest(
        `Incorrect OTP. ${3 - newAttempts} attempts remaining.`
      );
    }

    // OTP correct — activate user
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (!user) return notFound("User not found");

    // Clear OTP
    await cacheDel(`otp:${email}`);

    return ok({ email: user.email }, "Email verified successfully. You can now log in.");
  } catch (err) {
    console.error("[POST /api/auth/verify-otp]", err);
    return serverError();
  }
}
