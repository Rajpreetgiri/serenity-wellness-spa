import mongoose, { Document, Schema } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  bookingRef: string; // e.g. BK-00123
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  therapist: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: BookingStatus;
  notes?: string;
  cancellationReason?: string;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingRef: {
      type: String,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceName: { type: String, required: true },
    servicePrice: { type: Number, required: true },
    serviceDuration: { type: Number, required: true },
    therapist: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: [true, "Booking date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"],
    },
    time: {
      type: String,
      required: [true, "Booking time is required"],
      match: [/^\d{2}:\d{2}$/, "Time must be HH:MM format"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String, maxlength: 500 },
    cancellationReason: { type: String },
    emailSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Auto-generate booking reference
BookingSchema.pre("save", async function () {
  if (!this.bookingRef) {
    const BookingModel = mongoose.model<IBooking>("Booking");
    const count = await BookingModel.countDocuments();
    this.bookingRef = `BK-${String(count + 1).padStart(5, "0")}`;
  }
});

BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ date: 1, therapist: 1, status: 1 });
BookingSchema.index({ bookingRef: 1 });

export const Booking =
  (mongoose.models.Booking as mongoose.Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);
