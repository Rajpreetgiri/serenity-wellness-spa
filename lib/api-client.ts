/**
 * Central API client.
 * Handles auth tokens, auto-refresh, and consistent error handling.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Token storage helpers (localStorage, safe for SSR)
function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem("serenity_access"),
    refresh: localStorage.getItem("serenity_refresh"),
  };
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("serenity_access", access);
  localStorage.setItem("serenity_refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("serenity_access");
  localStorage.removeItem("serenity_refresh");
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  const { refresh } = getTokens();
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    setTokens(data.data.accessToken, data.data.refreshToken);
    return data.data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const { access } = getTokens();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, options, false);
    }
    clearTokens();
    // Redirect to login if in browser
    if (typeof window !== "undefined") {
      window.location.href = "/login?session=expired";
    }
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  const json = await res.json().catch(() => ({ success: false, message: "Network error" }));

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.message || "An error occurred",
      res.status,
      json.errors
    );
  }

  return json.data as T;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<{ email: string }>("/auth/register", data),

  verifyOtp: (data: { email: string; otp: string }) =>
    api.post<{ email: string }>("/auth/verify-otp", data),

  resendOtp: (email: string) =>
    api.post("/auth/resend-otp", { email }),

  login: async (data: { email: string; password: string }) => {
    const result = await api.post<{
      accessToken: string;
      refreshToken: string;
      user: UserData;
    }>("/auth/login", data);
    setTokens(result.accessToken, result.refreshToken);
    return result;
  },

  logout: async (refreshToken?: string) => {
    try {
      await api.post("/auth/logout", { refreshToken });
    } finally {
      clearTokens();
    }
  },

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (data: { token: string; password: string }) =>
    api.post("/auth/reset-password", data),

  me: () => api.get<UserData>("/auth/me"),
};

// ─── Booking API ──────────────────────────────────────────────────────────────

export const bookingApi = {
  getSlots: (params: { serviceId: string; therapist: string; date: string }) => {
    const q = new URLSearchParams(params).toString();
    return api.get<{ slots: string[]; serviceDuration: number }>(`/bookings/slots?${q}`);
  },

  create: (data: {
    serviceId: string;
    therapist: string;
    date: string;
    time: string;
    notes?: string;
  }) => api.post<BookingData>("/bookings", data),

  getMyBookings: (status?: string) => {
    const q = status ? `?status=${status}` : "";
    return api.get<{ bookings: BookingData[] }>(`/bookings${q}`);
  },

  getById: (id: string) => api.get<BookingData>(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    api.patch<BookingData>(`/bookings/${id}`, { cancellationReason: reason }),
};

// ─── Services API ─────────────────────────────────────────────────────────────

export const servicesApi = {
  getAll: (category?: string) => {
    const q = category ? `?category=${category}` : "";
    return api.get<ServiceData[]>(`/services${q}`);
  },
  getById: (id: string) => api.get<ServiceData>(`/services/${id}`),
};

// ─── User API ─────────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: () => api.get<UserData>("/user/profile"),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put<UserData>("/user/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post("/user/change-password", data),
};

// ─── Admin API ────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () => api.get<AdminDashboard>("/admin/dashboard"),
  getBookings: (params?: Record<string, string>) => {
    const q = params ? "?" + new URLSearchParams(params).toString() : "";
    return api.get<{ bookings: BookingData[]; pagination: Pagination }>(`/admin/bookings${q}`);
  },
  updateBookingStatus: (id: string, status: string, reason?: string) =>
    api.put(`/admin/bookings/${id}`, { status, cancellationReason: reason }),
  getUsers: (params?: Record<string, string>) => {
    const q = params ? "?" + new URLSearchParams(params).toString() : "";
    return api.get<{ users: UserData[]; pagination: Pagination }>(`/admin/users${q}`);
  },
  updateUser: (id: string, data: { isActive?: boolean; role?: string }) =>
    api.put<UserData>(`/admin/users/${id}`, data),
  getServices: () => api.get<ServiceData[]>("/admin/services"),
  createService: (data: Partial<ServiceData>) =>
    api.post<ServiceData>("/admin/services", data),
  updateService: (id: string, data: Partial<ServiceData>) =>
    api.put<ServiceData>(`/admin/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/admin/services/${id}`),
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceData {
  _id: string;
  name: string;
  slug: string;
  category: string;
  duration: number;
  price: number;
  description: string;
  image: string;
  therapists: string[];
  isActive: boolean;
  bookingCount: number;
}

export interface BookingData {
  _id: string;
  bookingRef: string;
  userId: string | UserData;
  serviceId: string | ServiceData;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  therapist: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface AdminDashboard {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalUsers: number;
  activeUsers: number;
  totalServices: number;
  totalRevenue: number;
  recentBookings: BookingData[];
  monthlyTrend: { month: string; bookings: number; revenue: number }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
