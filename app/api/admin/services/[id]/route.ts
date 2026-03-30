import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Service } from "@/lib/models/Service";
import { requireAdmin, AuthError } from "@/lib/server/auth-middleware";
import { serviceSchema, parseBody } from "@/lib/server/validations";
import { cacheDel } from "@/lib/server/cache";
import { ok, badRequest, unauthorized, notFound, serverError } from "@/lib/server/response";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(req);

    const body = await req.json();
    const parsed = parseBody(serviceSchema.partial(), body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    await connectDB();

    const service = await Service.findByIdAndUpdate(
      params.id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );
    if (!service) return notFound("Service not found");

    await cacheDel("services:all:active");

    return ok(service, "Service updated");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[PUT /api/admin/services/[id]]", err);
    return serverError();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(req);
    await connectDB();

    const service = await Service.findByIdAndDelete(params.id);
    if (!service) return notFound("Service not found");

    await cacheDel("services:all:active");

    return ok(null, "Service deleted");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[DELETE /api/admin/services/[id]]", err);
    return serverError();
  }
}
