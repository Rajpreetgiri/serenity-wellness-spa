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

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
            ? "bg-white/80 backdrop-blur-xl shadow-soft-sm border-b border-mint-200/40 py-2.5 sm:py-3"
            : "bg-transparent py-4 sm:py-5"
        )}
      >
        <div className="container-spa flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-spa-accent rounded-xl sm:rounded-2xl flex items-center justify-center shadow-green"
            >
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={1.5} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span
                className="font-heading text-lg sm:text-xl font-semibold text-spa-text tracking-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Serenity
              </span>
              <span className="font-body text-[9px] sm:text-[10px] text-spa-muted tracking-[0.15em] uppercase hidden xs:block">
                Wellness Spa
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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

          {/* Desktop Actions */}
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
              <Link
                href="/booking"
                className="bg-spa-accent text-white px-5 py-2 rounded-xl font-body text-sm font-medium
                           transition-all duration-300 hover:bg-spa-text hover:shadow-green active:scale-95"
              >
                Book Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile: Book + Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/booking"
              className="bg-spa-accent text-white px-3.5 py-2 rounded-xl font-body text-xs font-medium
                         transition-all duration-300 hover:bg-spa-text active:scale-95"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-white/60 border border-mint-200/40 text-spa-text
                         min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-spa-text/20 backdrop-blur-sm md:hidden"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-x-0 top-[57px] sm:top-[65px] z-40 bg-white/97 backdrop-blur-xl
                         border-b border-mint-200/40 shadow-soft md:hidden max-h-[calc(100vh-57px)]
                         overflow-y-auto"
            >
              <div className="container-spa py-5 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "font-body text-base py-3 px-2 border-b border-mint-100 transition-colors rounded-xl",
                      pathname === link.href
                        ? "text-spa-accent font-medium"
                        : "text-spa-text/70"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex gap-2.5 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex-1 text-center bg-mint-100 text-spa-accent font-body text-sm
                                   font-medium px-4 py-3 rounded-xl transition-colors hover:bg-mint-200"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="flex-1 text-center border border-spa-accent text-spa-accent font-body
                                   text-sm font-medium px-4 py-3 rounded-xl transition-all
                                   hover:bg-spa-accent hover:text-white"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex-1 text-center border border-spa-accent text-spa-accent font-body
                                   text-sm font-medium px-4 py-3 rounded-xl transition-all
                                   hover:bg-spa-accent hover:text-white"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/signup"
                        className="flex-1 text-center bg-mint-100 text-spa-text font-body text-sm
                                   font-medium px-4 py-3 rounded-xl transition-colors hover:bg-mint-200"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
