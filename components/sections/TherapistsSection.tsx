"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { therapists } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function TherapistsSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-spa-bg via-[#f7fbf8] to-mint-50" />

      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-4 sm:right-8 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32
                   rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-peach-200/30 pointer-events-none"
      />

      <div className="container-spa relative z-10">
        <ScrollReveal className="text-center mb-10 sm:mb-14 lg:mb-16">
          <p
            className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium mb-3 sm:mb-4"
            style={{ fontFamily: "var(--font-satisfy)" }}
          >
            our healers
          </p>
          <h2
            className="font-heading text-spa-text mb-4"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            Meet the Hands
            <br />
            <em className="italic text-spa-accent">Behind Your Healing</em>
          </h2>
          <p className="font-body text-spa-muted text-sm sm:text-base max-w-xs sm:max-w-lg mx-auto leading-relaxed">
            Our therapists are more than practitioners — they are listeners, healers, and devoted guides on your wellness journey.
          </p>
        </ScrollReveal>

        {/* Grid: 1 → 2 → 4 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {therapists.map((therapist, i) => (
            <ScrollReveal key={therapist.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -7 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group bg-white/70 border border-mint-200/40 rounded-3xl overflow-hidden
                           shadow-soft hover:shadow-soft-lg h-full"
              >
                {/* Avatar */}
                <div className="relative h-52 sm:h-56 lg:h-64 overflow-hidden bg-mint-100">
                  <Image
                    src={therapist.image}
                    alt={therapist.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm
                                  rounded-full px-2 sm:px-2.5 py-1 shadow-soft-sm">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-body text-xs font-semibold text-spa-text">
                      {therapist.rating}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5">
                  <h3
                    className="font-heading text-spa-text mb-0.5"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                    }}
                  >
                    {therapist.name}
                  </h3>
                  <p className="font-body text-xs text-spa-accent font-medium tracking-wide mb-2.5 sm:mb-3">
                    {therapist.title}
                  </p>
                  <p className="font-body text-xs text-spa-muted leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                    {therapist.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                    {therapist.specialties.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="font-body text-[9px] sm:text-[10px] text-spa-accent bg-mint-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-mint-100">
                    <span className="font-body text-[10px] sm:text-xs text-spa-muted">
                      {therapist.experience} exp.
                    </span>
                    <span className="font-body text-[10px] sm:text-xs text-spa-muted/60">
                      {therapist.reviews} reviews
                    </span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-10 sm:mt-12">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 font-body text-spa-accent text-sm font-medium
                       hover:gap-3 transition-all duration-300 group"
          >
            Book with a therapist
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
