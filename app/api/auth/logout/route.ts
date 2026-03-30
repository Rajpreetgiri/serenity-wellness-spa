import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { RefreshToken } from "@/lib/models/RefreshToken";
import { verifyRefreshToken } from "@/lib/server/jwt";
import { requireAuth } from "@/lib/server/auth-middleware";
import { ok, serverError } from "@/lib/server/response";

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const body = await req.json().catch(() => ({}));
    const { refreshToken } = body as { refreshToken?: string };

    await connectDB();

    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await RefreshToken.deleteOne({ tokenId: payload.tokenId });
      } catch {
        // Token invalid — just proceed with logout
      }
    } else {
      // Revoke all sessions for this user
      await RefreshToken.deleteMany({ userId: user.userId });
    }

    return ok(null, "Logged out successfully");
  } catch (err) {
    console.error("[POST /api/auth/logout]", err);
    return serverError();
  }
}
