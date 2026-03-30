import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Booking } from "@/lib/models/Booking";
import { requireAdmin, AuthError } from "@/lib/server/auth-middleware";
import { ok, unauthorized, serverError } from "@/lib/server/response";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const date = searchParams.get("date");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") === "asc" ? 1 : -1;

    await connectDB();

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (date) query.date = date;

    let bookings = Booking.find(query)
      .populate("userId", "name email phone")
      .sort({ [sortBy]: sortDir })
      .skip((page - 1) * limit)
      .limit(limit);

    const [results, total] = await Promise.all([
      bookings,
      Booking.countDocuments(query),
    ]);

    // Client-side search filter (for search by customer name/service)
    let filtered = results;
    if (search) {
      const q = search.toLowerCase();
      filtered = results.filter(
        (b) =>
          b.serviceName.toLowerCase().includes(q) ||
          b.therapist.toLowerCase().includes(q) ||
          b.bookingRef.toLowerCase().includes(q)
      );
    }

    return ok({
      bookings: filtered,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/admin/bookings]", err);
    return serverError();
  }
}
