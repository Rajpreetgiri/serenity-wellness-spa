"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight, ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ServicesSection() {
  const bento = services.slice(0, 4);
  const [hero, ...rest] = bento;

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* subtle top divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mint-200/60 to-transparent" />

      <div className="container-spa">

        {/* ── Header row ── */}
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 lg:mb-14">
          <div>
            <p
              className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium mb-3"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              our treatments
            </p>
            <h2
              className="font-heading text-spa-text leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Curated Healing
              <br />
              <em className="italic text-spa-accent">Experiences</em>
            </h2>
          </div>
          <div className="sm:text-right max-w-xs sm:max-w-[240px]">
            <p className="font-body text-spa-muted text-sm leading-relaxed mb-4">
              12 signature treatments designed for your body and mind.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-spa-accent
                         hover:gap-3 transition-all duration-300 group"
            >
              Explore all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">

          {/* Hero card — spans 2 cols on lg */}
          <ScrollReveal className="lg:col-span-2">
            <Link href="/booking">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative h-[320px] sm:h-[360px] lg:h-[420px] rounded-[1.5rem] sm:rounded-[2rem]
                           overflow-hidden cursor-pointer shadow-soft hover:shadow-soft-lg transition-shadow duration-500"
              >
                <Image
                  src={hero.image}
                  alt={hero.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spa-text/80 via-spa-text/20 to-transparent" />

                {/* Top-right badge */}
                <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-sm border border-white/20
                                text-white rounded-full px-3 py-1 font-body text-[10px] sm:text-xs tracking-wider uppercase">
                  {hero.category}
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <p className="font-body text-white/70 text-[10px] sm:text-xs tracking-widest uppercase mb-1.5">
                    {hero.tagline}
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <h3
                      className="text-white leading-tight"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
                    >
                      {hero.title}
                    </h3>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="font-body text-white font-semibold text-sm sm:text-base">{hero.price}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-white/60" strokeWidth={1.5} />
                        <span className="font-body text-white/60 text-[10px] sm:text-xs">{hero.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 text-white/90 font-body text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Book this treatment
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </ScrollReveal>

          {/* Small cards */}
          {rest.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.07}>
              <Link href="/booking">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="group relative h-[200px] sm:h-[220px] lg:h-[200px] rounded-[1.5rem] overflow-hidden
                             cursor-pointer shadow-soft hover:shadow-soft-lg transition-shadow duration-500"
                  style={{ height: i === 0 ? undefined : undefined }}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-spa-text/75 via-spa-text/15 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="font-body text-white/60 text-[9px] sm:text-[10px] tracking-widest uppercase mb-1">
                          {service.tagline}
                        </p>
                        <h3
                          className="text-white leading-tight"
                          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}
                        >
                          {service.title}
                        </h3>
                      </div>
                      <span className="font-body text-white font-semibold text-sm flex-shrink-0">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* Icon badge */}
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 bg-white/15 backdrop-blur-sm
                                  rounded-xl flex items-center justify-center text-sm">
                    {service.icon}
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* ── Remaining services: horizontal pill row ── */}
        <ScrollReveal>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {services.slice(4).map((s) => (
              <Link key={s.id} href="/services">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2.5 bg-spa-bg border border-mint-200/60 rounded-2xl
                             px-4 py-2.5 hover:border-spa-accent hover:bg-mint-50 transition-all duration-300 group"
                >
                  <span className="text-base">{s.icon}</span>
                  <div>
                    <p className="font-body text-xs sm:text-sm font-medium text-spa-text group-hover:text-spa-accent transition-colors">
                      {s.title}
                    </p>
                    <p className="font-body text-[9px] sm:text-[10px] text-spa-muted">{s.duration} · {s.price}</p>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-spa-accent/0 group-hover:text-spa-accent/80 transition-all ml-1" />
                </motion.div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
