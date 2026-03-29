"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTASection() {
  return (
    <section className="section-padding bg-spa-bg relative overflow-hidden">
      <div className="container-spa">
        <ScrollReveal>
          <div className="relative rounded-[2.5rem] overflow-hidden min-h-[500px] flex items-center">
            {/* Background */}
            <Image
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1400&q=80"
              alt="Wellness retreat"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-spa-text/90 via-spa-text/70 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-12 md:p-20 max-w-xl">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-spa-accent/20 border border-spa-accent/30 rounded-xl flex items-center justify-center mb-8"
              >
                <Leaf className="w-6 h-6 text-spa-green" strokeWidth={1.5} />
              </motion.div>

              <p
                className="text-spa-green text-sm font-body tracking-[0.2em] uppercase mb-4"
                style={{ fontFamily: "var(--font-satisfy)" }}
              >
                gift of wellness
              </p>

              <h2
                className="text-white leading-tight mb-6"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                }}
              >
                Ready to Begin
                <br />
                <em className="italic text-spa-green">Your Transformation?</em>
              </h2>

              <p className="font-body text-white/65 mb-10 leading-relaxed text-lg">
                Your first step toward calm is just one click away. Gift yourself the space to heal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 bg-white text-spa-text font-body font-medium px-8 py-4 rounded-2xl hover:bg-spa-green hover:text-white transition-all duration-300 text-sm tracking-wide group"
                  >
                    Book a Session
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/contact"
                    className="inline-block bg-transparent border border-white/30 text-white font-body font-medium px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 text-sm tracking-wide"
                  >
                    Gift a Voucher
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Right side float */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
              {[
                { label: "Free tea on arrival", icon: "🍵" },
                { label: "Complimentary robe", icon: "🩱" },
                { label: "Organic products only", icon: "🌿" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 mb-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-body text-sm text-white/85">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
