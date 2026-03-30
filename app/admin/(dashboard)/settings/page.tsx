"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  User,
  Lock,
  Globe,
  Bell,
  Palette,
  Save,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { useAuthStore, useUIStore } from "@/lib/admin-store";
import { useToast } from "@/components/admin/AdminToast";
import { cn } from "@/lib/utils";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

interface PasswordForm {
  current: string;
  newPass: string;
  confirm: string;
}

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "system", label: "System", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const { adminUser } = useAuthStore();
  const adminEmail = adminUser?.email || "admin@wellness.com";
  const { darkMode, toggleDarkMode } = useUIStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [notifStates, setNotifStates] = useState({
    "New booking alerts": true,
    "Booking cancellations": true,
    "New user registrations": false,
    "Low inventory alerts": false,
    "Weekly summary email": true,
  } as Record<string, boolean>);

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      name: "Admin User",
      email: adminEmail,
      phone: "+61 400 000 001",
    },
  });

  const passwordForm = useForm<PasswordForm>();

  const onProfileSave = (data: ProfileForm) => {
    toast("Profile updated successfully", "success");
  };

  const onPasswordSave = (data: PasswordForm) => {
    if (data.newPass !== data.confirm) {
      toast("Passwords do not match", "error");
      return;
    }
    if (data.current !== "123456") {
      toast("Current password is incorrect", "error");
      return;
    }
    toast("Password updated successfully", "success");
    passwordForm.reset();
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-[#F8FBF9] dark:bg-gray-800 border border-[#A8CBB7]/30 rounded-xl focus:outline-none focus:border-[#A8CBB7] font-body text-[#1F2A2E] dark:text-white transition-colors";
  const labelClass =
    "block text-xs font-body font-medium text-[#6D8B74] uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl text-[#1F2A2E] dark:text-white">
          Settings
        </h1>
        <p className="font-body text-sm text-[#6D8B74] mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-gray-900 rounded-xl border border-[#A8CBB7]/20 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium rounded-lg transition-all duration-150",
              activeTab === id
                ? "bg-[#6D8B74] text-white"
                : "text-[#6D8B74] hover:text-[#1F2A2E]"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 p-6"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#A8CBB7]/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A8CBB7] to-[#6D8B74] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white">
                Admin User
              </h3>
              <p className="text-sm font-body text-[#6D8B74]">{adminEmail}</p>
              <span className="text-xs font-body text-[#6D8B74] bg-[#A8CBB7]/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                Administrator
              </span>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                {...profileForm.register("name", { required: true })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                {...profileForm.register("email", { required: true })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                {...profileForm.register("phone")}
                className={inputClass}
                placeholder="+61 400 000 000"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6D8B74] hover:bg-[#5a7561] text-white text-sm font-body font-medium rounded-xl transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 p-6"
        >
          <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white mb-5">
            Change Password
          </h3>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSave)} className="space-y-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  {...passwordForm.register("current", { required: true })}
                  className={cn(inputClass, "pr-10")}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D8B74]"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  {...passwordForm.register("newPass", { required: true, minLength: 6 })}
                  className={cn(inputClass, "pr-10")}
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D8B74]"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                {...passwordForm.register("confirm", { required: true })}
                className={inputClass}
                placeholder="••••••"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6D8B74] hover:bg-[#5a7561] text-white text-sm font-body font-medium rounded-xl transition-colors"
              >
                <Lock className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 p-6">
            <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white mb-4">
              Appearance
            </h3>
            <div className="flex items-center justify-between py-3 border-b border-[#A8CBB7]/20 last:border-0">
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-[#6D8B74]" />
                <div>
                  <p className="text-sm font-body font-medium text-[#1F2A2E] dark:text-white">
                    Dark Mode
                  </p>
                  <p className="text-xs font-body text-[#6D8B74]">
                    Switch between light and dark theme
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors duration-200",
                  darkMode ? "bg-[#6D8B74]" : "bg-gray-200"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                    darkMode && "translate-x-5"
                  )}
                />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 p-6">
            <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white mb-4">
              Business Info
            </h3>
            <div className="space-y-4">
              {[
                { label: "Business Name", value: "Serenity Wellness Spa" },
                { label: "Location", value: "123 Wellness Lane, South Yarra, Melbourne VIC 3141" },
                { label: "Phone", value: "+61 3 9000 1234" },
                { label: "Email", value: "hello@serenityspa.com.au" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className={labelClass}>{label}</label>
                  <input defaultValue={value} className={inputClass} />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={() => toast("Business settings saved", "success")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#6D8B74] hover:bg-[#5a7561] text-white text-sm font-body font-medium rounded-xl transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 p-6"
        >
          <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { label: "New booking alerts", desc: "Notify when a new booking is made" },
              { label: "Booking cancellations", desc: "Notify when a booking is cancelled" },
              { label: "New user registrations", desc: "Notify when someone creates an account" },
              { label: "Low inventory alerts", desc: "Notify when service supplies are low" },
              { label: "Weekly summary email", desc: "Receive weekly performance report" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3 border-b border-[#A8CBB7]/10 last:border-0"
              >
                <div>
                  <p className="text-sm font-body font-medium text-[#1F2A2E] dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-xs font-body text-[#6D8B74] mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => {
                    const next = !notifStates[item.label];
                    setNotifStates((prev) => ({ ...prev, [item.label]: next }));
                    toast(`${item.label} ${next ? "enabled" : "disabled"}`, "info");
                  }}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
                    notifStates[item.label] ? "bg-[#6D8B74]" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
                      notifStates[item.label] && "translate-x-5"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
