import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spa-bg via-mint-50 to-peach-100/10
                    flex items-center justify-center px-4">
      <div className="text-center max-w-lg px-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-spa-accent/10 rounded-2xl sm:rounded-3xl
                        flex items-center justify-center mx-auto mb-6 sm:mb-8">
          <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-spa-accent" strokeWidth={1.5} />
        </div>
        <p
          className="font-body text-spa-accent text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4"
          style={{ fontFamily: "var(--font-satisfy)" }}
        >
          page not found
        </p>
        <h1
          className="font-heading text-spa-text mb-4 sm:mb-5"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
        >
          Lost in{" "}
          <em className="italic text-spa-accent">Stillness?</em>
        </h1>
        <p className="font-body text-spa-muted mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-none mx-auto">
          This page seems to have drifted away — much like stress after a session. Let&apos;s guide you back.
        </p>
        <div className="flex flex-col xs:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return home
          </Link>
          <Link href="/booking" className="btn-secondary inline-block text-center">
            Book a session
          </Link>
        </div>
      </div>
    </div>
  );
}
