"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || !isHome
            ? "bg-white/80 backdrop-blur-xl shadow-soft-sm border-b border-mint-200/40 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container-spa flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-9 h-9 bg-spa-accent rounded-2xl flex items-center justify-center shadow-green"
            >
              <Leaf className="w-5 h-5 text-white" strokeWidth={1.5} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className="font-heading text-xl font-semibold text-spa-text tracking-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Serenity
              </span>
              <span className="font-body text-[10px] text-spa-muted tracking-[0.15em] uppercase">
                Wellness Spa
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-sm font-medium transition-all duration-200 relative group",
                  pathname === link.href
                    ? "text-spa-accent"
                    : "text-spa-text/70 hover:text-spa-accent"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[1.5px] bg-spa-accent transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="font-body text-sm text-spa-muted hover:text-spa-accent transition-colors"
                >
                  {user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={logout}
                  className="font-body text-sm text-spa-muted hover:text-spa-text transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-body text-sm text-spa-muted hover:text-spa-accent transition-colors"
              >
                Sign in
              </Link>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/booking" className="btn-primary text-sm px-6 py-2.5">
                Book Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-white/60 border border-mint-200/40 text-spa-text"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[65px] z-40 bg-white/95 backdrop-blur-xl border-b border-mint-200/40 shadow-soft md:hidden"
          >
            <div className="container-spa py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-body text-base py-2 border-b border-mint-100 transition-colors",
                    pathname === link.href
                      ? "text-spa-accent font-medium"
                      : "text-spa-text/70"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="btn-secondary text-sm px-5 py-2.5 flex-1"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link href="/login" className="btn-secondary text-sm px-5 py-2.5 flex-1 text-center">
                    Sign in
                  </Link>
                )}
                <Link href="/booking" className="btn-primary text-sm px-5 py-2.5 flex-1 text-center">
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
