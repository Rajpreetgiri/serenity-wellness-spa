import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { RefreshToken } from "@/lib/models/RefreshToken";
import { resetPasswordSchema, parseBody } from "@/lib/server/validations";
import { ok, badRequest, notFound, serverError } from "@/lib/server/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseBody(resetPasswordSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { token, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      return badRequest("Reset link is invalid or has expired. Please request a new one.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Revoke all refresh tokens — force re-login
    await RefreshToken.deleteMany({ userId: user._id });

    return ok(null, "Password reset successful. Please log in with your new password.");
  } catch (err) {
    console.error("[POST /api/auth/reset-password]", err);
    return serverError();
  }
}
