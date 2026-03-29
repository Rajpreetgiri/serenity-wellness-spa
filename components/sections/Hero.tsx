"use client";

import { useEffect, useRef } from "react";
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-mint-100/75 via-spa-bg/70 to-spa-bg/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-spa-bg/40 to-transparent" />
      </motion.div>

      {/* Floating blobs */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-[10%] w-72 h-72 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-mint-200/30 blur-2xl -z-0"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], x: [0, -10, 0], y: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-[5%] w-64 h-64 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-peach-200/25 blur-2xl -z-0"
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center container-spa px-6 pt-20"
      >
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-mint-200/60 rounded-full px-5 py-2 mb-8 shadow-soft-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-spa-accent" />
          <span className="font-body text-xs text-spa-muted tracking-widest uppercase font-medium">
            Melbourne&apos;s Premier Wellness Sanctuary
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="font-heading text-spa-text leading-none mb-6"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
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
          className="font-body text-spa-muted text-lg max-w-md mx-auto mb-12 leading-relaxed"
        >
          Step away from the noise. Let our healing hands guide you back to yourself.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
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
            transition={{
              boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="rounded-2xl"
          >
            <Link href="/booking" className="btn-primary inline-block text-base px-10 py-4">
              Begin Your Journey
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/services" className="btn-secondary inline-block text-base px-10 py-4">
              Explore Treatments
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex gap-10 justify-center mt-20 mb-8"
        >
          {[
            { value: "2,400+", label: "Guests Healed" },
            { value: "12", label: "Treatments" },
            { value: "4.9★", label: "Google Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="font-heading text-3xl text-spa-accent"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {value}
              </p>
              <p className="font-body text-xs text-spa-muted tracking-wide uppercase mt-0.5">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-body text-xs text-spa-muted tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-spa-accent" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
