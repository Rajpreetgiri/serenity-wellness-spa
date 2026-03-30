"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Check, ArrowRight, Sparkles } from "lucide-react";
import { services } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CATEGORIES = ["all", "massage", "wellness", "specialist"];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-spa-bg to-mint-50 pt-20 sm:pt-24">
      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80
                     rounded-[60%_40%_30%_70%] bg-mint-200/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 left-0 w-36 h-36 sm:w-56 sm:h-56 lg:w-72 lg:h-72
                     rounded-[40%_60%_70%_30%] bg-peach-200/15 blur-3xl pointer-events-none"
        />

        <div className="relative container-spa text-center">
          <ScrollReveal>
            <p
              className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              healing treatments
            </p>
            <h1
              className="font-heading text-spa-text mb-4 sm:mb-5"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
              }}
            >
              Our <em className="italic text-spa-accent">Treatments</em>
            </h1>
            <p className="font-body text-spa-muted max-w-xs sm:max-w-lg mx-auto leading-relaxed text-sm sm:text-base lg:text-lg">
              Every treatment is an invitation to slow down, restore, and return to what matters.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-[53px] sm:top-[61px] z-30 bg-white/80 backdrop-blur-xl
                      border-b border-mint-200/40 py-3 sm:py-4">
        <div className="container-spa">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 font-body text-xs sm:text-sm px-3.5 sm:px-5 py-2 rounded-xl
                           border transition-all duration-300 capitalize ${
                  activeCategory === cat
                    ? "bg-spa-accent text-white border-spa-accent shadow-green"
                    : "bg-white border-mint-200 text-spa-muted hover:border-spa-green"
                }`}
              >
                {cat === "all" ? "All treatments" : cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="container-spa">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
            >
              {filtered.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group bg-white/70 backdrop-blur-sm border border-mint-200/40 rounded-3xl
                             overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-52 lg:h-60 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm
                                    rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 shadow-soft-sm">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-spa-accent" />
                      <span className="font-body text-[9px] sm:text-xs text-spa-text capitalize">{service.category}</span>
                    </div>
                    <div className="absolute top-3 right-3 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm
                                    rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-soft-sm">
                      {service.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <p className="font-body text-[10px] sm:text-xs text-spa-muted/70 tracking-wide mb-1">
                      {service.tagline}
                    </p>
                    <h2
                      className="font-heading text-spa-text mb-2.5 sm:mb-3"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                      }}
                    >
                      {service.title}
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-spa-muted leading-relaxed mb-4 sm:mb-5">
                      {service.description}
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-1.5 mb-4 sm:mb-6">
                      {service.benefits.map((b) => (
                        <div key={b} className="flex items-center gap-1.5">
                          <div className="w-4 h-4 bg-spa-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-spa-accent" strokeWidth={3} />
                          </div>
                          <span className="font-body text-[10px] sm:text-xs text-spa-muted">{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-mint-100 gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-spa-accent flex-shrink-0" strokeWidth={1.5} />
                          <span className="font-body text-[10px] sm:text-xs text-spa-muted">{service.duration}</span>
                        </div>
                        <span
                          className="font-heading text-spa-accent"
                          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem, 2vw, 1.3rem)" }}
                        >
                          {service.price}
                        </span>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-shrink-0">
                        <Link
                          href={`/booking?service=${service.id}`}
                          className="bg-spa-accent text-white font-body font-medium rounded-xl
                                     transition-all duration-300 hover:bg-spa-text hover:shadow-green
                                     active:scale-95 text-[10px] sm:text-xs px-3.5 sm:px-5 py-2 sm:py-2.5
                                     flex items-center gap-1.5 group"
                        >
                          Book now
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Package CTA */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="container-spa">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-spa-text to-[#2d3f35] rounded-3xl sm:rounded-4xl
                            p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 w-20 h-20 sm:w-32 sm:h-32
                           rounded-full border border-white/5 pointer-events-none"
              />
              <p
                className="text-spa-green text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 font-body"
                style={{ fontFamily: "var(--font-satisfy)" }}
              >
                packages & memberships
              </p>
              <h2
                className="text-white mb-4 sm:mb-5"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                }}
              >
                Create Your Ritual
              </h2>
              <p className="font-body text-white/60 max-w-xs sm:max-w-lg mx-auto mb-7 sm:mb-10 leading-relaxed text-sm sm:text-base">
                Discover our curated wellness packages and monthly memberships — because healing is most powerful as a practice.
              </p>
              <div className="flex flex-col xs:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-block bg-white text-spa-text font-body font-medium px-6 sm:px-8
                             py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-spa-green hover:text-white
                             transition-all duration-300 text-sm text-center"
                >
                  Enquire about packages
                </Link>
                <Link
                  href="/booking"
                  className="inline-block bg-transparent border border-white/30 text-white font-body
                             font-medium px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                             hover:bg-white/10 transition-all duration-300 text-sm text-center"
                >
                  Book a single session
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
