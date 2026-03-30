"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  FileText,
  Settings,
  ChevronLeft,
  Leaf,
  X,
} from "lucide-react";
import { useUIStore } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebar } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 h-full z-30 flex flex-col",
          "bg-white dark:bg-gray-900 border-r border-[#A8CBB7]/30",
          "shadow-[2px_0_20px_rgba(168,203,183,0.15)]",
          // Mobile: always full-width when open, hidden when closed
          "transition-transform lg:translate-x-0",
          !sidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[#A8CBB7]/20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A8CBB7] to-[#6D8B74] flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <p className="font-heading text-[15px] font-semibold text-[#1F2A2E] dark:text-white whitespace-nowrap leading-tight">
                    Serenity
                  </p>
                  <p className="text-[10px] text-[#6D8B74] uppercase tracking-widest whitespace-nowrap">
                    Admin Panel
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Close button - mobile */}
          <button
            onClick={() => setSidebar(false)}
            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-[#A8CBB7]/10"
          >
            <X className="w-4 h-4 text-[#6D8B74]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebar(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    active
                      ? "bg-[#A8CBB7]/20 text-[#6D8B74]"
                      : "text-[#1F2A2E]/60 dark:text-gray-400 hover:bg-[#A8CBB7]/10 hover:text-[#6D8B74]"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-[#A8CBB7]/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0 relative z-10",
                      active ? "text-[#6D8B74]" : "group-hover:text-[#6D8B74]"
                    )}
                  />
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "text-sm font-body font-medium whitespace-nowrap relative z-10",
                          active ? "text-[#6D8B74]" : ""
                        )}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip when collapsed */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#1F2A2E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse toggle - desktop only */}
        <div className="hidden lg:flex p-3 border-t border-[#A8CBB7]/20">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full py-2 rounded-xl text-[#6D8B74] hover:bg-[#A8CBB7]/10 transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-2 text-xs font-body"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
