import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Service } from "@/lib/models/Service";
import { requireAdmin, AuthError } from "@/lib/server/auth-middleware";
import { serviceSchema, parseBody } from "@/lib/server/validations";
import { cacheDel } from "@/lib/server/cache";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/server/response";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    await connectDB();

    const services = await Service.find().sort({ createdAt: -1 });
    return ok(services);
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[GET /api/admin/services]", err);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);

    const body = await req.json();
    const parsed = parseBody(serviceSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    await connectDB();

    const service = await Service.create(parsed.data);
    await cacheDel("services:all:active");

    return created(service, "Service created");
  } catch (err) {
    if (err instanceof AuthError) return unauthorized(err.message);
    console.error("[POST /api/admin/services]", err);
    return serverError();
  }
}
