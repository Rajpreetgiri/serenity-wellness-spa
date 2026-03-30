"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, Clock, Star, ArrowRight, Settings,
  LogOut, Shield, User, Leaf, TrendingUp,
  CheckCircle, Bell
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { bookings, services } from "@/lib/data";
import { getDemoUser } from "@/lib/auth";
import ScrollReveal from "@/components/ui/ScrollReveal";

const wellnessStats = [
  { label: "Sessions this year", value: "8", icon: "🌿", change: "+3 from last year" },
  { label: "Hours of healing", value: "12h", icon: "⏱️", change: "Equiv. to 2 full days" },
  { label: "Stress reduction", value: "72%", icon: "📉", change: "After each session" },
  { label: "Loyalty points", value: "1,240", icon: "⭐", change: "Worth ~$62 off" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const demoUser = getDemoUser();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const displayName = user?.name || demoUser.name;
  const firstName = displayName.split(" ")[0];
  const upcoming = bookings.filter((b) => b.status === "upcoming");

  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/10
                    pt-20 sm:pt-24 pb-16">
      <div className="container-spa max-w-5xl">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 mb-7 sm:mb-10"
        >
          <div>
            <p
              className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-1.5 sm:mb-2"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              welcome back
            </p>
            <h1
              className="font-heading text-spa-text"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.6rem, 5vw, 3rem)",
              }}
            >
              Good to see you, <em className="italic text-spa-accent">{firstName}</em>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white/60 border border-mint-200 rounded-xl
                               flex items-center justify-center hover:shadow-soft transition-all">
              <Bell className="w-4 h-4 text-spa-muted" strokeWidth={1.5} />
            </button>
            <Link
              href="/booking"
              className="bg-spa-accent text-white font-body font-medium rounded-xl transition-all
                         duration-300 hover:bg-spa-text hover:shadow-green active:scale-95
                         text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center gap-1.5"
            >
              Book session
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Upcoming appointment */}
        {upcoming.length > 0 && (
          <ScrollReveal className="mb-5 sm:mb-8">
            <div className="relative bg-gradient-to-br from-spa-accent to-[#537060] rounded-3xl sm:rounded-4xl
                            p-6 sm:p-8 md:p-10 shadow-green overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-40 h-40 sm:w-56 sm:h-56
                           rounded-full border border-white/10 pointer-events-none"
              />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center
                              justify-between gap-4 sm:gap-6">
                <div>
                  <p className="font-body text-white/60 text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 sm:mb-2">
                    Next appointment
                  </p>
                  <h2
                    className="text-white mb-2 sm:mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                    }}
                  >
                    {upcoming[0].service}
                  </h2>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {[
                      { Icon: Calendar, text: upcoming[0].date },
                      { Icon: Clock, text: upcoming[0].time },
                      { Icon: User, text: upcoming[0].therapist },
                    ].map(({ Icon, text }) => (
                      <div key={text} className="flex items-center gap-1.5 text-white/70">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={1.5} />
                        <span className="font-body text-xs sm:text-sm">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                  <span
                    className="text-white/50"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    }}
                  >
                    {upcoming[0].price}
                  </span>
                  <button className="bg-white/15 border border-white/20 text-white font-body text-xs
                                     px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl
                                     hover:bg-white/25 transition-colors whitespace-nowrap">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Stats — 2 → 4 cols */}
        <ScrollReveal className="mb-5 sm:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {wellnessStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/60 border border-mint-200/40 rounded-2xl sm:rounded-3xl
                           p-4 sm:p-5 shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1"
              >
                <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{stat.icon}</div>
                <p
                  className="font-heading text-spa-text mb-1"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  }}
                >
                  {stat.value}
                </p>
                <p className="font-body text-[10px] sm:text-xs font-medium text-spa-text/70 mb-0.5">
                  {stat.label}
                </p>
                <p className="font-body text-[9px] sm:text-[10px] text-spa-muted/60">{stat.change}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Booking history */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <ScrollReveal>
              <h2
                className="font-heading text-spa-text mb-3 sm:mb-4"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.3rem, 3vw, 1.6rem)",
                }}
              >
                Your Sessions
              </h2>

              <div className="space-y-2.5 sm:space-y-3">
                {bookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`bg-white/60 border rounded-xl sm:rounded-2xl p-4 sm:p-5
                                shadow-soft-sm hover:shadow-soft transition-all ${
                      booking.status === "upcoming"
                        ? "border-spa-accent/30 bg-spa-accent/5"
                        : "border-mint-200/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center
                                     justify-center flex-shrink-0 ${
                            booking.status === "upcoming"
                              ? "bg-spa-accent/10 border border-spa-accent/20"
                              : "bg-mint-100 border border-mint-200"
                          }`}
                        >
                          {booking.status === "upcoming" ? (
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-spa-accent" strokeWidth={1.5} />
                          ) : (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-spa-green" strokeWidth={1.5} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <h3
                              className="font-heading text-spa-text leading-tight"
                              style={{
                                fontFamily: "var(--font-cormorant)",
                                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                              }}
                            >
                              {booking.service}
                            </h3>
                            <span
                              className={`font-body text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full ${
                                booking.status === "upcoming"
                                  ? "bg-spa-accent/10 text-spa-accent"
                                  : "bg-mint-100 text-spa-green"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <p className="font-body text-[10px] sm:text-xs text-spa-muted mb-1.5">
                            with {booking.therapist}
                          </p>
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-spa-muted/60" strokeWidth={1.5} />
                              <span className="font-body text-[10px] sm:text-xs text-spa-muted/70 truncate max-w-[120px] sm:max-w-none">
                                {booking.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-spa-muted/60" strokeWidth={1.5} />
                              <span className="font-body text-[10px] sm:text-xs text-spa-muted/70">
                                {booking.time} · {booking.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-body text-xs sm:text-sm font-semibold text-spa-accent">
                          {booking.price}
                        </p>
                        {booking.status === "completed" && (
                          <button className="font-body text-[9px] sm:text-[10px] text-spa-muted
                                             hover:text-spa-accent transition-colors mt-1 flex items-center gap-1 ml-auto">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={1.5} />
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/booking"
                className="inline-flex items-center gap-2 font-body text-xs sm:text-sm text-spa-accent
                           font-medium mt-3 sm:mt-4 hover:gap-3 transition-all group"
              >
                Book a new session
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-5">
            {/* Profile */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white/70 border border-mint-200/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-soft">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-mint-100">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-spa-accent rounded-xl sm:rounded-2xl
                                  flex items-center justify-center shadow-green flex-shrink-0">
                    <span
                      className="text-white text-lg sm:text-xl font-semibold"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {firstName.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-heading text-spa-text leading-tight truncate"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(1rem, 2vw, 1.2rem)",
                      }}
                    >
                      {displayName}
                    </p>
                    <p className="font-body text-[10px] sm:text-xs text-spa-accent">{demoUser.membershipTier}</p>
                    <p className="font-body text-[10px] sm:text-xs text-spa-muted truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  {[
                    { icon: User, label: "Edit profile", href: "#" },
                    { icon: Settings, label: "Preferences", href: "#" },
                    { icon: Shield, label: "Change password", href: "/change-password" },
                    { icon: TrendingUp, label: "Wellness history", href: "#" },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl
                                 hover:bg-mint-50 transition-colors group"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-mint-100 rounded-lg flex items-center
                                     justify-center group-hover:bg-spa-accent/10 transition-colors flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-spa-muted group-hover:text-spa-accent transition-colors"
                              strokeWidth={1.5} />
                      </div>
                      <span className="font-body text-xs sm:text-sm text-spa-text/80 group-hover:text-spa-text transition-colors flex-1">
                        {label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-spa-muted/40 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}

                  <button
                    onClick={logout}
                    className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl
                               hover:bg-red-50 transition-colors group w-full text-left mt-1"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" strokeWidth={1.5} />
                    </div>
                    <span className="font-body text-xs sm:text-sm text-red-400">Sign out</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Recommended */}
            <ScrollReveal delay={0.15}>
              <div className="bg-white/60 border border-mint-200/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
                <h3
                  className="font-heading text-spa-text mb-3 sm:mb-4"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                  }}
                >
                  Recommended
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {services.slice(0, 3).map((s) => (
                    <Link
                      key={s.id}
                      href={`/booking?service=${s.id}`}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl
                                 hover:bg-mint-50 transition-colors group"
                    >
                      <span className="text-lg sm:text-xl flex-shrink-0">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs sm:text-sm font-medium text-spa-text truncate">{s.title}</p>
                        <p className="font-body text-[10px] sm:text-xs text-spa-accent">{s.price}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-spa-muted/40 opacity-0 group-hover:opacity-100
                                            transition-all flex-shrink-0" strokeWidth={1.5} />
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Membership */}
            <ScrollReveal delay={0.2}>
              <div className="bg-gradient-to-br from-peach-200/60 to-peach-100/40 border border-peach-200/50
                              rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-peach">
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-spa-accent" strokeWidth={1.5} />
                  <span className="font-body text-[10px] sm:text-xs font-medium text-spa-accent uppercase tracking-wide">
                    Wellness Gold
                  </span>
                </div>
                <p
                  className="font-heading text-spa-text mb-1.5 sm:mb-2"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1rem, 2vw, 1.3rem)",
                  }}
                >
                  Member since {demoUser.joinedDate}
                </p>
                <p className="font-body text-[10px] sm:text-xs text-spa-muted leading-relaxed mb-3 sm:mb-4">
                  You have 1,240 loyalty points — enough for a complimentary 30-min add-on.
                </p>
                <button className="font-body text-xs text-spa-accent font-medium flex items-center gap-1.5
                                   hover:gap-2.5 transition-all group">
                  Redeem points
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
