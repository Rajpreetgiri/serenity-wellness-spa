import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function ok<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, message, data },
    { status }
  );
}

export function created<T>(data: T, message = "Created") {
  return ok(data, message, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, errors?: Record<string, string[]>) {
  return NextResponse.json<ApiResponse>(
    { success: false, message, errors },
    { status: 400 }
  );
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 401 }
  );
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 403 }
  );
}

export function notFound(message = "Not found") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 404 }
  );
}

export function conflict(message: string) {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 409 }
  );
}

export function tooManyRequests(message = "Too many requests") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 429 }
  );
}

export function serverError(message = "Internal server error") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 500 }
  );
}
