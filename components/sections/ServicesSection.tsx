"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { services } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollBy = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const featured = services.slice(0, 4);

  return (
    <section className="section-padding bg-spa-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mint-300/40 to-transparent" />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -right-24 sm:-top-32 sm:-right-32 w-64 h-64 sm:w-96 sm:h-96
                   rounded-full border border-mint-200/20 pointer-events-none"
      />

      <div className="container-spa">
        {/* Header */}
        <ScrollReveal className="text-center mb-10 sm:mb-14 lg:mb-16">
          <p
            className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium mb-3 sm:mb-4"
            style={{ fontFamily: "var(--font-satisfy)" }}
          >
            our treatments
          </p>
          <h2
            className="font-heading text-spa-text mb-4"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            Curated Healing
            <br />
            <em className="italic text-spa-accent">Experiences</em>
          </h2>
          <p className="font-body text-spa-muted text-sm sm:text-base max-w-xs sm:max-w-lg mx-auto leading-relaxed">
            Each treatment is thoughtfully designed to address your unique needs — from the surface of the skin to the depths of the soul.
          </p>
        </ScrollReveal>

        {/* Featured grid — responsive from 1 → 2 → 4 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {featured.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative bg-white/60 backdrop-blur-sm border border-mint-200/40
                           rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg cursor-pointer h-full"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-9 h-9 sm:w-10 sm:h-10
                                  bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center
                                  text-base sm:text-lg shadow-soft-sm">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <p className="font-body text-[10px] sm:text-xs text-spa-muted/70 tracking-widest uppercase mb-1">
                    {service.tagline}
                  </p>
                  <h3
                    className="font-heading text-spa-text text-lg sm:text-xl mb-2"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-spa-muted/80 leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-spa-accent flex-shrink-0" strokeWidth={1.5} />
                      <span className="font-body text-[10px] sm:text-xs text-spa-muted">{service.duration}</span>
                    </div>
                    <span className="font-body text-xs sm:text-sm font-semibold text-spa-accent">
                      {service.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Horizontal scroll */}
        <ScrollReveal>
          <div className="relative">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p
                className="font-heading text-spa-text text-xl sm:text-2xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                All Treatments
              </p>
              <div className="flex gap-2">
                {[
                  { dir: "left" as const, disabled: !canScrollLeft },
                  { dir: "right" as const, disabled: !canScrollRight },
                ].map(({ dir, disabled }) => (
                  <motion.button
                    key={dir}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollBy(dir)}
                    disabled={disabled}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-mint-200
                               flex items-center justify-center disabled:opacity-30
                               shadow-soft-sm hover:shadow-soft transition-all"
                  >
                    {dir === "left"
                      ? <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-spa-text" />
                      : <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-spa-text" />
                    }
                  </motion.button>
                ))}
              </div>
            </div>

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="horizontal-scroll"
            >
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -4 }}
                  className="w-60 sm:w-64 md:w-72 bg-white/70 border border-mint-200/40 rounded-2xl p-4 sm:p-5
                             shadow-soft-sm hover:shadow-soft transition-all flex-shrink-0"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3 mb-3">
                    <span className="text-xl sm:text-2xl">{service.icon}</span>
                    <div className="min-w-0">
                      <h4
                        className="font-heading text-spa-text text-base sm:text-lg leading-tight"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {service.title}
                      </h4>
                      <p className="font-body text-[10px] sm:text-xs text-spa-muted/70">{service.tagline}</p>
                    </div>
                  </div>
                  <p className="font-body text-[11px] sm:text-xs text-spa-muted/80 leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-mint-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-spa-accent flex-shrink-0" strokeWidth={1.5} />
                      <span className="font-body text-[10px] sm:text-xs text-spa-muted">{service.duration}</span>
                    </div>
                    <span className="font-body text-[10px] sm:text-xs font-semibold text-spa-accent">
                      {service.price}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal className="text-center mt-10 sm:mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-body text-spa-accent text-sm font-medium
                       hover:gap-3 transition-all duration-300 group"
          >
            View all treatments & pricing
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
