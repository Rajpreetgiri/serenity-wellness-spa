"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=90"
          alt="Serenity Wellness Spa"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mint-100/75 via-spa-bg/65 to-spa-bg/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-spa-bg/30 to-transparent" />
      </motion.div>

      {/* Decorative blobs — hidden on tiny screens to avoid overflow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[-2%] sm:right-[8%] w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72
                   rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-mint-200/25 blur-2xl -z-0 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-24 left-[-2%] sm:left-[3%] w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64
                   rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-peach-200/20 blur-2xl -z-0 pointer-events-none"
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center w-full container-spa pt-20 sm:pt-24"
      >
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-mint-200/60
                     rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 shadow-soft-sm"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-spa-accent flex-shrink-0" />
          <span className="font-body text-[9px] sm:text-xs text-spa-muted tracking-widest uppercase font-medium">
            Melbourne&apos;s Premier Wellness Sanctuary
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-heading text-spa-text leading-none mb-5 sm:mb-6"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.8rem, 9vw, 6.5rem)",
            fontWeight: 400,
          }}
        >
          Find Your
          <br />
          <em
            className="italic gradient-text"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Stillness
          </em>
          <br />
          Within
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-body text-spa-muted text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-sm md:max-w-md
                     mx-auto mb-8 sm:mb-12 leading-relaxed px-2"
        >
          Step away from the noise. Let our healing hands guide you back to yourself.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                "0 8px 32px rgba(109,139,116,0.2)",
                "0 12px 40px rgba(109,139,116,0.35)",
                "0 8px 32px rgba(109,139,116,0.2)",
              ],
            }}
            transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
            className="rounded-2xl w-full xs:w-auto"
          >
            <Link
              href="/booking"
              className="bg-spa-accent text-white rounded-2xl font-body font-medium
                         transition-all duration-300 hover:bg-spa-text active:scale-95 tracking-wide
                         text-sm sm:text-base px-7 sm:px-10 py-3.5 sm:py-4
                         block w-full xs:w-auto text-center"
            >
              Begin Your Journey
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full xs:w-auto">
            <Link
              href="/services"
              className="bg-transparent border border-spa-accent text-spa-accent rounded-2xl font-body
                         font-medium transition-all duration-300 hover:bg-spa-accent hover:text-white
                         active:scale-95 tracking-wide text-sm sm:text-base px-7 sm:px-10 py-3.5 sm:py-4
                         block w-full xs:w-auto text-center"
            >
              Explore Treatments
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex gap-5 sm:gap-8 lg:gap-10 justify-center mt-14 sm:mt-20 mb-6 sm:mb-8"
        >
          {[
            { value: "2,400+", label: "Guests Healed" },
            { value: "12", label: "Treatments" },
            { value: "4.9★", label: "Google Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="font-heading text-spa-accent"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.5rem, 5vw, 2rem)",
                }}
              >
                {value}
              </p>
              <p className="font-body text-[9px] sm:text-xs text-spa-muted tracking-wide uppercase mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="font-body text-[10px] sm:text-xs text-spa-muted tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-spa-accent" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
