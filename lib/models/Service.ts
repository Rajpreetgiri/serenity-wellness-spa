import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  duration: number; // minutes
  price: number; // AUD
  description: string;
  image: string;
  therapists: string[];
  isActive: boolean;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Relaxation", "Therapeutic", "Luxury", "Couples", "Specialty"],
    },
    duration: {
      type: Number,
      required: true,
      min: [15, "Duration must be at least 15 minutes"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    image: {
      type: String,
      default: "/images/services/default.jpg",
    },
    therapists: {
      type: [String],
      default: ["Emma Chen", "Liam Torres", "Mia Johnson"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Auto-generate slug from name
ServiceSchema.pre("save", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

ServiceSchema.index({ category: 1, isActive: 1 });
ServiceSchema.index({ slug: 1 });

export const Service =
  (mongoose.models.Service as mongoose.Model<IService>) ||
  mongoose.model<IService>("Service", ServiceSchema);
