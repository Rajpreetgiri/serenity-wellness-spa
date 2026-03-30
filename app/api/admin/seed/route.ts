import { NextRequest } from "next/server";
import { seedDatabase } from "@/lib/server/seed";
import { ok, forbidden, serverError } from "@/lib/server/response";

// Only accessible in development
export async function GET(_req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return forbidden("Seed endpoint is disabled in production");
  }

  try {
    const result = await seedDatabase();
    return ok(result, result.message);
  } catch (err) {
    console.error("[GET /api/admin/seed]", err);
    return serverError();
  }
}
