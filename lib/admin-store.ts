import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  authApi,
  adminApi,
  setTokens,
  clearTokens,
  UserData,
  BookingData,
  ServiceData,
  AdminDashboard,
} from "./api-client";

// Keep mock data only for CMS content (not yet in API)
import { ContentBlock, MOCK_CONTENT } from "./admin-data";

// ─── Admin Auth Store (real API) ──────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  adminUser: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminUser: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const result = await authApi.login({ email, password });
          if (result.user.role !== "admin") {
            clearTokens();
            set({ loading: false });
            return false;
          }
          set({ isAuthenticated: true, adminUser: result.user, loading: false });
          document.cookie = "admin-auth=1; path=/; max-age=86400";
          return true;
        } catch {
          set({ loading: false });
          return false;
        }
      },

      logout: () => {
        const refresh = typeof window !== "undefined"
          ? localStorage.getItem("serenity_refresh") || undefined
          : undefined;
        authApi.logout(refresh).catch(() => null);
        clearTokens();
        document.cookie = "admin-auth=; max-age=0; path=/";
        set({ isAuthenticated: false, adminUser: null });
      },
    }),
    {
      name: "admin-auth",
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated, adminUser: s.adminUser }),
    }
  )
);

// ─── Bookings Store (real API) ────────────────────────────────────────────────

interface BookingsState {
  bookings: BookingData[];
  loading: boolean;
  fetch: () => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
}

export const useBookingsStore = create<BookingsState>()((set, get) => ({
  bookings: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const data = await adminApi.getBookings({ limit: "100" });
      set({ bookings: data.bookings, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateStatus: async (id, status) => {
    await adminApi.updateBookingStatus(id, status);
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b._id === id ? { ...b, status: status as BookingData["status"] } : b
      ),
    }));
  },
}));

// ─── Users Store (real API) ───────────────────────────────────────────────────

interface UsersState {
  users: UserData[];
  loading: boolean;
  fetch: () => Promise<void>;
  updateUser: (id: string, data: { isActive?: boolean; role?: string }) => Promise<void>;
}

export const useUsersStore = create<UsersState>()((set) => ({
  users: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const data = await adminApi.getUsers({ limit: "100" });
      set({ users: data.users, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateUser: async (id, data) => {
    const updated = await adminApi.updateUser(id, data);
    set((s) => ({
      users: s.users.map((u) => (u._id === id ? updated : u)),
    }));
  },
}));

// ─── Services Store (real API) ────────────────────────────────────────────────

interface ServicesState {
  services: ServiceData[];
  loading: boolean;
  fetch: () => Promise<void>;
  addService: (data: Partial<ServiceData>) => Promise<void>;
  updateService: (id: string, data: Partial<ServiceData>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
}

export const useServicesStore = create<ServicesState>()((set, get) => ({
  services: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const services = await adminApi.getServices();
      set({ services, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addService: async (data) => {
    const svc = await adminApi.createService(data);
    set((s) => ({ services: [svc, ...s.services] }));
  },

  updateService: async (id, data) => {
    const svc = await adminApi.updateService(id, data);
    set((s) => ({
      services: s.services.map((sv) => (sv._id === id ? svc : sv)),
    }));
  },

  deleteService: async (id) => {
    await adminApi.deleteService(id);
    set((s) => ({ services: s.services.filter((sv) => sv._id !== id) }));
  },

  toggleActive: async (id) => {
    const svc = get().services.find((s) => s._id === id);
    if (!svc) return;
    const updated = await adminApi.updateService(id, { isActive: !svc.isActive });
    set((s) => ({
      services: s.services.map((sv) => (sv._id === id ? updated : sv)),
    }));
  },
}));

// ─── Content Store (local CMS — not backed by DB yet) ────────────────────────

interface ContentState {
  content: ContentBlock[];
  updateContent: (id: string, data: Partial<ContentBlock>) => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      content: MOCK_CONTENT,
      updateContent: (id, data) =>
        set((state) => ({
          content: state.content.map((c) =>
            c.id === id
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c
          ),
        })),
    }),
    { name: "admin-content" }
  )
);

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  notifications: Notification[];
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  toggleDarkMode: () => void;
  addNotification: (n: Notification) => void;
  dismissNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      notifications: [],
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      addNotification: (n) =>
        set((s) => ({ notifications: [n, ...s.notifications] })),
      dismissNotification: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
    }),
    { name: "admin-ui" }
  )
);
