"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const paginate = (dir: number) => {
    setDirection(dir);
    setActive((prev) => {
      const next = prev + dir;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section className="section-padding bg-spa-bg relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mint-100 via-spa-bg to-peach-100/30" />

      <div className="container-spa relative z-10">
        <ScrollReveal className="text-center mb-16">
          <p
            className="font-body text-spa-accent text-xs tracking-[0.3em] uppercase font-medium mb-4"
            style={{ fontFamily: "var(--font-satisfy)" }}
          >
            kind words
          </p>
          <h2
            className="font-heading text-spa-text"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            What Our Guests Say
          </h2>
        </ScrollReveal>

        {/* Main testimonial */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative min-h-[280px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="bg-white/70 backdrop-blur-sm border border-mint-200/40 rounded-4xl p-10 shadow-soft text-center h-full flex flex-col justify-center">
                  <Quote className="w-8 h-8 text-spa-green/40 mx-auto mb-6" />

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p
                    className="font-heading text-spa-text text-xl md:text-2xl leading-relaxed mb-8 italic"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    &ldquo;{testimonials[active].text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-heading text-lg font-medium"
                      style={{ backgroundColor: testimonials[active].color }}
                    >
                      {testimonials[active].avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-body text-sm font-semibold text-spa-text">
                        {testimonials[active].name}
                      </p>
                      <p className="font-body text-xs text-spa-muted">
                        {testimonials[active].location} · {testimonials[active].service}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
              className="w-10 h-10 rounded-xl bg-white border border-mint-200 flex items-center justify-center shadow-soft-sm hover:shadow-soft transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-spa-text" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-8 bg-spa-accent"
                      : "w-1.5 bg-mint-300 hover:bg-spa-green"
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(1)}
              className="w-10 h-10 rounded-xl bg-white border border-mint-200 flex items-center justify-center shadow-soft-sm hover:shadow-soft transition-all"
            >
              <ChevronRight className="w-4 h-4 text-spa-text" />
            </motion.button>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.05}>
              <motion.button
                onClick={() => {
                  setDirection(i > active ? 1 : -1);
                  setActive(i);
                }}
                whileHover={{ y: -3 }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                  i === active
                    ? "bg-white border-spa-accent/40 shadow-soft"
                    : "bg-white/40 border-mint-200/40 hover:bg-white/70"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <span className="font-body text-xs font-medium text-spa-text truncate">
                    {t.name}
                  </span>
                </div>
                <p className="font-body text-[10px] text-spa-muted line-clamp-2 leading-relaxed">
                  {t.text.slice(0, 60)}...
                </p>
              </motion.button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
