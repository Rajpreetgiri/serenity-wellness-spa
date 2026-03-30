import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TherapistsSection from "@/components/sections/TherapistsSection";
import { Leaf, Heart, Star, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story | Serenity Wellness Spa",
  description:
    "Learn about Serenity Wellness Spa — born from a vision to create Melbourne's most healing and nurturing wellness sanctuary.",
};

const values = [
  {
    icon: "🌿",
    title: "Natural Integrity",
    description: "Every product we use is certified organic, sustainably sourced, and kind to the planet.",
  },
  {
    icon: "🤍",
    title: "Genuine Care",
    description: "We listen. Your wellbeing drives every decision — from how we design our space to how we train our team.",
  },
  {
    icon: "✨",
    title: "Artful Healing",
    description: "Our therapists blend clinical expertise with intuitive artistry to create something truly transformative.",
  },
  {
    icon: "🌸",
    title: "Inclusive Sanctuary",
    description: "Serenity is a place for everyone — all ages, all bodies, all backgrounds. You belong here.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-spa-bg to-mint-50 pt-20 sm:pt-24">
      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="container-spa grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Text */}
          <ScrollReveal direction="left">
            <p
              className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4 sm:mb-5"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              our story
            </p>
            <h1
              className="font-heading text-spa-text mb-5 sm:mb-7 leading-tight"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
              }}
            >
              Born from a
              <br />
              <em className="italic text-spa-accent">Need for Stillness</em>
            </h1>
            <p className="font-body text-spa-muted leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base lg:text-lg">
              Serenity was born in 2018 from a simple but urgent question: where can we truly rest in a city that never stops?
            </p>
            <p className="font-body text-spa-muted leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
              Our founder, Dr. Amara Wells, spent a decade as a clinical psychologist before realising that the body holds what the mind cannot express. She gathered a small team of gifted healers and opened our doors in South Yarra — with one promise: to create a space where every single person leaves lighter.
            </p>
            <p className="font-body text-spa-muted leading-relaxed mb-8 sm:mb-10 text-sm sm:text-base">
              Today, Serenity is home to eight dedicated therapists, a thoughtfully designed sanctuary, and a community of over 2,400 guests who return because this place genuinely changes how they feel.
            </p>
            <Link href="/booking" className="btn-primary inline-block">
              Experience it yourself
            </Link>
          </ScrollReveal>

          {/* Image */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative mt-6 lg:mt-0">
              <div className="relative h-[280px] xs:h-[340px] sm:h-[440px] lg:h-[550px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-soft-lg">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                  alt="Serenity Spa Interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spa-bg/20 to-transparent" />
              </div>

              {/* Floating stat */}
              <div className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-6 bg-white/90 backdrop-blur-sm
                              border border-mint-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-soft max-w-[160px] sm:max-w-none">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-spa-accent rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
                  </div>
                  <div>
                    <p
                      className="font-heading text-spa-text leading-none"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}
                    >
                      2,400+
                    </p>
                    <p className="font-body text-[10px] sm:text-xs text-spa-muted">Guests healed</p>
                  </div>
                </div>
              </div>

              {/* Floating star */}
              <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-4 bg-white/90 backdrop-blur-sm
                              border border-mint-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-soft">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                  <span
                    className="font-heading text-spa-text"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.2rem, 3vw, 1.5rem)" }}
                  >
                    4.9
                  </span>
                </div>
                <p className="font-body text-[10px] sm:text-xs text-spa-muted mt-0.5">Google rating</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Founder's message */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-spa-text to-[#2d3f35]" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1400&q=60"
            alt=""
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="container-spa max-w-4xl relative z-10">
          <ScrollReveal className="text-center">
            <p
              className="text-spa-green text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4 sm:mb-6 font-body"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              founder&apos;s note
            </p>
            <blockquote
              className="text-white leading-relaxed mb-6 sm:mb-8 italic"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.1rem, 3.5vw, 2.2rem)",
                fontWeight: 300,
              }}
            >
              &ldquo;I built Serenity because I had been broken by burnout and rebuilt through touch. Every time a client closes their eyes and sighs — that first deep exhale — I remember why this work matters. Healing isn&apos;t a luxury. It&apos;s how we survive.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-spa-green/40 flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80"
                  alt="Dr. Amara Wells"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="text-left">
                <p
                  className="text-white"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)" }}
                >
                  Dr. Amara Wells
                </p>
                <p className="font-body text-white/50 text-xs">Founder & Wellness Director</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20">
        <div className="container-spa">
          <ScrollReveal className="text-center mb-10 sm:mb-14">
            <h2
              className="font-heading text-spa-text mb-4"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              What We Stand For
            </h2>
            <p className="font-body text-spa-muted text-sm sm:text-base max-w-xs sm:max-w-lg mx-auto">
              These principles guide every decision, every treatment, every interaction at Serenity.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="bg-white/60 border border-mint-200/40 rounded-3xl p-5 sm:p-7 shadow-soft
                                hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 h-full">
                  <span className="text-3xl sm:text-4xl block mb-3 sm:mb-4">{v.icon}</span>
                  <h3
                    className="font-heading text-spa-text mb-2.5 sm:mb-3"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-spa-muted leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-16 bg-mint-100/50">
        <div className="container-spa">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {[
              { value: "2018", label: "Year founded", icon: <Leaf className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: "8", label: "Expert therapists", icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: "12", label: "Treatments", icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: "399+", label: "Five-star reviews", icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" /> },
            ].map(({ value, label, icon }, i) => (
              <ScrollReveal key={label} delay={i * 0.08}>
                <div className="text-center bg-white/60 border border-mint-200/40 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-soft">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-spa-accent/10 rounded-lg sm:rounded-xl flex items-center
                                  justify-center text-spa-accent mx-auto mb-3 sm:mb-4">
                    {icon}
                  </div>
                  <p
                    className="font-heading text-spa-text mb-1"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    }}
                  >
                    {value}
                  </p>
                  <p className="font-body text-[9px] sm:text-xs text-spa-muted uppercase tracking-wide">{label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <div id="team">
        <TherapistsSection />
      </div>
    </div>
  );
}
