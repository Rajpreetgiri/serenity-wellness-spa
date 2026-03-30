import { NextRequest } from "next/server";
import { verifyAccessToken, AccessPayload } from "./jwt";

export function getAuthUser(req: NextRequest): AccessPayload | null {
  try {
    const header = req.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return null;
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): AccessPayload {
  const user = getAuthUser(req);
  if (!user) throw new AuthError("Unauthorized");
  return user;
}

export function requireAdmin(req: NextRequest): AccessPayload {
  const user = requireAuth(req);
  if (user.role !== "admin") throw new AuthError("Forbidden", 403);
  return user;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}
