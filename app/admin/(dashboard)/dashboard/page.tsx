"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, DollarSign, TrendingUp, ArrowRight, Clock, Loader2 } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { adminApi, AdminDashboard } from "@/lib/api-client";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { format } from "date-fns";

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getDashboard()
      .then(setStats)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[#6D8B74]" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="font-body text-[#6D8B74] mb-1">
            {error || "Failed to load dashboard"}
          </p>
          <p className="font-body text-xs text-[#6D8B74]/60 mb-3">
            Make sure MongoDB is running and DB is seeded (/api/admin/seed)
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#6D8B74] text-white text-sm font-body rounded-xl hover:bg-[#5a7561] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="font-heading text-2xl sm:text-3xl text-[#1F2A2E] dark:text-white">
          Good morning, Admin
        </motion.h1>
        <p className="font-body text-sm text-[#6D8B74] mt-1">
          {format(new Date(), "EEEE, MMMM d, yyyy")} · Here&apos;s what&apos;s happening today
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value={stats.totalBookings} change="All time" changeType="neutral" icon={Calendar} color="green" index={0} />
        <StatCard title="Today's Bookings" value={stats.todayBookings} change={`${stats.pendingBookings} pending`} changeType="neutral" icon={Clock} color="peach" index={1} />
        <StatCard title="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change="Confirmed & completed" changeType="up" icon={DollarSign} color="blue" index={2} />
        <StatCard title="Active Users" value={stats.activeUsers} change={`${stats.totalUsers} registered`} changeType="up" icon={Users} color="purple" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-[#A8CBB7]/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white">Booking Trend</h3>
              <p className="text-xs font-body text-[#6D8B74]">Last 6 months</p>
            </div>
            <TrendingUp className="w-4 h-4 text-[#6D8B74]" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.monthlyTrend}>
              <defs>
                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A8CBB7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A8CBB7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#A8CBB7" strokeOpacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6D8B74", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6D8B74", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #A8CBB7", borderRadius: "12px", fontSize: 12, fontFamily: "Manrope" }} />
              <Area type="monotone" dataKey="bookings" stroke="#6D8B74" strokeWidth={2} fill="url(#bookGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-[#A8CBB7]/30">
          <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white mb-1">Revenue</h3>
          <p className="text-xs font-body text-[#6D8B74] mb-4">Monthly AUD $</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.monthlyTrend} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A8CBB7" strokeOpacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6D8B74" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#6D8B74" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #A8CBB7", borderRadius: "12px", fontSize: 12 }} formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#A8CBB7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 overflow-hidden">
        <div className="p-5 border-b border-[#A8CBB7]/20 flex items-center justify-between">
          <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white">Recent Bookings</h3>
          <Link href="/admin/bookings" className="flex items-center gap-1 text-xs font-body text-[#6D8B74] hover:text-[#1F2A2E] transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {stats.recentBookings.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="w-8 h-8 text-[#A8CBB7] mx-auto mb-2" />
            <p className="font-body text-sm text-[#6D8B74]">No bookings yet. Seed the DB first.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#A8CBB7]/10">
            {stats.recentBookings.map((b) => {
              const user = typeof b.userId === "object" && b.userId !== null ? b.userId as { name: string } : null;
              const name = user?.name || "Unknown";
              return (
                <div key={b._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F8FBF9] dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8CBB7] to-[#6D8B74] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-[#1F2A2E] dark:text-white truncate">{name}</p>
                    <p className="text-xs font-body text-[#6D8B74] truncate">{b.serviceName} · {b.date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={b.status} />
                    <span className="text-sm font-body font-semibold text-[#1F2A2E] dark:text-white hidden sm:block">${b.servicePrice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
