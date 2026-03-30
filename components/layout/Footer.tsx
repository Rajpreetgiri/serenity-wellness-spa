import Link from "next/link";
import { Leaf, Instagram, Facebook, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-spa-text text-white/80">
      {/* Main Footer */}
      <div className="container-spa py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-spa-accent rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p
                  className="text-lg sm:text-xl font-semibold text-white leading-none"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Serenity
                </p>
                <p className="text-[9px] sm:text-[10px] text-white/50 tracking-[0.15em] uppercase font-body">
                  Wellness Spa
                </p>
              </div>
            </div>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-5 max-w-xs">
              A sanctuary of calm in the heart of Melbourne. Where modern life pauses and healing begins.
            </p>
            <div className="flex gap-2.5">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center
                             hover:bg-spa-accent transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-white text-lg mb-4"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Treatments
            </h4>
            <ul className="space-y-2.5 font-body text-sm">
              {[
                "Swedish Massage",
                "Deep Tissue",
                "Hot Stone",
                "Aromatherapy",
                "Prenatal Care",
                "Healing Facial",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-white/60 hover:text-spa-green transition-colors duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white text-lg mb-4"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5 font-body text-sm">
              {[
                { label: "Our Story", href: "/about" },
                { label: "Meet the Team", href: "/about#team" },
                { label: "Book a Session", href: "/booking" },
                { label: "Gift Vouchers", href: "/contact" },
                { label: "Membership", href: "/contact" },
                { label: "Contact Us", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-spa-green transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-white text-lg mb-4"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Visit Us
            </h4>
            <div className="space-y-3.5 font-body text-sm">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-spa-green mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="text-white/60">
                  <p>42 Chapel Street</p>
                  <p>South Yarra, VIC 3141</p>
                  <p>Melbourne, Australia</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-spa-green flex-shrink-0" strokeWidth={1.5} />
                <a
                  href="tel:+61398765432"
                  className="text-white/60 hover:text-spa-green transition-colors"
                >
                  +61 3 9876 5432
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-spa-green flex-shrink-0" strokeWidth={1.5} />
                <a
                  href="mailto:hello@serenityspa.com.au"
                  className="text-white/60 hover:text-spa-green transition-colors break-all"
                >
                  hello@serenityspa.com.au
                </a>
              </div>
              <div className="mt-3 pt-3.5 border-t border-white/10">
                <p className="text-white/40 text-xs mb-1">Opening Hours</p>
                <p className="text-white/60">Mon–Fri: 9am – 8pm</p>
                <p className="text-white/60">Sat–Sun: 8am – 7pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-spa py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-center gap-3 font-body text-xs text-white/40">
          <p className="text-center sm:text-left">© 2026 Serenity Wellness Spa. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-peach-200 fill-peach-200" />
            <span>in Melbourne</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
