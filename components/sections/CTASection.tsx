"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Clock, Star } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const BADGES = [
  { icon: Clock, label: "Same-day bookings available" },
  { icon: Star, label: "4.9 Google Rating" },
  { icon: Gift, label: "Gift vouchers from $75" },
];

export default function CTASection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-spa">
        <ScrollReveal>
          <div className="relative rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">

            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&q=85"
                alt="Book a wellness session"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-spa-text/92 via-spa-text/80 to-spa-text/40" />
            </div>

            {/* Content grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* LEFT: main CTA */}
              <div className="p-7 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-between min-h-[420px] sm:min-h-[480px]">
                <div>
                  <p
                    className="text-spa-green text-[10px] sm:text-xs font-body tracking-[0.25em] uppercase mb-3 sm:mb-4"
                    style={{ fontFamily: "var(--font-satisfy)" }}
                  >
                    gift of wellness
                  </p>
                  <h2
                    className="text-white leading-tight mb-5 sm:mb-6"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
                  >
                    Ready to Begin
                    <br />
                    <em className="italic text-spa-green">Your Transformation?</em>
                  </h2>
                  <p className="font-body text-white/60 mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base max-w-sm">
                    Your first step toward calm is one click away. Book online in under 60 seconds.
                  </p>

                  <div className="flex flex-col xs:flex-row gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/booking"
                        className="inline-flex items-center justify-center gap-2 bg-white text-spa-text font-body
                                   font-medium px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                                   hover:bg-spa-accent hover:text-white transition-all duration-300
                                   text-sm tracking-wide group w-full xs:w-auto"
                      >
                        Book a Session
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 bg-transparent
                                   border border-white/30 text-white font-body font-medium
                                   px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                                   hover:bg-white/10 transition-all duration-300 text-sm tracking-wide
                                   w-full xs:w-auto"
                      >
                        <Gift className="w-4 h-4" />
                        Gift a Voucher
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-col gap-2.5 mt-8 sm:mt-10">
                  {BADGES.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                      className="flex items-center gap-2.5"
                    >
                      <div className="w-6 h-6 rounded-lg bg-spa-accent/20 border border-spa-accent/30
                                      flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-3 h-3 text-spa-green" strokeWidth={1.5} />
                      </div>
                      <span className="font-body text-xs text-white/65">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* RIGHT: floating stat cards — lg only */}
              <div className="hidden lg:flex items-center justify-center p-10 xl:p-16">
                <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
                  {[
                    { value: "2,400+", label: "Happy Guests", icon: "😊" },
                    { value: "12", label: "Treatments", icon: "✨" },
                    { value: "4.9★", label: "Google Rating", icon: "⭐" },
                    { value: "8 yrs", label: "Experience", icon: "🌿" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center"
                    >
                      <span className="text-2xl mb-2 block">{stat.icon}</span>
                      <p
                        className="text-white leading-none mb-1"
                        style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem" }}
                      >
                        {stat.value}
                      </p>
                      <p className="font-body text-[10px] text-white/55 uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile stat strip */}
        <ScrollReveal className="mt-4 lg:hidden">
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: "2.4k+", label: "Guests" },
              { value: "12", label: "Services" },
              { value: "4.9", label: "Rating" },
              { value: "8yr", label: "Est." },
            ].map((item) => (
              <div key={item.label}
                   className="bg-spa-bg border border-mint-100 rounded-2xl p-3 text-center">
                <p
                  className="font-heading text-spa-accent"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem" }}
                >
                  {item.value}
                </p>
                <p className="font-body text-[9px] text-spa-muted uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
