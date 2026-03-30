import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Privacy Policy | Serenity Wellness Spa",
};

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly, such as your name, email address, phone number, and booking preferences. We also collect technical data like browser type and pages visited to improve your experience.",
  },
  {
    title: "How We Use Your Information",
    content: "Your information is used to manage bookings, send appointment reminders, process payments, and personalise your wellness experience. We never sell your personal data to third parties.",
  },
  {
    title: "Data Security",
    content: "We implement industry-standard encryption and security measures to protect your personal information. Your data is stored on secure servers in Australia, compliant with the Privacy Act 1988.",
  },
  {
    title: "Cookies",
    content: "Our website uses cookies to improve functionality and analyse traffic. You may disable cookies in your browser settings, though some features may not function correctly.",
  },
  {
    title: "Your Rights",
    content: "Under Australian privacy law, you have the right to access, correct, or request deletion of your personal data. Contact us at privacy@serenityspa.com.au for any such requests.",
  },
  {
    title: "Contact",
    content: "For any privacy concerns, please contact our Privacy Officer at privacy@serenityspa.com.au or write to us at 42 Chapel Street, South Yarra, VIC 3141.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-spa-bg to-mint-50 pt-20 sm:pt-24 sm:pt-28 pb-16 sm:pb-20">
      <div className="container-spa max-w-3xl">
        <ScrollReveal className="mb-8 sm:mb-12">
          <p
            className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4"
            style={{ fontFamily: "var(--font-satisfy)" }}
          >
            legal
          </p>
          <h1
            className="font-heading text-spa-text mb-3 sm:mb-4"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 6vw, 4rem)",
            }}
          >
            Privacy Policy
          </h1>
          <p className="font-body text-spa-muted text-sm">Last updated: 1 March 2026</p>
        </ScrollReveal>

        <div className="space-y-4 sm:space-y-8">
          {sections.map((section, i) => (
            <ScrollReveal key={section.title} delay={i * 0.04}>
              <div className="bg-white/60 border border-mint-200/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-soft">
                <h2
                  className="font-heading text-spa-text mb-3 sm:mb-4"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                  }}
                >
                  {section.title}
                </h2>
                <p className="font-body text-xs sm:text-sm text-spa-muted leading-relaxed">{section.content}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
