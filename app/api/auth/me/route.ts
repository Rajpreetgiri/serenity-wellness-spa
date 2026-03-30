import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { requireAuth, AuthError } from "@/lib/server/auth-middleware";
import { ok, unauthorized, notFound, serverError } from "@/lib/server/response";

export async function GET(req: NextRequest) {
  try {
    const authUser = requireAuth(req);
    await connectDB();

    const user = await User.findById(authUser.userId).select("-password");
    if (!user || !user.isActive) return notFound("User not found");

    return ok(user, "User fetched");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/auth/me]", err);
    return serverError();
  }
}
