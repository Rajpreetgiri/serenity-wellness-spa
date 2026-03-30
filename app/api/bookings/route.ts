import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Booking } from "@/lib/models/Booking";
import { Service } from "@/lib/models/Service";
import { cacheSet, cacheDel, cacheExists } from "@/lib/server/cache";
import { sendBookingConfirmationEmail } from "@/lib/server/email";
import { requireAuth, AuthError } from "@/lib/server/auth-middleware";
import { createBookingSchema, parseBody } from "@/lib/server/validations";
import { User } from "@/lib/models/User";
import {
  ok, created, badRequest, unauthorized, notFound, conflict, serverError,
} from "@/lib/server/response";
import { format } from "date-fns";

const SLOT_LOCK_TTL = parseInt(process.env.SLOT_LOCK_SECONDS || "600");

// ─── GET: user's bookings ─────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const authUser = requireAuth(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));

    await connectDB();

    const query: Record<string, unknown> = { userId: authUser.userId };
    if (status) query.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("serviceId", "name image category"),
      Booking.countDocuments(query),
    ]);

    return ok(
      { bookings },
      "Bookings fetched",
      200
    );
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/bookings]", err);
    return serverError();
  }
}

// ─── POST: create booking ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const authUser = requireAuth(req);

    const body = await req.json();
    const parsed = parseBody(createBookingSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { serviceId, therapist, date, time, notes } = parsed.data;

    // Validate date is not in the past
    const today = new Date().toISOString().split("T")[0];
    if (date < today) return badRequest("Cannot book past dates");

    await connectDB();

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) return notFound("Service not found or unavailable");

    // Verify therapist is valid for this service
    if (!service.therapists.includes(therapist)) {
      return badRequest("Selected therapist is not available for this service");
    }

    // ── Slot conflict check (DB) ──────────────────────────────────────────────
    const slotStart = time;
    const [h, m] = time.split(":").map(Number);
    const slotStartMin = h * 60 + m;
    const slotEndMin = slotStartMin + service.duration;

    const conflicting = await Booking.findOne({
      therapist,
      date,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflicting) {
      // Check actual overlap
      const [ch, cm] = conflicting.time.split(":").map(Number);
      const cStart = ch * 60 + cm;
      const cEnd = cStart + conflicting.serviceDuration;
      if (slotStartMin < cEnd && slotEndMin > cStart) {
        return conflict("This time slot is no longer available. Please choose another.");
      }
    }

    // ── Redis slot lock ───────────────────────────────────────────────────────
    const lockKey = `slot:${date}:${therapist}:${time}`;
    const alreadyLocked = await cacheExists(lockKey);
    if (alreadyLocked) {
      return conflict("This slot is temporarily held by another booking. Please try again shortly.");
    }

    // Acquire lock for SLOT_LOCK_TTL seconds
    await cacheSet(lockKey, authUser.userId, SLOT_LOCK_TTL);

    try {
      // Create booking
      const booking = await Booking.create({
        userId: authUser.userId,
        serviceId: service._id,
        serviceName: service.name,
        servicePrice: service.price,
        serviceDuration: service.duration,
        therapist,
        date,
        time,
        notes,
        status: "pending",
      });

      // Increment service booking count
      Service.updateOne({ _id: service._id }, { $inc: { bookingCount: 1 } }).exec();

      // Send confirmation email (non-blocking)
      const user = await User.findById(authUser.userId);
      if (user) {
        sendBookingConfirmationEmail(user.email, user.name, {
          bookingId: booking.bookingRef,
          service: service.name,
          therapist,
          date: format(new Date(date), "EEEE, MMMM d, yyyy"),
          time,
          duration: service.duration,
          price: service.price,
        }).catch((err) =>
          console.error("[Email] Booking confirmation failed:", err.message)
        );
      }

      return created(booking, "Booking created successfully");
    } finally {
      // Release lock — DB record now holds the reservation
      await cacheDel(lockKey);
    }
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[POST /api/bookings]", err);
    return serverError();
  }
}
