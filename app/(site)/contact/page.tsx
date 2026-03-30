"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

const SUBJECTS = [
  "General enquiry",
  "Booking assistance",
  "Gift vouchers",
  "Membership information",
  "Corporate wellness",
  "Media & partnerships",
];

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit us",
    lines: ["42 Chapel Street", "South Yarra, VIC 3141", "Melbourne, Australia"],
    color: "#A8CBB7",
  },
  {
    icon: Phone,
    title: "Call us",
    lines: ["+61 3 9876 5432", "Mon–Fri: 9am – 8pm", "Sat–Sun: 8am – 7pm"],
    color: "#F6C1A6",
  },
  {
    icon: Mail,
    title: "Email us",
    lines: ["hello@serenityspa.com.au", "We reply within 24 hours"],
    color: "#6D8B74",
  },
  {
    icon: Clock,
    title: "Hours",
    lines: ["Mon–Fri: 9am – 8pm", "Sat–Sun: 8am – 7pm", "Public holidays: 10am – 6pm"],
    color: "#A8CBB7",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-spa-bg to-mint-50 pt-20 sm:pt-24">
      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute top-0 right-0 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72
                     rounded-[60%_40%_30%_70%] bg-mint-200/20 blur-3xl pointer-events-none"
        />
        <div className="relative container-spa text-center">
          <ScrollReveal>
            <p
              className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              get in touch
            </p>
            <h1
              className="font-heading text-spa-text mb-4 sm:mb-5"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
              }}
            >
              We&apos;d Love to
              <br />
              <em className="italic text-spa-accent">Hear from You</em>
            </h1>
            <p className="font-body text-spa-muted max-w-xs sm:max-w-lg mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
              Whether you have a question, a special request, or just want to say hello — we&apos;re here.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Info cards: 1 → 2 → 4 */}
      <section className="pb-10 sm:pb-14 lg:pb-16">
        <div className="container-spa grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-12 sm:mb-16">
          {contactInfo.map((info, i) => (
            <ScrollReveal key={info.title} delay={i * 0.07}>
              <div className="bg-white/60 border border-mint-200/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6
                              shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 h-full">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                  style={{ backgroundColor: `${info.color}25`, border: `1px solid ${info.color}40` }}
                >
                  <info.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: info.color }} strokeWidth={1.5} />
                </div>
                <h3
                  className="font-heading text-spa-text mb-2.5 sm:mb-3"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                  }}
                >
                  {info.title}
                </h3>
                {info.lines.map((line, j) => (
                  <p key={j} className="font-body text-xs sm:text-sm text-spa-muted leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container-spa grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Form */}
          <ScrollReveal direction="left">
            <div className="bg-white/70 backdrop-blur-xl border border-mint-200/40 rounded-3xl sm:rounded-4xl
                            shadow-soft-lg p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2
                      className="font-heading text-spa-text mb-2"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(1.6rem, 3.5vw, 2rem)",
                      }}
                    >
                      Send a message
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-spa-muted mb-6 sm:mb-8">
                      We reply to every enquiry within one business day.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/60 uppercase tracking-wide block mb-1.5 sm:mb-2">
                            Full name
                          </label>
                          <input
                            {...register("name")}
                            type="text"
                            placeholder="Alexandra Chen"
                            className="input-soft"
                          />
                          {errors.name && (
                            <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/60 uppercase tracking-wide block mb-1.5 sm:mb-2">
                            Phone (optional)
                          </label>
                          <input
                            {...register("phone")}
                            type="tel"
                            placeholder="+61 400 000 000"
                            className="input-soft"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/60 uppercase tracking-wide block mb-1.5 sm:mb-2">
                          Email
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="you@example.com"
                          className="input-soft"
                        />
                        {errors.email && (
                          <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/60 uppercase tracking-wide block mb-1.5 sm:mb-2">
                          Subject
                        </label>
                        <select {...register("subject")} className="input-soft appearance-none cursor-pointer">
                          <option value="">Select a subject...</option>
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.subject && (
                          <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.subject.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-body text-[10px] sm:text-xs font-medium text-spa-text/60 uppercase tracking-wide block mb-1.5 sm:mb-2">
                          Message
                        </label>
                        <textarea
                          {...register("message")}
                          rows={4}
                          placeholder="Tell us how we can help you..."
                          className="input-soft resize-none"
                        />
                        {errors.message && (
                          <p className="font-body text-[10px] sm:text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.message.message}
                          </p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full btn-primary flex items-center justify-center gap-2 !py-3.5"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" strokeWidth={1.5} />
                            Send message
                          </>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-8 sm:py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-spa-accent rounded-full flex items-center
                                 justify-center mb-5 sm:mb-6 shadow-green"
                    >
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
                    </motion.div>
                    <h3
                      className="font-heading text-spa-text mb-3"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(1.6rem, 3.5vw, 2rem)",
                      }}
                    >
                      Message sent!
                    </h3>
                    <p className="font-body text-spa-muted text-sm mb-7 max-w-xs leading-relaxed">
                      Thank you for reaching out. We&apos;ll get back to you within one business day.
                    </p>
                    <button onClick={() => setSent(false)} className="btn-secondary text-sm">
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>

          {/* Map + cards */}
          <ScrollReveal direction="right" delay={0.15}>
            <div className="flex flex-col gap-4 sm:gap-5 h-full">
              {/* Map */}
              <div className="bg-white/60 border border-mint-200/40 rounded-3xl overflow-hidden shadow-soft
                              flex-1 min-h-[240px] sm:min-h-[300px] lg:min-h-[350px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.98931031531895!3d-37.83938797965217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad667b0b4a00921%3A0x3bdebcb5f5a5d9f7!2sChapel%20St%2C%20South%20Yarra%20VIC%203141%2C%20Australia!5e0!3m2!1sen!2sau!4v1628000000000!5m2!1sen!2sau"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "saturate(0.8) contrast(0.9)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                  title="Serenity Wellness Spa Location"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-mint-200
                                rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-soft-sm z-10">
                  <p className="font-body text-[10px] sm:text-xs font-medium text-spa-text">Serenity Wellness Spa</p>
                  <p className="font-body text-[9px] sm:text-xs text-spa-muted">42 Chapel St, South Yarra</p>
                </div>
              </div>

              {/* Quick book */}
              <div className="bg-gradient-to-br from-spa-accent to-[#537060] rounded-2xl sm:rounded-3xl
                              p-5 sm:p-7 shadow-green text-white">
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                  }}
                >
                  Ready to visit?
                </h3>
                <p className="font-body text-white/70 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
                  Skip the wait — book your session online and secure your preferred time instantly.
                </p>
                <Link
                  href="/booking"
                  className="inline-block bg-white text-spa-accent font-body font-medium
                             px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                             hover:bg-mint-100 transition-colors text-xs sm:text-sm"
                >
                  Book online now
                </Link>
              </div>

              {/* Gift voucher */}
              <div className="bg-white/60 border border-mint-200/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                  <span className="text-xl sm:text-2xl">🎁</span>
                  <h3
                    className="font-heading text-spa-text"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                    }}
                  >
                    Gift Vouchers
                  </h3>
                </div>
                <p className="font-body text-xs sm:text-sm text-spa-muted leading-relaxed mb-3 sm:mb-4">
                  Give the gift of calm. Our beautiful vouchers are available in any denomination and treatment type.
                </p>
                <button className="btn-secondary text-[10px] sm:text-xs !px-4 !py-2">
                  Enquire about vouchers
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
