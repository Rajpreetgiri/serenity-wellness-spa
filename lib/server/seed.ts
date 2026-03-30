/**
 * Run once to seed initial services and admin user.
 * npx ts-node lib/server/seed.ts
 * OR call GET /api/admin/seed in development
 */
import { connectDB } from "./db";
import { Service } from "../models/Service";
import { User } from "../models/User";

const SERVICES = [
  {
    name: "Swedish Massage",
    category: "Relaxation",
    duration: 60,
    price: 110,
    description:
      "A gentle full-body massage perfect for relaxation and stress relief. Uses long, gliding strokes to soothe tense muscles.",
    therapists: ["Emma Chen", "Liam Torres", "Mia Johnson"],
  },
  {
    name: "Deep Tissue Massage",
    category: "Therapeutic",
    duration: 60,
    price: 130,
    description:
      "Targets deep layers of muscle and connective tissue to release chronic tension and muscle knots.",
    therapists: ["Liam Torres", "Emma Chen"],
  },
  {
    name: "Hot Stone Massage",
    category: "Luxury",
    duration: 90,
    price: 180,
    description:
      "Smooth heated basalt stones are used to warm and relax muscles for a deeply restorative experience.",
    therapists: ["Emma Chen", "Mia Johnson"],
  },
  {
    name: "Aromatherapy Ritual",
    category: "Relaxation",
    duration: 75,
    price: 155,
    description:
      "Combines therapeutic massage with carefully selected essential oils to balance mind, body, and spirit.",
    therapists: ["Mia Johnson", "Emma Chen"],
  },
  {
    name: "Couples Retreat",
    category: "Couples",
    duration: 120,
    price: 320,
    description:
      "A shared wellness experience for two. Both partners enjoy side-by-side massages in our private couples suite.",
    therapists: ["Emma Chen & Liam Torres"],
  },
  {
    name: "Bamboo Fusion",
    category: "Luxury",
    duration: 90,
    price: 175,
    description:
      "A unique treatment using warm bamboo sticks to massage, relax and energise the body.",
    therapists: ["Liam Torres"],
  },
  {
    name: "Prenatal Massage",
    category: "Specialty",
    duration: 60,
    price: 140,
    description:
      "Specially designed for expectant mothers, this nurturing massage relieves the aches of pregnancy.",
    therapists: ["Mia Johnson", "Emma Chen"],
  },
  {
    name: "Reflexology",
    category: "Therapeutic",
    duration: 45,
    price: 90,
    description:
      "Therapeutic foot massage that applies pressure to specific points to promote healing throughout the body.",
    therapists: ["Liam Torres", "Mia Johnson"],
  },
];

export async function seedDatabase(): Promise<{ message: string }> {
  await connectDB();

  // Seed services
  const existingCount = await Service.countDocuments();
  if (existingCount === 0) {
    await Service.insertMany(SERVICES);
  }

  // Seed admin user
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    await User.create({
      name: "Admin User",
      email: "admin@wellness.com",
      password: "Admin@123",
      role: "admin",
      isVerified: true,
      isActive: true,
    });
  }

  return {
    message: `Seeded ${existingCount === 0 ? SERVICES.length : 0} services. Admin: admin@wellness.com / Admin@123`,
  };
}
