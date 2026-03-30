"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const paginate = (dir: number) => {
    setDirection(dir);
    setActive((p) => {
      const n = p + dir;
      if (n < 0) return testimonials.length - 1;
      if (n >= testimonials.length) return 0;
      return n;
    });
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section className="section-padding bg-spa-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-mint-50/80 via-spa-bg to-peach-100/20" />

      <div className="container-spa relative z-10">

        {/* Header */}
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p
              className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium mb-3"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              kind words
            </p>
            <h2
              className="font-heading text-spa-text leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              What Our Guests Say
            </h2>
          </div>

          {/* Rating badge */}
          <div className="flex items-center gap-3 bg-white/70 border border-mint-200/50 rounded-2xl px-4 py-3 shadow-soft-sm w-fit">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <div>
              <p className="font-heading text-spa-text text-base sm:text-lg leading-none"
                 style={{ fontFamily: "var(--font-cormorant)" }}>4.9 / 5.0</p>
              <p className="font-body text-[10px] sm:text-xs text-spa-muted">200+ Google reviews</p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Main layout: featured left + grid right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 mb-8 sm:mb-10">

          {/* Featured testimonial — col-span-3 */}
          <ScrollReveal className="lg:col-span-3">
            <div className="relative bg-white/70 backdrop-blur-sm border border-mint-200/40 rounded-[1.5rem] sm:rounded-[2rem]
                            p-6 sm:p-8 shadow-soft overflow-hidden min-h-[300px] sm:min-h-[320px] flex flex-col justify-between">

              {/* Large quote mark */}
              <div className="absolute -top-4 -right-4 text-[8rem] sm:text-[10rem] text-mint-200/40 leading-none
                              font-heading pointer-events-none select-none"
                   style={{ fontFamily: "var(--font-cormorant)" }}>
                &ldquo;
              </div>

              <div className="relative z-10">
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-spa-accent/30 mb-4 sm:mb-6" />

                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={active}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.38, ease: "easeInOut" }}
                  >
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(testimonials[active].rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p
                      className="font-heading text-spa-text italic leading-relaxed mb-6 sm:mb-8"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)" }}
                    >
                      &ldquo;{testimonials[active].text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
                                   text-white font-heading text-base sm:text-lg font-medium flex-shrink-0"
                        style={{ backgroundColor: testimonials[active].color }}
                      >
                        {testimonials[active].avatar}
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-spa-text">{testimonials[active].name}</p>
                        <p className="font-body text-xs text-spa-muted">
                          {testimonials[active].location} · {testimonials[active].service}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-mint-100 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(-1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-spa-bg border border-mint-200
                             flex items-center justify-center hover:border-spa-accent transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-spa-text" />
                </motion.button>
                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? "w-6 sm:w-8 bg-spa-accent" : "w-1.5 bg-mint-300 hover:bg-spa-accent/50"
                      }`}
                    />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(1)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-spa-bg border border-mint-200
                             flex items-center justify-center hover:border-spa-accent transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-spa-text" />
                </motion.button>
              </div>
            </div>
          </ScrollReveal>

          {/* Mini cards — col-span-2 */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.05}>
                <motion.button
                  onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl
                              border transition-all duration-300 ${
                    i === active
                      ? "bg-white border-spa-accent/30 shadow-soft"
                      : "bg-white/40 border-mint-200/40 hover:bg-white/70 hover:border-mint-300"
                  }`}
                >
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
                               text-white text-[10px] sm:text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-body text-xs font-semibold text-spa-text truncate">{t.name}</span>
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(t.rating)].map((_, j) => (
                          <Star key={j} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="font-body text-[10px] sm:text-xs text-spa-muted line-clamp-2 leading-relaxed">
                      {t.text.slice(0, 70)}...
                    </p>
                  </div>
                </motion.button>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { num: "2,400+", label: "Guests served" },
              { num: "98%", label: "Would recommend" },
              { num: "12", label: "Signature treatments" },
              { num: "8+", label: "Years in business" },
            ].map((item) => (
              <div key={item.label}
                   className="bg-white/50 border border-mint-100 rounded-2xl p-4 sm:p-5 text-center">
                <p
                  className="font-heading text-spa-accent mb-1"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                >
                  {item.num}
                </p>
                <p className="font-body text-[10px] sm:text-xs text-spa-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
