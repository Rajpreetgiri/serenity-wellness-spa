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
    <div className="min-h-screen bg-gradient-to-b from-spa-bg to-mint-50 pt-24">
      {/* Hero */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="container-spa grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <p
              className="font-body text-spa-accent text-xs tracking-[0.3em] uppercase mb-5"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              our story
            </p>
            <h1
              className="font-heading text-spa-text mb-7 leading-tight"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(3rem, 5vw, 4.5rem)",
              }}
            >
              Born from a
              <br />
              <em className="italic text-spa-accent">Need for Stillness</em>
            </h1>
            <p className="font-body text-spa-muted leading-relaxed mb-6 text-lg">
              Serenity was born in 2018 from a simple but urgent question: where can we truly rest in a city that never stops?
            </p>
            <p className="font-body text-spa-muted leading-relaxed mb-6">
              Our founder, Dr. Amara Wells, spent a decade as a clinical psychologist before realising that the body holds what the mind cannot express. She gathered a small team of gifted healers and opened our doors in South Yarra — with one promise: to create a space where every single person leaves lighter.
            </p>
            <p className="font-body text-spa-muted leading-relaxed mb-10">
              Today, Serenity is home to eight dedicated therapists, a thoughtfully designed sanctuary, and a community of over 2,400 guests who return because this place genuinely changes how they feel.
            </p>
            <Link href="/booking" className="btn-primary inline-block">
              Experience it yourself
            </Link>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative">
              <div className="relative h-[550px] rounded-[2rem] overflow-hidden shadow-soft-lg">
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
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm border border-mint-200 rounded-2xl p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-spa-accent rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <p
                      className="font-heading text-spa-text text-2xl leading-none"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      2,400+
                    </p>
                    <p className="font-body text-xs text-spa-muted">Guests healed</p>
                  </div>
                </div>
              </div>

              {/* Floating star */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm border border-mint-200 rounded-2xl p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span
                    className="font-heading text-spa-text text-2xl"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    4.9
                  </span>
                </div>
                <p className="font-body text-xs text-spa-muted mt-0.5">Google rating</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Founder's message */}
      <section className="py-20 px-4 bg-gradient-to-br from-spa-text to-[#2d3f35] relative overflow-hidden">
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
              className="text-spa-green text-xs tracking-[0.3em] uppercase mb-6 font-body"
              style={{ fontFamily: "var(--font-satisfy)" }}
            >
              founder&apos;s note
            </p>
            <blockquote
              className="text-white leading-relaxed mb-8"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              &ldquo;I built Serenity because I had been broken by burnout and rebuilt through touch. Every time a client closes their eyes and sighs — that first deep exhale — I remember why this work matters. Healing isn&apos;t a luxury. It&apos;s how we survive.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-spa-green/40">
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
                  className="text-white text-xl"
                  style={{ fontFamily: "var(--font-cormorant)" }}
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
      <section className="py-20 px-4">
        <div className="container-spa">
          <ScrollReveal className="text-center mb-14">
            <h2
              className="font-heading text-spa-text mb-4"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              }}
            >
              What We Stand For
            </h2>
            <p className="font-body text-spa-muted max-w-lg mx-auto">
              These principles guide every decision, every treatment, every interaction at Serenity.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="bg-white/60 border border-mint-200/40 rounded-3xl p-7 shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 h-full">
                  <span className="text-4xl block mb-4">{v.icon}</span>
                  <h3
                    className="font-heading text-spa-text text-xl mb-3"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="font-body text-sm text-spa-muted leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-mint-100/50">
        <div className="container-spa">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2018", label: "Year founded", icon: <Leaf className="w-5 h-5" /> },
              { value: "8", label: "Expert therapists", icon: <Heart className="w-5 h-5" /> },
              { value: "12", label: "Healing treatments", icon: <Star className="w-5 h-5" /> },
              { value: "399+", label: "Five-star reviews", icon: <Award className="w-5 h-5" /> },
            ].map(({ value, label, icon }, i) => (
              <ScrollReveal key={label} delay={i * 0.1}>
                <div className="text-center bg-white/60 border border-mint-200/40 rounded-3xl p-7 shadow-soft">
                  <div className="w-10 h-10 bg-spa-accent/10 rounded-xl flex items-center justify-center text-spa-accent mx-auto mb-4">
                    {icon}
                  </div>
                  <p
                    className="font-heading text-spa-text mb-1"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "2.5rem",
                    }}
                  >
                    {value}
                  </p>
                  <p className="font-body text-xs text-spa-muted uppercase tracking-wide">{label}</p>
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
