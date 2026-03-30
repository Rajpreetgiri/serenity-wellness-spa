"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Check, ArrowRight, ChevronDown,
  Sparkles, ArrowUpRight, Star
} from "lucide-react";
import { services } from "@/lib/data";

/* ─── Category config ─── */
const CATS = [
  { id: "all", label: "All", count: services.length },
  { id: "massage", label: "Massage", count: services.filter((s) => s.category === "massage").length },
  { id: "wellness", label: "Wellness", count: services.filter((s) => s.category === "wellness").length },
  { id: "specialist", label: "Specialist", count: services.filter((s) => s.category === "specialist").length },
];

const CATEGORY_PALETTE: Record<string, { bg: string; text: string; border: string }> = {
  massage: { bg: "bg-mint-100", text: "text-spa-accent", border: "border-mint-200" },
  wellness: { bg: "bg-peach-100", text: "text-peach-300", border: "border-peach-200/60" },
  specialist: { bg: "bg-[#ede8f6]", text: "text-[#7c6aad]", border: "border-[#d6cff0]" },
};

/* ─── Stat pill ─── */
function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/60 border border-mint-200/50 rounded-full
                    px-3 py-1.5 shadow-soft-sm backdrop-blur-sm">
      <span className="text-spa-accent">{icon}</span>
      <span className="font-body text-[10px] sm:text-xs text-spa-text font-medium">{label}</span>
    </div>
  );
}

/* ─── Mobile accordion card ─── */
function MobileCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const palette = CATEGORY_PALETTE[service.category] ?? CATEGORY_PALETTE.massage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="bg-white/65 backdrop-blur-sm border border-mint-200/40 rounded-3xl overflow-hidden shadow-soft"
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full text-left flex items-center gap-0 focus:outline-none"
      >
        {/* Thumbnail */}
        <div className="relative w-24 xs:w-28 sm:w-36 flex-shrink-0 self-stretch overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className={`object-cover transition-transform duration-700 ${open ? "scale-110" : "scale-100"}`}
            sizes="(max-width: 640px) 96px, 144px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          <div className="absolute top-2 left-2 w-7 h-7 bg-white/80 rounded-xl flex items-center justify-center text-sm shadow-soft-sm">
            {service.icon}
          </div>
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0 px-4 py-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className={`font-body text-[9px] uppercase tracking-widest font-medium mb-0.5 ${palette.text}`}>
                {service.category}
              </p>
              <h3
                className="font-heading text-spa-text leading-tight"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1rem, 3vw, 1.2rem)" }}
              >
                {service.title}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="mt-0.5 flex-shrink-0"
            >
              <ChevronDown className="w-4 h-4 text-spa-muted" strokeWidth={1.5} />
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-spa-accent flex-shrink-0" strokeWidth={1.5} />
              <span className="font-body text-[10px] text-spa-muted">{service.duration}</span>
            </div>
            <span className="font-body text-xs font-semibold text-spa-accent">{service.price}</span>
          </div>
        </div>
      </button>

      {/* Accordion body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-2 border-t border-mint-100">
              <p className="font-body text-xs sm:text-sm text-spa-muted leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mb-5">
                {service.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-spa-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-spa-accent" strokeWidth={3} />
                    </div>
                    <span className="font-body text-[10px] sm:text-xs text-spa-muted">{b}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/booking?service=${service.id}`}
                className="inline-flex items-center gap-2 bg-spa-accent text-white font-body font-medium
                           text-xs px-5 py-2.5 rounded-xl hover:bg-spa-text transition-colors group"
              >
                Book this treatment
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Desktop split-screen left panel ─── */
function ShowcasePanel({ service }: { service: typeof services[0] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full h-full"
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          sizes="40vw"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-spa-text/85 via-spa-text/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 xl:p-10">
          {/* Category badge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 self-start
                        backdrop-blur-sm border font-body text-xs font-medium uppercase tracking-widest
                        ${CATEGORY_PALETTE[service.category]?.bg ?? "bg-mint-100"}
                        ${CATEGORY_PALETTE[service.category]?.text ?? "text-spa-accent"}
                        ${CATEGORY_PALETTE[service.category]?.border ?? "border-mint-200"}`}
          >
            <Sparkles className="w-3 h-3" />
            {service.category}
          </motion.div>

          <motion.h2
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white leading-none mb-2"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 400 }}
          >
            {service.title}
          </motion.h2>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="font-body text-white/65 text-sm leading-relaxed mb-5 max-w-xs"
          >
            {service.description}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-6 flex-wrap"
          >
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20
                            rounded-full px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-white/80" strokeWidth={1.5} />
              <span className="font-body text-xs text-white/80">{service.duration}</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
              <span
                className="text-white"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.05rem" }}
              >
                {service.price}
              </span>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-7"
          >
            {service.benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-spa-green/30 border border-spa-green/50 rounded-full
                                flex items-center justify-center flex-shrink-0">
                  <Check className="w-2 h-2 text-spa-green" strokeWidth={3} />
                </div>
                <span className="font-body text-[11px] text-white/70">{b}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href={`/booking?service=${service.id}`}
              className="inline-flex items-center gap-2 bg-white text-spa-text font-body font-medium
                         text-sm px-6 py-3 rounded-xl hover:bg-spa-green hover:text-white
                         transition-all duration-300 group shadow-soft-sm"
            >
              Book this treatment
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Tagline ribbon */}
        <div className="absolute top-6 right-6">
          <div
            className="font-body text-[10px] text-white/60 uppercase tracking-[0.25em] rotate-90 origin-top-right"
          >
            {service.tagline}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Desktop service row ─── */
function ServiceRow({
  service,
  index,
  active,
  onHover,
  onClick,
}: {
  service: typeof services[0];
  index: number;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const palette = CATEGORY_PALETTE[service.category] ?? CATEGORY_PALETTE.massage;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onHoverStart={onHover}
      onClick={onClick}
      className={`group relative flex items-center gap-5 px-6 py-5 xl:py-6 cursor-pointer
                  border-b border-mint-100 transition-all duration-300 select-none
                  ${active ? "bg-white/80" : "hover:bg-white/50"}`}
    >
      {/* Active indicator bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-all duration-300
                    ${active ? "bg-spa-accent opacity-100" : "bg-spa-accent opacity-0 group-hover:opacity-40"}`}
      />

      {/* Number */}
      <div
        className={`w-10 h-10 xl:w-11 xl:h-11 flex-shrink-0 flex items-center justify-center
                    rounded-2xl border transition-all duration-300 font-heading text-lg
                    ${active
                      ? "bg-spa-accent text-white border-spa-accent shadow-green"
                      : "bg-mint-50 text-spa-muted/50 border-mint-200 group-hover:bg-spa-accent/10 group-hover:text-spa-accent group-hover:border-spa-accent/30"
                    }`}
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <h3
            className={`font-heading leading-tight transition-colors duration-300
                        ${active ? "text-spa-accent" : "text-spa-text group-hover:text-spa-accent"}`}
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)" }}
          >
            {service.title}
          </h3>
          <span
            className={`font-body text-[9px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full border ${palette.bg} ${palette.text} ${palette.border}`}
          >
            {service.category}
          </span>
        </div>
        <p className="font-body text-xs text-spa-muted/70 italic" style={{ fontFamily: "var(--font-cormorant)" }}>
          {service.tagline}
        </p>
      </div>

      {/* Right meta */}
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center gap-1.5 justify-end mb-1">
          <Clock className="w-3 h-3 text-spa-muted/50" strokeWidth={1.5} />
          <span className="font-body text-[10px] text-spa-muted/70">{service.duration}</span>
        </div>
        <span
          className={`font-heading transition-colors duration-300
                      ${active ? "text-spa-accent" : "text-spa-text group-hover:text-spa-accent"}`}
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1rem, 1.5vw, 1.1rem)" }}
        >
          {service.price}
        </span>
      </div>

      {/* Arrow */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border
                    transition-all duration-300
                    ${active
                      ? "bg-spa-accent border-spa-accent text-white"
                      : "bg-transparent border-mint-200 text-spa-muted/30 group-hover:border-spa-accent/40 group-hover:text-spa-accent/60"
                    }`}
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
}

/* ─── Pricing card (bottom section) ─── */
const pricingTiers = [
  {
    name: "Single Session",
    desc: "Perfect for first-timers or occasional relaxation.",
    price: "From $95",
    features: ["1 treatment of your choice", "Welcome consultation", "Organic products", "Herbal tea on arrival"],
    color: "bg-white/60",
    cta: "Book a session",
    href: "/booking",
  },
  {
    name: "Wellness Package",
    desc: "Three sessions, curated for deeper transformation.",
    price: "From $330",
    features: ["3 treatments (mix & match)", "Priority booking", "10% savings", "Complimentary add-on"],
    color: "bg-spa-accent",
    cta: "Get the package",
    href: "/contact",
    featured: true,
  },
  {
    name: "Monthly Ritual",
    desc: "Commit to your wellbeing with unlimited monthly care.",
    price: "From $199/mo",
    features: ["2 sessions per month", "Members-only times", "Loyalty points", "Free gift voucher on birthday"],
    color: "bg-white/60",
    cta: "Enquire now",
    href: "/contact",
  },
];

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredId, setHoveredId] = useState<string>(services[0].id);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === "all" ? services : services.filter((s) => s.category === activeCategory);

  const activeService = services.find((s) => s.id === hoveredId) ?? filtered[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-spa-bg to-[#f4f9f6] pt-20 sm:pt-24 overflow-x-hidden">

      {/* ── EDITORIAL HERO ── */}
      <section className="container-spa pt-8 sm:pt-12 pb-8 sm:pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
          <div className="flex-1">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5 sm:mb-6"
            >
              <div className="h-px w-8 bg-spa-accent" />
              <p
                className="font-body text-spa-accent text-[10px] sm:text-xs uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-satisfy)" }}
              >
                healing treatments
              </p>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-spa-text leading-none"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 400 }}
            >
              Our
              <br />
              <em className="italic" style={{ color: "#6D8B74" }}>Treatments</em>
            </motion.h1>
          </div>

          {/* Right side — stats + description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="md:max-w-xs xl:max-w-sm"
          >
            <p className="font-body text-spa-muted text-sm sm:text-base leading-relaxed mb-5">
              Every treatment is an invitation to slow down, restore, and return to what truly matters.
            </p>
            <div className="flex flex-wrap gap-2">
              <StatPill icon={<Star className="w-3 h-3" />} label="4.9 Google Rating" />
              <StatPill icon={<span className="text-sm">🌿</span>} label="100% Organic" />
              <StatPill icon={<span className="text-sm">✨</span>} label="12 Treatments" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <div className="sticky top-[53px] sm:top-[61px] z-30 bg-[#f1f8f4]/90 backdrop-blur-xl
                      border-y border-mint-200/40 py-3 sm:py-4">
        <div className="container-spa">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {CATS.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileTap={{ scale: 0.96 }}
                className={`flex-shrink-0 flex items-center gap-2 font-body text-xs font-medium
                           px-4 py-2 rounded-xl border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-spa-text text-white border-spa-text shadow-soft-sm"
                    : "bg-white/70 border-mint-200 text-spa-muted hover:border-spa-text/30 hover:text-spa-text"
                }`}
              >
                {cat.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors ${
                    activeCategory === cat.id ? "bg-white/20 text-white/80" : "bg-mint-100 text-spa-accent"
                  }`}
                >
                  {cat.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-spa py-8 sm:py-12">

        {/* DESKTOP: Split-screen layout */}
        <div className="hidden lg:flex gap-0 rounded-[2rem] overflow-hidden border border-mint-200/40
                        shadow-soft-lg bg-white/40 min-h-[680px]">

          {/* Left: Sticky showcase panel (40%) */}
          <div className="w-[42%] xl:w-[40%] flex-shrink-0 sticky top-[113px] self-start
                          h-[calc(100vh-130px)] max-h-[780px]">
            <ShowcasePanel service={activeService} />
          </div>

          {/* Divider */}
          <div className="w-px bg-mint-200/60 flex-shrink-0" />

          {/* Right: Scrollable service list (60%) */}
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {/* List header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-4
                            border-b border-mint-100 flex items-center justify-between">
              <p className="font-body text-xs text-spa-muted/70">
                Hover or click a treatment to explore
              </p>
              <span className="font-body text-xs text-spa-accent font-medium">
                {filtered.length} treatments
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {filtered.map((service, i) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    index={i}
                    active={hoveredId === service.id}
                    onHover={() => setHoveredId(service.id)}
                    onClick={() => setHoveredId(service.id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Bottom padding */}
            <div className="h-8" />
          </div>
        </div>

        {/* MOBILE + TABLET: Accordion cards */}
        <div className="lg:hidden space-y-3 sm:space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3 sm:space-y-4"
            >
              {filtered.map((service, i) => (
                <MobileCard key={service.id} service={service} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── BENTO FEATURE CALLOUTS ── */}
      <section className="container-spa pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: "🌿",
              title: "100% Organic",
              desc: "All products used are certified organic and sourced from Australian botanicals.",
              bg: "bg-mint-100/80",
            },
            {
              icon: "🕐",
              title: "Flexible Timings",
              desc: "Monday to Sunday, early mornings and late evenings available.",
              bg: "bg-peach-100/70",
            },
            {
              icon: "🏆",
              title: "Award-Winning",
              desc: "Voted Melbourne's Best Spa Experience three years running.",
              bg: "bg-[#ede8f6]/70",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -4 }}
              className={`${item.bg} border border-white/60 rounded-3xl p-6 sm:p-7 shadow-soft`}
            >
              <span className="text-3xl block mb-3">{item.icon}</span>
              <h3
                className="font-heading text-spa-text mb-2"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem, 2vw, 1.3rem)" }}
              >
                {item.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-spa-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section className="pb-16 sm:pb-24 bg-gradient-to-b from-transparent to-mint-100/30">
        <div className="container-spa">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-spa-accent" />
              <p
                className="font-body text-spa-accent text-[10px] sm:text-xs uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-satisfy)" }}
              >
                simple pricing
              </p>
              <div className="h-px w-8 bg-spa-accent" />
            </div>
            <h2
              className="font-heading text-spa-text"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Choose Your Path
            </h2>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl sm:rounded-4xl border overflow-hidden
                            transition-all duration-500 shadow-soft hover:shadow-soft-lg
                            ${tier.featured
                              ? "border-spa-accent/0 shadow-green"
                              : "border-mint-200/50"
                            }`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-spa-green to-transparent" />
                )}

                <div
                  className={`p-7 sm:p-8 h-full flex flex-col
                              ${tier.featured ? "bg-spa-accent" : tier.color + " backdrop-blur-sm"}`}
                >
                  {tier.featured && (
                    <div className="inline-flex items-center gap-1.5 bg-white/20 border border-white/25
                                    rounded-full px-3 py-1 mb-5 self-start">
                      <Sparkles className="w-3 h-3 text-white/80" />
                      <span className="font-body text-[10px] text-white/80 uppercase tracking-widest">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3
                    className={`font-heading mb-1.5 ${tier.featured ? "text-white" : "text-spa-text"}`}
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)" }}
                  >
                    {tier.name}
                  </h3>
                  <p className={`font-body text-xs sm:text-sm leading-relaxed mb-5 ${tier.featured ? "text-white/70" : "text-spa-muted"}`}>
                    {tier.desc}
                  </p>

                  <div className="mb-6">
                    <span
                      className={`font-heading ${tier.featured ? "text-white" : "text-spa-accent"}`}
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem, 3vw, 2rem)" }}
                    >
                      {tier.price}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                                      ${tier.featured ? "bg-white/20 border border-white/30" : "bg-spa-accent/10 border border-spa-accent/20"}`}
                        >
                          <Check className={`w-2.5 h-2.5 ${tier.featured ? "text-white" : "text-spa-accent"}`} strokeWidth={3} />
                        </div>
                        <span className={`font-body text-xs sm:text-sm ${tier.featured ? "text-white/80" : "text-spa-muted"}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`inline-flex items-center justify-center gap-2 font-body font-medium
                                text-sm px-6 py-3.5 rounded-xl transition-all duration-300 group
                                ${tier.featured
                                  ? "bg-white text-spa-accent hover:bg-mint-100"
                                  : "bg-spa-accent text-white hover:bg-spa-text"
                                }`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
