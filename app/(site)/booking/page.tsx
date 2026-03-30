"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronRight, Clock, Leaf, Star, MapPin,
  Calendar, User, Sparkles, ArrowLeft, Loader2, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { servicesApi, bookingApi, ServiceData } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store";

const STEPS = [
  { label: "Treatment", icon: Sparkles },
  { label: "Therapist", icon: User },
  { label: "Date & Time", icon: Calendar },
  { label: "Confirm", icon: Check },
];

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toDisplayTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const p = h < 12 ? "AM" : "PM";
  const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${dh}:${String(m).padStart(2, "0")} ${p}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function BookingSidebar({
  step, service, therapist, date, time,
}: {
  step: number;
  service: ServiceData | null;
  therapist: string | null;
  date: Date | null;
  time: string | null;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 bg-spa-accent rounded-xl flex items-center justify-center flex-shrink-0">
          <Leaf className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-heading text-white text-base leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>Serenity Wellness</p>
          <p className="font-body text-white/50 text-[10px]">South Yarra, VIC</p>
        </div>
      </div>

      <div className="mb-8 space-y-1.5">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${i === step ? "bg-white/10 border border-white/15" : i < step ? "opacity-60" : "opacity-25"}`}>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${i < step ? "bg-spa-accent" : i === step ? "bg-white/15" : "bg-white/5"}`}>
              {i < step ? <Check className="w-3 h-3 text-white" strokeWidth={2.5} /> : <Icon className="w-3 h-3 text-white/70" strokeWidth={1.5} />}
            </div>
            <span className={`font-body text-xs tracking-wide ${i === step ? "text-white font-medium" : "text-white/60"}`}>{label}</span>
            {i === step && <span className="ml-auto font-body text-[9px] text-spa-green uppercase tracking-widest">Current</span>}
          </div>
        ))}
      </div>

      <div className="flex-1 space-y-3">
        {service && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="font-body text-[9px] text-white/40 uppercase tracking-wider mb-1.5">Treatment</p>
            <p className="font-body text-sm text-white font-medium">{service.name}</p>
            <p className="font-body text-[10px] text-white/50">{service.duration}min · ${service.price}</p>
          </div>
        )}
        {therapist && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="font-body text-[9px] text-white/40 uppercase tracking-wider mb-1.5">Therapist</p>
            <p className="font-body text-sm text-white font-medium">{therapist}</p>
          </div>
        )}
        {date && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="font-body text-[9px] text-white/40 uppercase tracking-wider mb-1.5">Date & Time</p>
            <p className="font-body text-sm text-white font-medium">{formatDate(date)}</p>
            {time && <p className="font-body text-[10px] text-spa-green mt-0.5">{toDisplayTime(time)}</p>}
          </div>
        )}
        {service && (
          <div className="bg-spa-accent/15 border border-spa-accent/25 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="font-body text-[10px] text-white/60 uppercase tracking-wider">Total</p>
              <p className="font-heading text-white text-xl" style={{ fontFamily: "var(--font-cormorant)" }}>${service.price}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/40">
          <MapPin className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
          <span className="font-body text-[10px]">42 Chapel St, South Yarra VIC 3141</span>
        </div>
      </div>
    </div>
  );
}

// ── Mobile progress ───────────────────────────────────────────────────────────
function MobileProgress({ step }: { step: number }) {
  return (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-body text-xs font-medium text-spa-text">Step {step + 1} of {STEPS.length}: {STEPS[step].label}</span>
        <span className="font-body text-[10px] text-spa-muted">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
      </div>
      <div className="h-1 bg-mint-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-spa-accent rounded-full" initial={{ width: "25%" }} animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.4, ease: "easeInOut" }} />
      </div>
      <div className="flex mt-2 gap-1">
        {STEPS.map((s, i) => <div key={s.label} className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${i <= step ? "bg-spa-accent" : "bg-mint-200"}`} />)}
      </div>
    </div>
  );
}

// ── Success ───────────────────────────────────────────────────────────────────
function BookingSuccess({ bookingRef, onReset }: { bookingRef: string; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 sm:py-16 max-w-md mx-auto px-4">
      <div className="relative inline-flex mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 sm:w-28 sm:h-28 bg-spa-accent rounded-full flex items-center justify-center shadow-green"
        >
          <Check className="w-11 h-11 sm:w-13 sm:h-13 text-white" strokeWidth={2} />
        </motion.div>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-spa-accent/20"
            initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
            transition={{ duration: 1.6, delay: 0.4 + i * 0.28, repeat: Infinity, repeatDelay: 0.8 }} />
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-heading text-spa-text mb-3" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>
          You&apos;re all set
        </h2>
        <p className="font-body text-spa-muted mb-2 text-sm sm:text-base">Your booking is confirmed! We&apos;ll send a reminder to your email.</p>
        {bookingRef && <p className="font-body text-xs text-spa-muted/60 mb-2">Booking reference: <span className="font-semibold text-spa-accent">{bookingRef}</span></p>}
        <p className="font-body text-xs text-spa-muted/60 mb-8 sm:mb-10">We can&apos;t wait to welcome you to Serenity.</p>
        <div className="flex flex-col xs:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="btn-primary text-center">View my bookings</Link>
          <button onClick={onReset} className="btn-secondary">Book another</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [done, setDone] = useState(false);

  // Check auth
  useEffect(() => {
    if (!isAuthenticated) router.push("/login?redirect=/booking");
  }, [isAuthenticated, router]);

  // Load services
  useEffect(() => {
    servicesApi.getAll()
      .then((s) => setServices(s.filter((sv) => sv.isActive)))
      .catch(() => {})
      .finally(() => setServicesLoading(false));
  }, []);

  // Fetch slots when therapist + date selected
  useEffect(() => {
    if (!selectedService || !selectedTherapist || !date) return;
    setSlotsLoading(true);
    setTime(null);
    bookingApi.getSlots({ serviceId: selectedService._id, therapist: selectedTherapist, date: toISO(date) })
      .then((res) => setSlots(res.slots))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedService, selectedTherapist, date]);

  const next = () => setStep((p) => Math.min(p + 1, 3));
  const back = () => setStep((p) => Math.max(p - 1, 0));

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const morningSlots = slots.filter((t) => parseInt(t.split(":")[0]) < 12);
  const afternoonSlots = slots.filter((t) => { const h = parseInt(t.split(":")[0]); return h >= 12 && h < 17; });
  const eveningSlots = slots.filter((t) => parseInt(t.split(":")[0]) >= 17);

  const handleConfirm = async () => {
    if (!selectedService || !selectedTherapist || !date || !time) return;
    setConfirmLoading(true);
    setConfirmError("");
    try {
      const booking = await bookingApi.create({
        serviceId: selectedService._id,
        therapist: selectedTherapist,
        date: toISO(date),
        time,
        notes: notes.trim() || undefined,
      });
      setBookingRef(booking.bookingRef || "");
      setDone(true);
    } catch (err: unknown) {
      setConfirmError(err instanceof Error ? err.message : "Failed to create booking. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleReset = () => {
    setDone(false); setStep(0);
    setSelectedService(null); setSelectedTherapist(null);
    setDate(null); setTime(null);
    setNotes(""); setBookingRef(""); setConfirmError("");
  };

  const slideVariants = {
    enter: { opacity: 0, x: 28, filter: "blur(4px)" },
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -28, filter: "blur(4px)" },
  };

  if (!isAuthenticated) return null;

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/10 pt-20 sm:pt-24 pb-16">
        <div className="container-spa">
          <BookingSuccess bookingRef={bookingRef} onReset={handleReset} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50/60 to-peach-100/10 pt-20 sm:pt-24 pb-12 sm:pb-16">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity }}
        className="fixed top-40 -right-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-mint-200/15 blur-3xl pointer-events-none -z-0" />

      <div className="container-spa max-w-6xl relative z-10">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 sm:mb-8 px-2">
          <p className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "var(--font-satisfy)" }}>guided experience</p>
          <h1 className="font-heading text-spa-text" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 5vw, 3rem)" }}>Book Your Session</h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-[280px] xl:w-[300px] flex-shrink-0 lg:sticky lg:top-24">
            <div className="bg-spa-text rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-soft-lg">
              <BookingSidebar step={step} service={selectedService} therapist={selectedTherapist} date={date} time={time} />
            </div>
          </motion.div>

          {/* Step content */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex-1 min-w-0">
            <MobileProgress step={step} />

            <div className="bg-white/75 backdrop-blur-xl border border-mint-200/40 rounded-2xl sm:rounded-3xl shadow-soft p-5 sm:p-7 md:p-9 min-h-[480px]">
              <AnimatePresence mode="wait">

                {/* ── Step 1: Service ── */}
                {step === 0 && (
                  <motion.div key="service" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <div className="mb-6 sm:mb-8">
                      <h2 className="font-heading text-spa-text mb-1.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Choose your treatment</h2>
                      <p className="font-body text-xs sm:text-sm text-spa-muted">Select the experience that resonates with you.</p>
                    </div>

                    {servicesLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin text-spa-accent" />
                      </div>
                    ) : services.length === 0 ? (
                      <div className="text-center py-16">
                        <p className="font-body text-spa-muted">No services available at the moment.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-7">
                        {services.map((s) => {
                          const selected = selectedService?._id === s._id;
                          return (
                            <motion.button
                              key={s._id}
                              onClick={() => { setSelectedService(s); setSelectedTherapist(null); setDate(null); setTime(null); }}
                              whileHover={{ y: -3 }}
                              whileTap={{ scale: 0.98 }}
                              className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 ${selected ? "border-spa-accent shadow-green" : "border-mint-200/60 hover:border-mint-300 hover:shadow-soft"}`}
                            >
                              {/* Image / colour block */}
                              <div className="relative h-28 sm:h-32 overflow-hidden bg-gradient-to-br from-mint-100 to-spa-accent/10 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-spa-accent/30" strokeWidth={1} />
                                <div className={`absolute inset-0 transition-opacity duration-300 ${selected ? "bg-spa-accent/20" : "bg-spa-text/5"}`} />
                                {selected && (
                                  <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-spa-accent rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </div>
                                )}
                                <div className="absolute top-2.5 left-2.5 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-0.5">
                                  <span className="font-body text-[9px] text-spa-text uppercase tracking-wider">{s.category}</span>
                                </div>
                              </div>
                              <div className="p-3 sm:p-4 bg-white">
                                <h3 className="font-heading text-spa-text leading-tight mb-1.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)" }}>
                                  {s.name}
                                </h3>
                                <p className="font-body text-[9px] text-spa-muted line-clamp-2 mb-2">{s.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5 text-spa-accent flex-shrink-0" strokeWidth={1.5} />
                                    <span className="font-body text-[9px] sm:text-[10px] text-spa-muted">{s.duration}min</span>
                                  </div>
                                  <span className="font-body text-[10px] sm:text-xs font-semibold text-spa-accent">${s.price}</span>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <motion.button onClick={next} disabled={!selectedService} whileHover={{ scale: selectedService ? 1.02 : 1 }} whileTap={{ scale: 0.98 }}
                        className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                        Continue <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Therapist ── */}
                {step === 1 && (
                  <motion.div key="therapist" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <div className="mb-6 sm:mb-8">
                      <h2 className="font-heading text-spa-text mb-1.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Choose your therapist</h2>
                      <p className="font-body text-xs sm:text-sm text-spa-muted">Each therapist brings unique expertise and warmth.</p>
                    </div>

                    {!selectedService?.therapists?.length ? (
                      <div className="text-center py-16">
                        <p className="font-body text-spa-muted text-sm">No therapists available for this service.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                        {selectedService.therapists.map((name) => {
                          const selected = selectedTherapist === name;
                          const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                          return (
                            <motion.button
                              key={name}
                              onClick={() => setSelectedTherapist(name)}
                              whileHover={{ y: -3 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative text-left rounded-2xl overflow-hidden border transition-all duration-300 ${selected ? "border-spa-accent shadow-green" : "border-mint-200/60 hover:border-mint-300 hover:shadow-soft"}`}
                            >
                              {/* Avatar banner */}
                              <div className={`h-28 sm:h-32 flex items-center justify-center transition-colors ${selected ? "bg-spa-accent/15" : "bg-mint-50"}`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold font-body transition-colors ${selected ? "bg-spa-accent text-white" : "bg-white text-spa-accent border border-mint-200"}`}
                                     style={{ fontFamily: "var(--font-cormorant)" }}>
                                  {initials}
                                </div>
                                {selected && (
                                  <div className="absolute top-3 right-3 w-7 h-7 bg-spa-accent rounded-full flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                  </div>
                                )}
                                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  <span className="font-body text-[10px] text-spa-text">5.0</span>
                                </div>
                              </div>
                              <div className="p-4 sm:p-5 bg-white">
                                <h3 className="font-heading text-spa-text mb-0.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem, 2vw, 1.3rem)" }}>
                                  {name}
                                </h3>
                                <p className="font-body text-[10px] sm:text-xs text-spa-accent mb-2">Certified Wellness Therapist</p>
                                <div className="flex flex-wrap gap-1">
                                  {[selectedService.category, "Relaxation"].map((tag) => (
                                    <span key={tag} className="font-body text-[9px] sm:text-[10px] text-spa-accent bg-mint-50 border border-mint-200/60 px-2 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-between gap-3">
                      <button onClick={back} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                      <motion.button onClick={next} disabled={!selectedTherapist} whileHover={{ scale: selectedTherapist ? 1.02 : 1 }}
                        className="btn-primary flex items-center gap-2 disabled:opacity-40">
                        Continue <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Date & Time ── */}
                {step === 2 && (
                  <motion.div key="datetime" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <div className="mb-5 sm:mb-7">
                      <h2 className="font-heading text-spa-text mb-1.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Select date & time</h2>
                      <p className="font-body text-xs sm:text-sm text-spa-muted">Pick when you&apos;d like to visit us.</p>
                    </div>

                    {/* Date strip */}
                    <div className="mb-6 sm:mb-8">
                      <p className="font-body text-[10px] sm:text-xs font-medium text-spa-text/50 uppercase tracking-wider mb-3">Available dates</p>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                        {days.map((d) => {
                          const selected = date?.toDateString() === d.toDateString();
                          return (
                            <motion.button
                              key={d.toISOString()}
                              onClick={() => { setDate(d); setTime(null); }}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.96 }}
                              className={`flex-shrink-0 w-12 sm:w-14 p-2 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-center transition-all ${selected ? "border-spa-accent bg-spa-accent text-white shadow-green" : "border-mint-200/60 bg-white hover:border-spa-accent/40 hover:shadow-soft-sm"}`}
                            >
                              <span className={`font-body text-[9px] sm:text-[10px] uppercase tracking-wide ${selected ? "text-white/75" : "text-spa-muted"}`}>
                                {d.toLocaleDateString("en-AU", { weekday: "short" })}
                              </span>
                              <span className={`font-heading text-base sm:text-xl my-0.5 ${selected ? "text-white" : "text-spa-text"}`} style={{ fontFamily: "var(--font-cormorant)" }}>
                                {d.getDate()}
                              </span>
                              <span className={`font-body text-[9px] sm:text-[10px] ${selected ? "text-white/75" : "text-spa-muted"}`}>
                                {d.toLocaleDateString("en-AU", { month: "short" })}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Slots */}
                    {date && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                        {slotsLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-5 h-5 animate-spin text-spa-accent" />
                            <span className="font-body text-xs text-spa-muted ml-2">Loading available times...</span>
                          </div>
                        ) : slots.length === 0 ? (
                          <div className="text-center py-10">
                            <p className="font-body text-sm text-spa-muted">No available slots for this date. Please choose another day.</p>
                          </div>
                        ) : (
                          <>
                            {[{ label: "Morning", slots: morningSlots }, { label: "Afternoon", slots: afternoonSlots }, { label: "Evening", slots: eveningSlots }]
                              .filter((g) => g.slots.length > 0)
                              .map(({ label, slots: group }) => (
                                <div key={label} className="mb-4 sm:mb-5">
                                  <p className="font-body text-[10px] sm:text-xs font-medium text-spa-text/50 uppercase tracking-wider mb-2.5">{label}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {group.map((t) => (
                                      <motion.button
                                        key={t}
                                        onClick={() => setTime(t)}
                                        whileHover={{ scale: 1.03 }}
                                        className={`px-3 sm:px-4 py-2 rounded-xl border text-[10px] sm:text-xs font-body transition-all ${
                                          time === t
                                            ? "border-spa-accent bg-spa-accent text-white shadow-green"
                                            : "border-mint-200/60 bg-white text-spa-text hover:border-spa-accent/50 hover:shadow-soft-sm"
                                        }`}
                                      >
                                        {toDisplayTime(t)}
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </>
                        )}
                      </motion.div>
                    )}

                    <div className="flex justify-between gap-3 mt-6">
                      <button onClick={back} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                      <motion.button onClick={next} disabled={!date || !time} whileHover={{ scale: date && time ? 1.02 : 1 }}
                        className="btn-primary flex items-center gap-2 disabled:opacity-40">
                        Continue <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 4: Confirm ── */}
                {step === 3 && (
                  <motion.div key="confirm" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <div className="mb-6 sm:mb-8">
                      <h2 className="font-heading text-spa-text mb-1.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Confirm your booking</h2>
                      <p className="font-body text-xs sm:text-sm text-spa-muted">Review your session details below.</p>
                    </div>

                    {/* Receipt card */}
                    <div className="bg-spa-bg/70 border border-mint-200/50 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-5">
                      <div className="bg-spa-text p-4 sm:p-5 flex items-center gap-3">
                        <div className="w-9 h-9 bg-spa-accent rounded-xl flex items-center justify-center flex-shrink-0">
                          <Leaf className="w-4 h-4 text-white" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="font-heading text-white text-base" style={{ fontFamily: "var(--font-cormorant)" }}>Serenity Wellness Spa</p>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-2.5 h-2.5 text-white/50" strokeWidth={1.5} />
                            <p className="font-body text-[10px] text-white/50">42 Chapel St, South Yarra VIC 3141</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 sm:p-6 space-y-3.5 sm:space-y-4">
                        {[
                          { label: "Treatment", value: selectedService?.name, sub: `${selectedService?.duration}min` },
                          { label: "Therapist", value: selectedTherapist },
                          { label: "Date", value: date ? formatDate(date) : null },
                          { label: "Time", value: time ? toDisplayTime(time) : null },
                        ].map(({ label, value, sub }) => (
                          <div key={label} className="flex justify-between items-start gap-4">
                            <span className="font-body text-[10px] sm:text-xs text-spa-muted uppercase tracking-wide flex-shrink-0">{label}</span>
                            <div className="text-right">
                              <span className="font-body text-xs sm:text-sm font-medium text-spa-text">{value}</span>
                              {sub && <p className="font-body text-[10px] sm:text-xs text-spa-muted">{sub}</p>}
                            </div>
                          </div>
                        ))}
                        <div className="pt-3.5 border-t border-mint-200/60 flex justify-between items-center">
                          <span className="font-body text-[10px] sm:text-xs text-spa-muted uppercase tracking-wide">Total</span>
                          <span className="font-heading text-spa-accent" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)" }}>
                            ${selectedService?.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4 sm:mb-5">
                      <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 tracking-wide uppercase block mb-1.5">
                        Special requests (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Any preferences, allergies, or requests..."
                        className="w-full px-3 py-2.5 text-sm bg-white/80 border border-mint-200/60 rounded-xl focus:outline-none focus:border-spa-accent/60 font-body text-spa-text placeholder:text-spa-muted/40 resize-none transition-colors"
                      />
                    </div>

                    {/* Inclusions */}
                    <div className="bg-peach-100/60 border border-peach-200/50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-6 sm:mb-8">
                      <p className="font-body text-[10px] sm:text-xs font-semibold text-spa-text mb-1.5">✨ Included with every session</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {["Herbal tea", "Welcome consultation", "Organic products", "Recovery lounge"].map((item) => (
                          <div key={item} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-spa-accent flex-shrink-0" strokeWidth={2} />
                            <span className="font-body text-[10px] sm:text-xs text-spa-muted">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {confirmError && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start mb-4">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="font-body text-xs text-red-600">{confirmError}</p>
                      </motion.div>
                    )}

                    <div className="flex justify-between gap-3">
                      <button onClick={back} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                      <motion.button
                        onClick={handleConfirm}
                        disabled={confirmLoading}
                        whileHover={{ scale: confirmLoading ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary flex items-center gap-2 disabled:opacity-60"
                      >
                        {confirmLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</>
                        ) : (
                          <>Confirm booking <Check className="w-4 h-4" strokeWidth={2.5} /></>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
