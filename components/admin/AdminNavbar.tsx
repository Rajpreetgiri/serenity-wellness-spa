"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  ChevronDown,
  Check,
} from "lucide-react";
import { useUIStore, useAuthStore } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminNavbar() {
  const router = useRouter();
  const { toggleSidebar, darkMode, toggleDarkMode, notifications, dismissNotification } =
    useUIStore();
  const { logout, adminUser } = useAuthStore();
  const adminEmail = adminUser?.email || "";
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    // Clear auth cookie
    document.cookie = "admin-auth=; max-age=0; path=/";
    router.push("/admin/login");
  };

  const notifColors = {
    info: "bg-blue-100 text-blue-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
    error: "bg-red-100 text-red-600",
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-[#A8CBB7]/20 flex items-center px-4 gap-4 sticky top-0 z-10">
      {/* Menu toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-[#A8CBB7]/10 text-[#6D8B74] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D8B74]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings, clients..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F8FBF9] dark:bg-gray-800 border border-[#A8CBB7]/30 rounded-xl focus:outline-none focus:border-[#A8CBB7] transition-colors font-body text-[#1F2A2E] dark:text-white placeholder:text-[#6D8B74]/40"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-[#A8CBB7]/10 text-[#6D8B74] transition-colors"
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg hover:bg-[#A8CBB7]/10 text-[#6D8B74] transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F6C1A6] rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#A8CBB7]/20 overflow-hidden"
              >
                <div className="p-4 border-b border-[#A8CBB7]/20 flex items-center justify-between">
                  <p className="font-body font-semibold text-sm text-[#1F2A2E] dark:text-white">
                    Notifications
                  </p>
                  {unread > 0 && (
                    <span className="text-xs bg-[#F6C1A6] text-[#1F2A2E] px-2 py-0.5 rounded-full font-medium">
                      {unread} new
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 border-b border-[#A8CBB7]/10 last:border-0 hover:bg-[#F8FBF9] dark:hover:bg-gray-800 transition-colors",
                        !n.read && "bg-[#F8FBF9]/80 dark:bg-gray-800/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full mt-1.5 shrink-0",
                            n.type === "info" && "bg-blue-400",
                            n.type === "success" && "bg-green-400",
                            n.type === "warning" && "bg-amber-400",
                            n.type === "error" && "bg-red-400"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#1F2A2E] dark:text-white">
                            {n.title}
                          </p>
                          <p className="text-xs text-[#6D8B74] mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="shrink-0 p-1 hover:bg-[#A8CBB7]/20 rounded-full transition-colors"
                          >
                            <Check className="w-3 h-3 text-[#6D8B74]" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-[#A8CBB7]/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A8CBB7] to-[#6D8B74] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#1F2A2E] dark:text-white font-body">
                Admin
              </p>
              <p className="text-[10px] text-[#6D8B74]">{adminEmail}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#6D8B74]" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#A8CBB7]/20 overflow-hidden"
              >
                <div className="p-3 border-b border-[#A8CBB7]/20">
                  <p className="text-xs font-semibold text-[#1F2A2E] dark:text-white">
                    Admin User
                  </p>
                  <p className="text-[11px] text-[#6D8B74] truncate">{adminEmail}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      router.push("/admin/settings");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#1F2A2E] dark:text-white hover:bg-[#A8CBB7]/10 rounded-lg transition-colors font-body"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-body"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}
