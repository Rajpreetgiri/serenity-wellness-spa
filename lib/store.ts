import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, userApi, UserData, clearTokens } from "./api-client";

// ─── Auth Store (real API) ────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: UserData | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const result = await authApi.login({ email, password });
          set({ isAuthenticated: true, user: result.user, loading: false });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          const refresh = localStorage.getItem("serenity_refresh") || undefined;
          await authApi.logout(refresh);
        } catch {
          // Still clear local state
        } finally {
          clearTokens();
          set({ isAuthenticated: false, user: null });
        }
      },

      fetchMe: async () => {
        try {
          const user = await authApi.me();
          set({ user, isAuthenticated: true });
        } catch {
          clearTokens();
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "serenity-auth",
      // Only persist user + isAuthenticated; not loading
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// ─── Booking wizard state (local, no persistence) ─────────────────────────────

interface BookingState {
  step: number;
  selectedServiceId: string | null;
  selectedServiceName: string | null;
  selectedTherapist: string | null;
  selectedDate: string | null; // YYYY-MM-DD
  selectedTime: string | null;
  notes: string;
  setStep: (step: number) => void;
  setService: (id: string, name: string) => void;
  setTherapist: (therapist: string) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

const bookingInitial = {
  step: 1,
  selectedServiceId: null,
  selectedServiceName: null,
  selectedTherapist: null,
  selectedDate: null,
  selectedTime: null,
  notes: "",
};

export const useBookingStore = create<BookingState>()((set) => ({
  ...bookingInitial,
  setStep: (step) => set({ step }),
  setService: (id, name) => set({ selectedServiceId: id, selectedServiceName: name }),
  setTherapist: (therapist) => set({ selectedTherapist: therapist }),
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  setNotes: (notes) => set({ notes }),
  reset: () => set(bookingInitial),
}));

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface UIState {
  audioPlaying: boolean;
  toggleAudio: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  audioPlaying: false,
  toggleAudio: () => set((state) => ({ audioPlaying: !state.audioPlaying })),
}));
