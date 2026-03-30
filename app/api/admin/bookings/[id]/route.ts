import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Booking } from "@/lib/models/Booking";
import { requireAdmin, AuthError } from "@/lib/server/auth-middleware";
import { updateBookingStatusSchema, parseBody } from "@/lib/server/validations";
import { cacheDel } from "@/lib/server/cache";
import { ok, badRequest, unauthorized, notFound, serverError } from "@/lib/server/response";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(req);

    const body = await req.json();
    const parsed = parseBody(updateBookingStatusSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      {
        $set: {
          status: parsed.data.status,
          ...(parsed.data.cancellationReason && {
            cancellationReason: parsed.data.cancellationReason,
          }),
        },
      },
      { new: true }
    ).populate("userId", "name email");

    if (!booking) return notFound("Booking not found");

    // Invalidate dashboard cache
    await cacheDel("admin:dashboard");

    return ok(booking, "Booking status updated");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[PUT /api/admin/bookings/[id]]", err);
    return serverError();
  }
}
