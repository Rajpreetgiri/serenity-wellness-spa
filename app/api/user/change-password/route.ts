import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { RefreshToken } from "@/lib/models/RefreshToken";
import { requireAuth, AuthError } from "@/lib/server/auth-middleware";
import { changePasswordSchema, parseBody } from "@/lib/server/validations";
import { ok, badRequest, unauthorized, notFound, serverError } from "@/lib/server/response";

export async function POST(req: NextRequest) {
  try {
    const authUser = requireAuth(req);

    const body = await req.json();
    const parsed = parseBody(changePasswordSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { currentPassword, newPassword } = parsed.data;

    await connectDB();

    const user = await User.findById(authUser.userId).select("+password");
    if (!user) return notFound("User not found");

    const valid = await user.comparePassword(currentPassword);
    if (!valid) return badRequest("Current password is incorrect");

    if (currentPassword === newPassword) {
      return badRequest("New password must be different from current password");
    }

    user.password = newPassword;
    await user.save();

    // Revoke all other refresh tokens for security
    await RefreshToken.deleteMany({ userId: user._id });

    return ok(null, "Password changed successfully. Please log in again.");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[POST /api/user/change-password]", err);
    return serverError();
  }
}
