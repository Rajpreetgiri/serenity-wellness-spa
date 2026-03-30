import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Booking } from "@/lib/models/Booking";
import { requireAuth, AuthError } from "@/lib/server/auth-middleware";
import { updateBookingStatusSchema, parseBody } from "@/lib/server/validations";
import { ok, badRequest, unauthorized, notFound, forbidden, serverError } from "@/lib/server/response";

// ─── GET single booking ───────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = requireAuth(req);
    await connectDB();

    const booking = await Booking.findById(params.id).populate(
      "serviceId",
      "name image category"
    );
    if (!booking) return notFound("Booking not found");

    // User can only view their own bookings (admin can view all — handled in admin routes)
    if (
      authUser.role !== "admin" &&
      booking.userId.toString() !== authUser.userId
    ) {
      return forbidden("You don't have permission to view this booking");
    }

    return ok(booking);
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/bookings/[id]]", err);
    return serverError();
  }
}

// ─── PATCH: cancel booking (user) ────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = requireAuth(req);
    await connectDB();

    const booking = await Booking.findById(params.id);
    if (!booking) return notFound("Booking not found");

    if (booking.userId.toString() !== authUser.userId) {
      return forbidden("You don't have permission to modify this booking");
    }

    if (booking.status === "cancelled") {
      return badRequest("Booking is already cancelled");
    }
    if (booking.status === "completed") {
      return badRequest("Cannot cancel a completed booking");
    }

    const body = await req.json();
    const { cancellationReason } = body as { cancellationReason?: string };

    booking.status = "cancelled";
    if (cancellationReason) booking.cancellationReason = cancellationReason;
    await booking.save();

    return ok(booking, "Booking cancelled");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[PATCH /api/bookings/[id]]", err);
    return serverError();
  }
}
