import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Service } from "@/lib/models/Service";
import { ok, notFound, serverError } from "@/lib/server/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const service = await Service.findOne({
      $or: [{ _id: params.id.match(/^[a-f\d]{24}$/i) ? params.id : null }, { slug: params.id }],
      isActive: true,
    }).lean();

    if (!service) return notFound("Service not found");

    return ok(service);
  } catch (err) {
    console.error("[GET /api/services/[id]]", err);
    return serverError();
  }
}
