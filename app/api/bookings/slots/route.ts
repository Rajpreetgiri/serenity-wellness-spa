import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Booking } from "@/lib/models/Booking";
import { Service } from "@/lib/models/Service";
import { cacheExists } from "@/lib/server/cache";
import { requireAuth, AuthError } from "@/lib/server/auth-middleware";
import { ok, badRequest, unauthorized, notFound, serverError } from "@/lib/server/response";

// Business hours & slot config
const BUSINESS_HOURS = { start: 9, end: 20 }; // 9am - 8pm
const SLOT_INTERVAL = 30; // minutes

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = BUSINESS_HOURS.start; h < BUSINESS_HOURS.end; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const therapist = searchParams.get("therapist");
    const serviceId = searchParams.get("serviceId");

    if (!date || !therapist || !serviceId) {
      return badRequest("date, therapist, and serviceId are required");
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return badRequest("Date must be YYYY-MM-DD format");
    }

    // Don't allow past dates
    const today = new Date().toISOString().split("T")[0];
    if (date < today) return badRequest("Cannot book past dates");

    await connectDB();

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) return notFound("Service not found");

    // Get existing confirmed/pending bookings for this therapist on this date
    const existingBookings = await Booking.find({
      therapist,
      date,
      status: { $in: ["pending", "confirmed"] },
    }).select("time serviceDuration");

    // Compute blocked time ranges from existing bookings
    const blockedRanges = existingBookings.map((b) => {
      const [h, m] = b.time.split(":").map(Number);
      const startMin = h * 60 + m;
      return { start: startMin, end: startMin + b.serviceDuration };
    });

    const allSlots = generateTimeSlots();
    const serviceDuration = service.duration;

    const availableSlots = await Promise.all(
      allSlots.map(async (slot) => {
        const [h, m] = slot.split(":").map(Number);
        const slotStartMin = h * 60 + m;
        const slotEndMin = slotStartMin + serviceDuration;

        // Must end within business hours
        if (slotEndMin > BUSINESS_HOURS.end * 60) return null;

        // Check overlap with existing bookings
        const hasOverlap = blockedRanges.some(
          (r) => slotStartMin < r.end && slotEndMin > r.start
        );
        if (hasOverlap) return null;

        // Check Redis lock (slot temporarily held during booking)
        const lockKey = `slot:${date}:${therapist}:${slot}`;
        const isLocked = await cacheExists(lockKey);
        if (isLocked) return null;

        return slot;
      })
    );

    const slots = availableSlots.filter(Boolean) as string[];

    return ok({ date, therapist, serviceId, serviceDuration, slots });
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/bookings/slots]", err);
    return serverError();
  }
}
