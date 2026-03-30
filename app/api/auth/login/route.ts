import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/server/db";
import { User } from "@/lib/models/User";
import { RefreshToken } from "@/lib/models/RefreshToken";
import { signAccessToken, signRefreshToken } from "@/lib/server/jwt";
import { loginSchema, parseBody } from "@/lib/server/validations";
import { rateLimit } from "@/lib/server/rate-limit";
import { ok, badRequest, unauthorized, tooManyRequests, serverError } from "@/lib/server/response";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 login attempts per 15 min per IP
    const limit = await rateLimit(req, { key: "login", max: 5, windowSeconds: 900 });
    if (!limit.allowed) {
      return tooManyRequests(
        `Too many login attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes`
      );
    }

    const body = await req.json();
    const parsed = parseBody(loginSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { email, password } = parsed.data;

    await connectDB();

    // Fetch with password (select: false in schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user) return unauthorized("Invalid email or password");
    if (!user.isActive) return unauthorized("Your account has been disabled. Contact support.");
    if (!user.isVerified) {
      return unauthorized(
        "Email not verified. Please verify your email first.",
      );
    }

    const passwordValid = await user.comparePassword(password);
    if (!passwordValid) return unauthorized("Invalid email or password");

    // Issue tokens
    const tokenId = uuidv4();
    const accessToken = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const refreshToken = signRefreshToken({
      userId: user._id.toString(),
      tokenId,
    });

    // Store refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await RefreshToken.create({ tokenId, userId: user._id, expiresAt });

    const userData = user.toJSON();

    return ok(
      {
        accessToken,
        refreshToken,
        user: userData,
      },
      "Login successful"
    );
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return serverError();
  }
}
