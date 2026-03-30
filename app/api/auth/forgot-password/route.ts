import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { sendPasswordResetEmail } from "@/lib/server/email";
import { forgotPasswordSchema, parseBody } from "@/lib/server/validations";
import { rateLimit } from "@/lib/server/rate-limit";
import { ok, badRequest, tooManyRequests, serverError } from "@/lib/server/response";

export async function POST(req: NextRequest) {
  try {
    const limit = await rateLimit(req, { key: "forgot-password", max: 3, windowSeconds: 900 });
    if (!limit.allowed) {
      return tooManyRequests(`Too many requests. Try again in ${limit.retryAfter}s`);
    }

    const body = await req.json();
    const parsed = parseBody(forgotPasswordSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { email } = parsed.data;

    await connectDB();
    const user = await User.findOne({ email });

    // Always return success (don't reveal if email exists)
    if (!user || !user.isVerified) {
      return ok(null, "If an account exists with this email, a reset link has been sent.");
    }

    // Generate reset token (1 hour expiry)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      { resetPasswordToken: token, resetPasswordExpires: expires }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, user.name, resetLink).catch((err) =>
      console.error("[Email] Password reset send failed:", err.message)
    );

    return ok(null, "If an account exists with this email, a reset link has been sent.");
  } catch (err) {
    console.error("[POST /api/auth/forgot-password]", err);
    return serverError();
  }
}
