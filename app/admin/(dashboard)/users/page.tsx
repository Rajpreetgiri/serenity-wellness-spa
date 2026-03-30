"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, X, Mail, Phone, Calendar, DollarSign, Shield, Loader2 } from "lucide-react";
import { useUsersStore } from "@/lib/admin-store";
import { UserData } from "@/lib/api-client";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/AdminToast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function UsersPage() {
  const { users, loading, fetch, updateUser } = useUsersStore();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    let result = [...users];
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u._id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, search, roleFilter]);

  const handleToggleStatus = async (user: UserData) => {
    await updateUser(user._id, { isActive: !user.isActive });
    toast(`${user.name} is now ${!user.isActive ? "active" : "inactive"}`, "success");
    if (selectedUser?._id === user._id) setSelectedUser(null);
  };

  const handleRoleChange = async (user: UserData, role: "user" | "admin") => {
    await updateUser(user._id, { role });
    toast(`${user.name}'s role updated to ${role}`, "success");
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl text-[#1F2A2E] dark:text-white">Users</h1>
        <p className="font-body text-sm text-[#6D8B74] mt-0.5">
          {users.length} registered · {users.filter((u) => u.isActive).length} active
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D8B74]/50" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-[#A8CBB7]/30 rounded-xl focus:outline-none focus:border-[#A8CBB7] font-body text-[#1F2A2E] dark:text-white transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "user", "admin"] as const).map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={cn("px-3 py-2 text-xs font-body font-medium rounded-xl capitalize transition-all duration-150",
                roleFilter === r ? "bg-[#6D8B74] text-white" : "bg-white dark:bg-gray-900 border border-[#A8CBB7]/30 text-[#6D8B74] hover:bg-[#A8CBB7]/10")}>
              {r === "all" ? "All Users" : r === "admin" ? "Admins" : "Customers"}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#6D8B74]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-10 h-10 text-[#A8CBB7] mx-auto mb-3" />
            <p className="font-heading text-lg text-[#1F2A2E] dark:text-white">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#A8CBB7]/20">
                  {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-body font-semibold text-[#6D8B74] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8CBB7]/10">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F8FBF9] dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8CBB7] to-[#6D8B74] flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-[#1F2A2E] dark:text-white whitespace-nowrap">{user.name}</p>
                          <p className="text-[11px] text-[#6D8B74]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select value={user.role} onChange={(e) => handleRoleChange(user, e.target.value as "user" | "admin")}
                        className="text-xs font-body border border-[#A8CBB7]/30 rounded-lg px-2 py-1.5 bg-transparent text-[#1F2A2E] dark:text-white focus:outline-none focus:border-[#A8CBB7] cursor-pointer">
                        <option value="user">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.isActive ? "active" : "inactive"} />
                    </td>
                    <td className="px-4 py-3 text-sm font-body text-[#6D8B74] whitespace-nowrap">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedUser(user)}
                          className="px-2.5 py-1 text-[11px] font-body font-medium text-[#6D8B74] border border-[#A8CBB7]/40 rounded-lg hover:bg-[#A8CBB7]/10 transition-colors">
                          View
                        </button>
                        <button onClick={() => handleToggleStatus(user)}
                          className={cn("px-2.5 py-1 text-[11px] font-body font-medium rounded-lg transition-colors whitespace-nowrap",
                            user.isActive ? "text-red-500 border border-red-200 hover:bg-red-50" : "text-green-600 border border-green-200 hover:bg-green-50")}>
                          {user.isActive ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* User Profile Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40" onClick={() => setSelectedUser(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative ml-auto w-full max-w-sm bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-[#A8CBB7]/20 flex items-center justify-between">
                <h3 className="font-heading text-xl text-[#1F2A2E] dark:text-white">User Profile</h3>
                <button onClick={() => setSelectedUser(null)} className="p-2 rounded-xl hover:bg-[#A8CBB7]/10 text-[#6D8B74]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A8CBB7] to-[#6D8B74] flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{selectedUser.name.charAt(0)}</span>
                  </div>
                  <div className="text-center">
                    <h4 className="font-heading text-lg text-[#1F2A2E] dark:text-white">{selectedUser.name}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#A8CBB7]/10 text-[#6D8B74] text-xs rounded-full mt-1">
                      <Shield className="w-3 h-3" />
                      {selectedUser.role === "admin" ? "Administrator" : "Customer"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: "Email", value: selectedUser.email },
                    { icon: Phone, label: "Phone", value: selectedUser.phone || "—" },
                    { icon: Calendar, label: "Joined", value: format(new Date(selectedUser.createdAt), "MMMM d, yyyy") },
                    { icon: DollarSign, label: "Verified", value: selectedUser.isVerified ? "Yes" : "No" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 p-3 bg-[#F8FBF9] dark:bg-gray-800 rounded-xl">
                      <Icon className="w-4 h-4 text-[#6D8B74] shrink-0" />
                      <div>
                        <p className="text-[10px] font-body font-medium text-[#6D8B74] uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-body text-[#1F2A2E] dark:text-white mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <StatusBadge status={selectedUser.isActive ? "active" : "inactive"} />
                <button onClick={() => handleToggleStatus(selectedUser)}
                  className={cn("w-full py-2.5 text-sm font-body font-medium rounded-xl transition-colors",
                    selectedUser.isActive ? "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100" : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100")}>
                  {selectedUser.isActive ? "Disable Account" : "Enable Account"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
