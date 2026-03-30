import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { RefreshToken } from "@/lib/models/RefreshToken";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/server/jwt";
import { ok, badRequest, unauthorized, serverError } from "@/lib/server/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = body as { refreshToken?: string };
    if (!refreshToken) return badRequest("Refresh token is required");

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return unauthorized("Invalid or expired refresh token");
    }

    await connectDB();

    // Verify token exists in DB and not revoked
    const stored = await RefreshToken.findOne({
      tokenId: payload.tokenId,
      userId: payload.userId,
    });

    if (!stored) return unauthorized("Refresh token has been revoked");
    if (stored.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: stored._id });
      return unauthorized("Refresh token expired. Please log in again.");
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) return unauthorized("User not found or disabled");

    // Rotate refresh token — delete old, issue new
    await RefreshToken.deleteOne({ _id: stored._id });

    const newTokenId = uuidv4();
    const accessToken = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = signRefreshToken({
      userId: user._id.toString(),
      tokenId: newTokenId,
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ tokenId: newTokenId, userId: user._id, expiresAt });

    return ok({ accessToken, refreshToken: newRefreshToken }, "Token refreshed");
  } catch (err) {
    console.error("[POST /api/auth/refresh]", err);
    return serverError();
  }
}
