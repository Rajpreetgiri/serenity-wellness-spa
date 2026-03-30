"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Clock, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { services, therapists, timeSlots } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const STEPS = ["Treatment", "Therapist", "Date & Time", "Confirm"];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center mb-8 sm:mb-12 overflow-x-auto pb-1">
      <div className="flex items-center">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                          text-xs sm:text-sm font-body font-medium transition-all duration-500 flex-shrink-0 ${
                i < current
                  ? "bg-spa-accent text-white shadow-green"
                  : i === current
                  ? "bg-white border-2 border-spa-accent text-spa-accent shadow-soft"
                  : "bg-white border border-mint-200 text-spa-muted/40"
              }`}
            >
              {i < current ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} /> : i + 1}
            </div>

            {/* Label — hidden on xs, shown sm+ */}
            <div className="hidden sm:block ml-1.5 mr-3 lg:ml-2 lg:mr-4">
              <p
                className={`font-body text-[11px] sm:text-xs transition-colors whitespace-nowrap ${
                  i === current ? "text-spa-accent font-medium" : "text-spa-muted/50"
                }`}
              >
                {STEPS[i]}
              </p>
            </div>

            {i < total - 1 && (
              <div
                className={`w-5 sm:w-8 h-px mx-1.5 sm:mx-2 flex-shrink-0 transition-all duration-500 ${
                  i < current ? "bg-spa-accent" : "bg-mint-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingSuccess({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 sm:py-12 max-w-md mx-auto px-4"
    >
      <div className="relative inline-flex mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
          className="w-24 h-24 sm:w-28 sm:h-28 bg-spa-accent rounded-full flex items-center justify-center shadow-green"
        >
          <Check className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={2} />
        </motion.div>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-spa-accent/20"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2 + i * 0.5, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.25, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2
          className="font-heading text-spa-text mb-3"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
          }}
        >
          You&apos;re all set
        </h2>
        <p className="font-body text-spa-muted mb-2 text-sm sm:text-base">
          Your booking is confirmed! We&apos;ll send a reminder to your email.
        </p>
        <p className="font-body text-sm text-spa-muted/70 mb-8 sm:mb-10">
          We look forward to welcoming you.
        </p>

        <div className="flex flex-col xs:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="btn-primary text-center">
            View my bookings
          </Link>
          <button onClick={onReset} className="btn-secondary text-center">
            Book another
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [therapist, setTherapist] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const selectedService = services.find((s) => s.id === service);
  const selectedTherapist = therapists.find((t) => t.id === therapist);

  const next = () => setStep((p) => Math.min(p + 1, 3));
  const back = () => setStep((p) => Math.max(p - 1, 0));

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const variants = {
    enter: { opacity: 0, x: 25 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -25 },
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/10 pt-20 sm:pt-24 pb-16">
        <div className="container-spa">
          <BookingSuccess
            onReset={() => {
              setDone(false); setStep(0);
              setService(null); setTherapist(null);
              setDate(null); setTime(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/10 pt-20 sm:pt-24 pb-16">
      {/* Background blob */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="fixed top-40 -right-20 sm:right-0 w-56 h-56 sm:w-72 sm:h-72
                   rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-mint-200/20 blur-3xl pointer-events-none"
      />

      <div className="container-spa max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 px-2"
        >
          <p
            className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-2 sm:mb-3"
            style={{ fontFamily: "var(--font-satisfy)" }}
          >
            guided experience
          </p>
          <h1
            className="font-heading text-spa-text mb-2"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
            }}
          >
            Book Your Session
          </h1>
          <p className="font-body text-spa-muted text-xs sm:text-sm">
            Let us guide you through selecting the perfect healing experience.
          </p>
        </motion.div>

        <StepIndicator current={step} total={4} />

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-mint-200/40 rounded-3xl sm:rounded-4xl
                        shadow-soft-lg p-5 sm:p-8 md:p-12 min-h-[460px] sm:min-h-[500px]">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Service ── */}
            {step === 0 && (
              <motion.div
                key="service"
                variants={variants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28 }}
              >
                <h2
                  className="font-heading text-spa-text mb-1.5"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  }}
                >
                  Choose your treatment
                </h2>
                <p className="font-body text-xs sm:text-sm text-spa-muted mb-5 sm:mb-7">
                  Select the healing experience that resonates with you.
                </p>

                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {services.map((s) => (
                    <motion.button
                      key={s.id}
                      onClick={() => setService(s.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-left p-3.5 sm:p-5 rounded-2xl border transition-all duration-300 ${
                        service === s.id
                          ? "border-spa-accent bg-spa-accent/5 shadow-green"
                          : "border-mint-200 bg-white/50 hover:border-spa-green hover:shadow-soft"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                        <span className="text-xl sm:text-2xl flex-shrink-0">{s.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-heading text-spa-text leading-tight"
                            style={{
                              fontFamily: "var(--font-cormorant)",
                              fontSize: "clamp(1rem, 2vw, 1.15rem)",
                            }}
                          >
                            {s.title}
                          </h3>
                          <p className="font-body text-[10px] sm:text-xs text-spa-muted/70">{s.tagline}</p>
                        </div>
                        {service === s.id && (
                          <div className="w-5 h-5 bg-spa-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-spa-accent flex-shrink-0" strokeWidth={1.5} />
                          <span className="font-body text-[10px] sm:text-xs text-spa-muted">{s.duration}</span>
                        </div>
                        <span className="font-body text-[10px] sm:text-xs font-semibold text-spa-accent">{s.price}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <motion.button
                    onClick={next} disabled={!service}
                    whileHover={{ scale: service ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex items-center gap-2 disabled:opacity-40"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Therapist ── */}
            {step === 1 && (
              <motion.div
                key="therapist"
                variants={variants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28 }}
              >
                <h2
                  className="font-heading text-spa-text mb-1.5"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  }}
                >
                  Choose your therapist
                </h2>
                <p className="font-body text-xs sm:text-sm text-spa-muted mb-5 sm:mb-7">
                  Select who you&apos;d like to guide your healing session.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {therapists.map((t) => (
                    <motion.button
                      key={t.id}
                      onClick={() => setTherapist(t.id)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-left flex gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl border transition-all duration-300 ${
                        therapist === t.id
                          ? "border-spa-accent bg-spa-accent/5 shadow-green"
                          : "border-mint-200 bg-white/50 hover:border-spa-green hover:shadow-soft"
                      }`}
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 56px, 64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <h3
                              className="font-heading text-spa-text leading-tight"
                              style={{
                                fontFamily: "var(--font-cormorant)",
                                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                              }}
                            >
                              {t.name}
                            </h3>
                            <p className="font-body text-[10px] sm:text-xs text-spa-accent">{t.title}</p>
                          </div>
                          {therapist === t.id && (
                            <div className="w-5 h-5 bg-spa-accent rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {t.specialties.slice(0, 2).map((s) => (
                            <span key={s} className="font-body text-[9px] sm:text-[10px] text-spa-accent bg-mint-100 px-2 py-0.5 rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                        <p className="font-body text-[10px] sm:text-xs text-spa-muted mt-1">
                          {t.experience} · ⭐ {t.rating}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between gap-3">
                  <button onClick={back} className="btn-secondary">Back</button>
                  <motion.button
                    onClick={next} disabled={!therapist}
                    whileHover={{ scale: therapist ? 1.02 : 1 }}
                    className="btn-primary flex items-center gap-2 disabled:opacity-40"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Date & Time ── */}
            {step === 2 && (
              <motion.div
                key="datetime"
                variants={variants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28 }}
              >
                <h2
                  className="font-heading text-spa-text mb-1.5"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  }}
                >
                  Select date & time
                </h2>
                <p className="font-body text-xs sm:text-sm text-spa-muted mb-5 sm:mb-7">
                  Choose when you&apos;d like to visit us.
                </p>

                {/* Date picker — horizontal scroll, flex-shrink-0 on each */}
                <div className="mb-6 sm:mb-8">
                  <p className="font-body text-[10px] sm:text-xs font-medium text-spa-text/60 uppercase tracking-wide mb-3">
                    Available dates
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                    {days.map((d) => {
                      const isSelected = date?.toDateString() === d.toDateString();
                      const dayName = d.toLocaleDateString("en-AU", { weekday: "short" });
                      const dayNum = d.getDate();
                      const month = d.toLocaleDateString("en-AU", { month: "short" });
                      return (
                        <motion.button
                          key={d.toISOString()}
                          onClick={() => { setDate(d); setTime(null); }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          className={`flex-shrink-0 w-12 sm:w-14 p-2 sm:p-3 rounded-xl sm:rounded-2xl border
                                     flex flex-col items-center transition-all ${
                            isSelected
                              ? "border-spa-accent bg-spa-accent text-white shadow-green"
                              : "border-mint-200 bg-white/50 text-spa-text hover:border-spa-green"
                          }`}
                        >
                          <span className={`font-body text-[9px] sm:text-[10px] uppercase tracking-wide ${isSelected ? "text-white/80" : "text-spa-muted"}`}>
                            {dayName}
                          </span>
                          <span
                            className={`font-heading text-base sm:text-xl ${isSelected ? "text-white" : "text-spa-text"}`}
                            style={{ fontFamily: "var(--font-cormorant)" }}
                          >
                            {dayNum}
                          </span>
                          <span className={`font-body text-[9px] sm:text-[10px] ${isSelected ? "text-white/80" : "text-spa-muted"}`}>
                            {month}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {date && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <p className="font-body text-[10px] sm:text-xs font-medium text-spa-text/60 uppercase tracking-wide mb-3">
                      Available times
                    </p>
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                      {timeSlots.map((t) => {
                        const unavailable = ["11:30 AM", "2:30 PM", "5:00 PM"].includes(t);
                        return (
                          <motion.button
                            key={t}
                            onClick={() => !unavailable && setTime(t)}
                            whileHover={{ scale: unavailable ? 1 : 1.02 }}
                            disabled={unavailable}
                            className={`py-2 px-1 sm:px-3 rounded-xl border text-[10px] sm:text-xs font-body transition-all ${
                              time === t
                                ? "border-spa-accent bg-spa-accent text-white shadow-green"
                                : unavailable
                                ? "border-mint-100 bg-mint-50/30 text-spa-muted/30 cursor-not-allowed"
                                : "border-mint-200 bg-white/50 text-spa-text hover:border-spa-green"
                            }`}
                          >
                            {t}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between gap-3">
                  <button onClick={back} className="btn-secondary">Back</button>
                  <motion.button
                    onClick={next} disabled={!date || !time}
                    whileHover={{ scale: date && time ? 1.02 : 1 }}
                    className="btn-primary flex items-center gap-2 disabled:opacity-40"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Confirm ── */}
            {step === 3 && (
              <motion.div
                key="confirm"
                variants={variants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28 }}
              >
                <h2
                  className="font-heading text-spa-text mb-1.5"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  }}
                >
                  Confirm your booking
                </h2>
                <p className="font-body text-xs sm:text-sm text-spa-muted mb-5 sm:mb-7">
                  Review your session details before confirming.
                </p>

                {/* Summary */}
                <div className="bg-gradient-to-br from-spa-bg to-mint-100/50 border border-mint-200/60
                                rounded-2xl sm:rounded-3xl p-5 sm:p-7 mb-5 sm:mb-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-5 border-b border-mint-200">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-spa-accent rounded-xl sm:rounded-2xl
                                    flex items-center justify-center shadow-green flex-shrink-0">
                      <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p
                        className="font-heading text-spa-text"
                        style={{
                          fontFamily: "var(--font-cormorant)",
                          fontSize: "clamp(1rem, 2vw, 1.3rem)",
                        }}
                      >
                        Serenity Wellness Spa
                      </p>
                      <p className="font-body text-[10px] sm:text-xs text-spa-muted">42 Chapel St, South Yarra</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { label: "Treatment", value: selectedService?.title, sub: selectedService?.duration },
                      { label: "Therapist", value: selectedTherapist?.name, sub: selectedTherapist?.title },
                      { label: "Date", value: date ? formatDate(date) : null },
                      { label: "Time", value: time },
                      { label: "Price", value: selectedService?.price, highlight: true },
                    ].map(({ label, value, sub, highlight }) => (
                      <div key={label} className="flex justify-between items-start gap-4">
                        <span className="font-body text-[10px] sm:text-xs text-spa-muted uppercase tracking-wide flex-shrink-0">
                          {label}
                        </span>
                        <div className="text-right">
                          <span className={`font-body text-xs sm:text-sm font-medium ${highlight ? "text-spa-accent" : "text-spa-text"}`}>
                            {value}
                          </span>
                          {sub && <p className="font-body text-[10px] sm:text-xs text-spa-muted">{sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perks */}
                <div className="bg-peach-100/50 border border-peach-200/50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-5 sm:mb-8 flex gap-2.5 sm:gap-3">
                  <span className="text-base sm:text-lg flex-shrink-0">✨</span>
                  <div>
                    <p className="font-body text-xs font-medium text-spa-text mb-0.5">What&apos;s included</p>
                    <p className="font-body text-[10px] sm:text-xs text-spa-muted leading-relaxed">
                      Herbal tea · Welcome consultation · Organic products · Recovery space
                    </p>
                  </div>
                </div>

                <div className="flex justify-between gap-3">
                  <button onClick={back} className="btn-secondary">Back</button>
                  <motion.button
                    onClick={() => setDone(true)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    Confirm booking
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
