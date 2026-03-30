import { NextRequest } from "next/server";
import { cacheIncr, cacheTTL } from "./cache";

interface RateLimitOptions {
  key: string;
  max: number;
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // seconds
}

export async function rateLimit(
  req: NextRequest,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const cacheKey = `rl:${options.key}:${ip}`;
  const count = await cacheIncr(cacheKey, options.windowSeconds);
  const ttl = await cacheTTL(cacheKey);

  const allowed = count <= options.max;
  const remaining = Math.max(0, options.max - count);

  return { allowed, remaining, retryAfter: allowed ? 0 : ttl };
}
