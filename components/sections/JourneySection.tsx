"use client";

import { motion } from "framer-motion";
import { journeySteps } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";

export default function JourneySection() {
  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-spa-text to-[#2d3f35]">
      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-48 h-48 sm:w-80 sm:h-80 lg:w-[30rem] lg:h-[30rem]
                   rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-spa-accent/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, -8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96
                   rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-peach-200/10 blur-3xl pointer-events-none"
      />

      <div className="container-spa relative z-10">
        <ScrollReveal className="text-center mb-10 sm:mb-14 lg:mb-16">
          <p
            className="text-spa-green text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium mb-3 sm:mb-4 font-body"
            style={{ fontFamily: "var(--font-satisfy)" }}
          >
            your visit
          </p>
          <h2
            className="text-white leading-tight mb-4 sm:mb-5"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            The Serenity
            <br />
            <em className="italic text-spa-green">Experience</em>
          </h2>
          <p className="font-body text-white/60 text-sm sm:text-base max-w-xs sm:max-w-lg mx-auto leading-relaxed">
            From arrival to departure, every moment at Serenity is orchestrated to return you to peace.
          </p>
        </ScrollReveal>

        {/* Steps — 1 col → 2 col → 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-16">
          {journeySteps.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative group h-full"
              >
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 h-full
                                hover:bg-white/[0.08] hover:border-spa-accent/30 transition-all duration-500">
                  {/* Step number + icon */}
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                    <span
                      className="font-heading text-white/10 leading-none"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(2.5rem, 5vw, 3rem)",
                      }}
                    >
                      {step.step}
                    </span>
                    <span className="text-2xl sm:text-3xl">{step.icon}</span>
                  </div>

                  <h3
                    className="text-white mb-2.5 sm:mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-white/55 leading-relaxed">
                    {step.description}
                  </p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-spa-accent/50 to-transparent"
                  />
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal className="text-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              href="/booking"
              className="inline-block bg-white text-spa-text font-body font-medium
                         px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl hover:bg-spa-green hover:text-white
                         transition-all duration-300 shadow-green text-sm sm:text-base tracking-wide"
            >
              Begin Your Journey
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
