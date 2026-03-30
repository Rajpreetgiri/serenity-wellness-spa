"use client";

import { motion } from "framer-motion";
import { journeySteps } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function JourneySection() {
  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-spa-text to-[#2d3f35]">

      {/* Blobs */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full
                   bg-spa-accent/8 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, -6, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-20 -left-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full
                   bg-peach-200/8 blur-3xl pointer-events-none"
      />

      <div className="container-spa relative z-10">

        {/* Header */}
        <ScrollReveal className="text-center mb-12 sm:mb-16 lg:mb-20">
          <p
            className="text-spa-green text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium mb-3 sm:mb-4 font-body"
            style={{ fontFamily: "var(--font-satisfy)" }}
          >
            your visit
          </p>
          <h2
            className="text-white leading-tight mb-4 sm:mb-5"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            The Serenity
            <br />
            <em className="italic text-spa-green">Experience</em>
          </h2>
          <p className="font-body text-white/55 text-sm sm:text-base max-w-xs sm:max-w-md mx-auto leading-relaxed">
            From the moment you arrive to the moment you leave, every detail is orchestrated for your peace.
          </p>
        </ScrollReveal>

        {/* ── Steps ── */}
        <div className="relative mb-14 sm:mb-18">

          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px
                          bg-gradient-to-r from-transparent via-spa-accent/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {journeySteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280 }}
                  className="group relative flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                  {/* Icon circle + number */}
                  <div className="relative mb-5 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/6 border border-white/10
                                    group-hover:bg-spa-accent/15 group-hover:border-spa-accent/30
                                    flex items-center justify-center transition-all duration-500">
                      <span className="text-2xl sm:text-3xl">{step.icon}</span>
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-spa-accent rounded-full
                                    flex items-center justify-center">
                      <span className="font-body text-[9px] text-white font-semibold">{i + 1}</span>
                    </div>
                  </div>

                  {/* Text */}
                  <h3
                    className="text-white mb-2 sm:mb-3"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-white/50 leading-relaxed max-w-[220px] lg:max-w-none mx-auto lg:mx-0">
                    {step.description}
                  </p>

                  {/* Arrow between steps — desktop only */}
                  {i < journeySteps.length - 1 && (
                    <div className="hidden lg:block absolute top-7 -right-4 xl:-right-6 text-spa-accent/30">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <ScrollReveal className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white text-spa-text font-body font-medium
                         px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl hover:bg-spa-accent hover:text-white
                         transition-all duration-300 shadow-green text-sm sm:text-base tracking-wide group"
            >
              Begin Your Journey
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <Link
            href="/about"
            className="font-body text-white/60 text-sm hover:text-white transition-colors underline underline-offset-4"
          >
            Meet our therapists
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
