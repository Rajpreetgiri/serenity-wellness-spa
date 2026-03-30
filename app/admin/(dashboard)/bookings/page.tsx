"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, Eye, ChevronUp, ChevronDown, Calendar, Loader2 } from "lucide-react";
import { useBookingsStore } from "@/lib/admin-store";
import { BookingData } from "@/lib/api-client";
import StatusBadge from "@/components/admin/StatusBadge";
import BookingDetailModal from "@/components/admin/BookingDetailModal";
import { useToast } from "@/components/admin/AdminToast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type SortField = "date" | "serviceName" | "servicePrice" | "status";
type SortDir = "asc" | "desc";
type StatusFilter = BookingData["status"] | "all";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function BookingsPage() {
  const { bookings, loading, fetch, updateStatus } = useBookingsStore();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filtered = useMemo(() => {
    let result = [...bookings];
    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.serviceName.toLowerCase().includes(q) ||
          b.therapist.toLowerCase().includes(q) ||
          b.bookingRef.toLowerCase().includes(q) ||
          (typeof b.userId === "object" && b.userId !== null
            ? (b.userId as { name: string }).name.toLowerCase().includes(q)
            : false)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [bookings, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatus(id, status);
    toast(`Booking updated to ${status}`, "success");
  };

  const handleExport = () => {
    const headers = ["Ref", "Customer", "Service", "Therapist", "Date", "Time", "Status", "Price"];
    const rows = filtered.map((b) => {
      const name = typeof b.userId === "object" && b.userId !== null
        ? (b.userId as { name: string }).name : "—";
      return [b.bookingRef, name, b.serviceName, b.therapist, b.date, b.time, b.status, b.servicePrice].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Bookings exported to CSV", "success");
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={cn("w-2.5 h-2.5 -mb-0.5", sortField === field && sortDir === "asc" ? "text-[#6D8B74]" : "text-gray-300")} />
      <ChevronDown className={cn("w-2.5 h-2.5", sortField === field && sortDir === "desc" ? "text-[#6D8B74]" : "text-gray-300")} />
    </span>
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-[#1F2A2E] dark:text-white">Bookings</h1>
          <p className="font-body text-sm text-[#6D8B74] mt-0.5">
            {filtered.length} total · {bookings.filter((b) => b.status === "pending").length} pending
          </p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[#6D8B74] hover:bg-[#5a7561] text-white text-sm font-body font-medium rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D8B74]/50" />
          <input type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, service, ref..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-[#A8CBB7]/30 rounded-xl focus:outline-none focus:border-[#A8CBB7] font-body text-[#1F2A2E] dark:text-white transition-colors" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={cn("px-3 py-2 text-xs font-body font-medium rounded-xl whitespace-nowrap transition-all duration-150",
                statusFilter === f.value ? "bg-[#6D8B74] text-white" : "bg-white dark:bg-gray-900 border border-[#A8CBB7]/30 text-[#6D8B74] hover:bg-[#A8CBB7]/10")}>
              {f.label}
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
        ) : paginated.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar className="w-10 h-10 text-[#A8CBB7] mx-auto mb-3" />
            <p className="font-heading text-lg text-[#1F2A2E] dark:text-white">No bookings found</p>
            <p className="font-body text-sm text-[#6D8B74] mt-1">Seed the DB via /api/admin/seed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#A8CBB7]/20">
                  {[
                    { label: "Ref", field: null },
                    { label: "Customer", field: null },
                    { label: "Service", field: "serviceName" as SortField },
                    { label: "Therapist", field: null },
                    { label: "Date & Time", field: "date" as SortField },
                    { label: "Price", field: "servicePrice" as SortField },
                    { label: "Status", field: "status" as SortField },
                    { label: "Actions", field: null },
                  ].map(({ label, field }) => (
                    <th key={label} onClick={() => field && handleSort(field)}
                      className={cn("px-4 py-3 text-left text-[11px] font-body font-semibold text-[#6D8B74] uppercase tracking-wider",
                        field && "cursor-pointer hover:text-[#1F2A2E] dark:hover:text-white transition-colors select-none")}>
                      {label}{field && <SortIcon field={field} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A8CBB7]/10">
                {paginated.map((b) => {
                  const user = typeof b.userId === "object" && b.userId !== null
                    ? b.userId as { name: string; email: string } : null;
                  const customerName = user?.name || "—";
                  const customerEmail = user?.email || "";
                  return (
                    <tr key={b._id} className="hover:bg-[#F8FBF9] dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-[#6D8B74] bg-[#A8CBB7]/10 px-2 py-0.5 rounded">{b.bookingRef}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A8CBB7] to-[#6D8B74] flex items-center justify-center shrink-0">
                            <span className="text-white text-[10px] font-bold">{customerName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-body font-medium text-[#1F2A2E] dark:text-white whitespace-nowrap">{customerName}</p>
                            <p className="text-[11px] text-[#6D8B74] hidden sm:block">{customerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-body text-[#1F2A2E] dark:text-white whitespace-nowrap">{b.serviceName}</td>
                      <td className="px-4 py-3 text-sm font-body text-[#6D8B74] whitespace-nowrap">{b.therapist}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-body text-[#1F2A2E] dark:text-white whitespace-nowrap">
                          {format(new Date(b.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-[#6D8B74]">{b.time}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-body font-semibold text-[#1F2A2E] dark:text-white">${b.servicePrice}</td>
                      <td className="px-4 py-3">
                        <select value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className="text-xs font-body border border-[#A8CBB7]/30 rounded-lg px-2 py-1.5 bg-transparent text-[#1F2A2E] dark:text-white focus:outline-none focus:border-[#A8CBB7] cursor-pointer">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg hover:bg-[#A8CBB7]/10 text-[#6D8B74] transition-colors" title="View details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#A8CBB7]/20 flex items-center justify-between">
            <p className="text-xs font-body text-[#6D8B74]">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={cn("w-7 h-7 text-xs font-body rounded-lg transition-colors",
                    p === page ? "bg-[#6D8B74] text-white" : "text-[#6D8B74] hover:bg-[#A8CBB7]/10")}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal — adapted to BookingData */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking as Parameters<typeof BookingDetailModal>[0]["booking"]}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
