import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Service } from "@/lib/models/Service";
import { cacheGet, cacheSet } from "@/lib/server/cache";
import { ok, serverError } from "@/lib/server/response";

const CACHE_KEY = "services:all:active";
const CACHE_TTL = 300; // 5 min

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const skipCache = !!category;

    // Try cache for full list
    if (!skipCache) {
      const cached = await cacheGet(CACHE_KEY);
      if (cached) return ok(JSON.parse(cached), "Services fetched (cached)");
    }

    await connectDB();

    const query: Record<string, unknown> = { isActive: true };
    if (category) query.category = category;

    const services = await Service.find(query)
      .sort({ bookingCount: -1, name: 1 })
      .lean();

    // Cache full list only
    if (!skipCache) {
      await cacheSet(CACHE_KEY, JSON.stringify(services), CACHE_TTL);
    }

    return ok(services, "Services fetched");
  } catch (err) {
    console.error("[GET /api/services]", err);
    return serverError();
  }
}
