import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { requireAdmin, AuthError } from "@/lib/server/auth-middleware";
import { ok, badRequest, unauthorized, notFound, forbidden, serverError } from "@/lib/server/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(req);
    await connectDB();

    const user = await User.findById(params.id).select("-password -resetPasswordToken");
    if (!user) return notFound("User not found");

    return ok(user);
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/admin/users/[id]]", err);
    return serverError();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdmin(req);
    const body = await req.json() as { isActive?: boolean; role?: string };

    // Prevent admin from disabling themselves
    if (params.id === admin.userId && body.isActive === false) {
      return forbidden("Cannot disable your own account");
    }

    await connectDB();

    const allowedUpdates: Record<string, unknown> = {};
    if (typeof body.isActive === "boolean") allowedUpdates.isActive = body.isActive;
    if (body.role && ["user", "admin"].includes(body.role)) {
      allowedUpdates.role = body.role;
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: allowedUpdates },
      { new: true }
    ).select("-password");

    if (!user) return notFound("User not found");

    return ok(user, "User updated");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[PUT /api/admin/users/[id]]", err);
    return serverError();
  }
}
