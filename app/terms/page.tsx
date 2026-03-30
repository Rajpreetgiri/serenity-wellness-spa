import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Terms & Conditions | Serenity Wellness Spa",
};

const sections = [
  {
    title: "Bookings & Cancellations",
    content: "Appointments can be cancelled or rescheduled up to 24 hours in advance at no charge. Cancellations within 24 hours of your appointment will incur a 50% cancellation fee. No-shows are charged in full.",
  },
  {
    title: "Health & Safety",
    content: "Please inform your therapist of any medical conditions, allergies, or medications prior to treatment. We reserve the right to decline or modify treatment if we believe it may be harmful to your health.",
  },
  {
    title: "Gift Vouchers",
    content: "Gift vouchers are valid for 12 months from date of purchase and cannot be exchanged for cash. Lost or stolen vouchers cannot be replaced. Vouchers cannot be used in conjunction with other offers.",
  },
  {
    title: "Membership Terms",
    content: "Memberships are billed monthly and can be cancelled with 30 days written notice. Membership benefits cannot be shared or transferred. Unused sessions do not roll over beyond 60 days.",
  },
  {
    title: "Liability",
    content: "Serenity Wellness Spa takes all reasonable care to ensure the safety and comfort of our guests. We are not liable for loss or damage to personal property. Guests participate in treatments at their own risk.",
  },
  {
    title: "Governing Law",
    content: "These terms are governed by the laws of Victoria, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of Victoria.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-spa-bg to-mint-50 pt-20 sm:pt-28 pb-16 sm:pb-20">
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
            Terms & Conditions
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
