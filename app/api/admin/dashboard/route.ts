import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Booking } from "@/lib/models/Booking";
import { User } from "@/lib/models/User";
import { Service } from "@/lib/models/Service";
import { requireAdmin, AuthError } from "@/lib/server/auth-middleware";
import { cacheGet, cacheSet } from "@/lib/server/cache";
import { ok, unauthorized, serverError } from "@/lib/server/response";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const cached = await cacheGet("admin:dashboard");
    if (cached) return ok(JSON.parse(cached), "Dashboard stats (cached)");

    await connectDB();

    const today = new Date().toISOString().split("T")[0];
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [
      totalBookings,
      todayBookings,
      pendingBookings,
      confirmedBookings,
      totalUsers,
      activeUsers,
      totalServices,
      revenueResult,
      recentBookings,
      monthlyTrend,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ date: today }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", isActive: true }),
      Service.countDocuments({ isActive: true }),
      Booking.aggregate([
        { $match: { status: { $in: ["confirmed", "completed"] } } },
        { $group: { _id: null, total: { $sum: "$servicePrice" } } },
      ]),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email"),
      // Last 6 months trend
      Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            revenue: { $sum: "$servicePrice" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const stats = {
      totalBookings,
      todayBookings,
      pendingBookings,
      confirmedBookings,
      totalUsers,
      activeUsers,
      totalServices,
      totalRevenue: revenueResult[0]?.total || 0,
      recentBookings,
      monthlyTrend: monthlyTrend.map((m) => ({
        month: new Date(m._id.year, m._id.month - 1).toLocaleDateString("en-AU", {
          month: "short",
          year: "2-digit",
        }),
        bookings: m.count,
        revenue: m.revenue,
      })),
    };

    await cacheSet("admin:dashboard", JSON.stringify(stats), 120); // 2 min cache

    return ok(stats, "Dashboard stats");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/admin/dashboard]", err);
    return serverError();
  }
}
