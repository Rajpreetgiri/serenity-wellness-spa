import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
  } | null;
  login: (email: string, name: string) => void;
  logout: () => void;
}

interface BookingState {
  step: number;
  selectedService: string | null;
  selectedTherapist: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  setStep: (step: number) => void;
  setService: (service: string) => void;
  setTherapist: (therapist: string) => void;
  setDate: (date: Date) => void;
  setTime: (time: string) => void;
  reset: () => void;
}

interface UIState {
  audioPlaying: boolean;
  toggleAudio: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, name) => set({ isAuthenticated: true, user: { email, name } }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "serenity-auth" }
  )
);

export const useBookingStore = create<BookingState>()((set) => ({
  step: 1,
  selectedService: null,
  selectedTherapist: null,
  selectedDate: null,
  selectedTime: null,
  setStep: (step) => set({ step }),
  setService: (service) => set({ selectedService: service }),
  setTherapist: (therapist) => set({ selectedTherapist: therapist }),
  setDate: (date) => set({ selectedDate: date }),
  setTime: (time) => set({ selectedTime: time }),
  reset: () =>
    set({
      step: 1,
      selectedService: null,
      selectedTherapist: null,
      selectedDate: null,
      selectedTime: null,
    }),
}));

export const useUIStore = create<UIState>()((set) => ({
  audioPlaying: false,
  toggleAudio: () => set((state) => ({ audioPlaying: !state.audioPlaying })),
}));
