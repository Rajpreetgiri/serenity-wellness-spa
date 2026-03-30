import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { requireAuth, AuthError } from "@/lib/server/auth-middleware";
import { updateProfileSchema, parseBody } from "@/lib/server/validations";
import { ok, badRequest, unauthorized, notFound, serverError } from "@/lib/server/response";

export async function GET(req: NextRequest) {
  try {
    const authUser = requireAuth(req);
    await connectDB();

    const user = await User.findById(authUser.userId);
    if (!user) return notFound("User not found");

    return ok(user);
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/user/profile]", err);
    return serverError();
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = requireAuth(req);

    const body = await req.json();
    const parsed = parseBody(updateProfileSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    await connectDB();

    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );
    if (!user) return notFound("User not found");

    return ok(user, "Profile updated");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[PUT /api/user/profile]", err);
    return serverError();
  }
}
