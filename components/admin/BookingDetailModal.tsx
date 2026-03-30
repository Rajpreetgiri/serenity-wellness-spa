"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Scissors, DollarSign, FileText } from "lucide-react";
import { BookingData } from "@/lib/api-client";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";

interface Props {
  booking: BookingData | null;
  onClose: () => void;
}

export default function BookingDetailModal({ booking, onClose }: Props) {
  if (!booking) return null;

  const user =
    typeof booking.userId === "object" && booking.userId !== null
      ? (booking.userId as { name: string; email: string })
      : null;

  const details = [
    { icon: Calendar, label: "Date", value: format(new Date(booking.date), "EEEE, MMMM d, yyyy") },
    { icon: Clock, label: "Time", value: `${booking.time} · ${booking.serviceDuration} min` },
    { icon: User, label: "Customer", value: user ? `${user.name} · ${user.email}` : "—" },
    { icon: Scissors, label: "Service", value: booking.serviceName },
    { icon: User, label: "Therapist", value: booking.therapist },
    { icon: DollarSign, label: "Price", value: `$${booking.servicePrice} AUD` },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6 border-b border-[#A8CBB7]/20 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#6D8B74] bg-[#A8CBB7]/10 px-2 py-0.5 rounded-lg">
                  {booking.bookingRef}
                </span>
                <StatusBadge status={booking.status} />
              </div>
              <h3 className="font-heading text-xl text-[#1F2A2E] dark:text-white">
                Booking Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#A8CBB7]/10 text-[#6D8B74] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A8CBB7]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#6D8B74]" />
                </div>
                <div>
                  <p className="text-[11px] font-body font-medium text-[#6D8B74] uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm font-body text-[#1F2A2E] dark:text-white mt-0.5">{value}</p>
                </div>
              </div>
            ))}

            {booking.notes && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A8CBB7]/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#6D8B74]" />
                </div>
                <div>
                  <p className="text-[11px] font-body font-medium text-[#6D8B74] uppercase tracking-wider">
                    Notes
                  </p>
                  <p className="text-sm font-body text-[#1F2A2E] dark:text-white mt-0.5">
                    {booking.notes}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#A8CBB7]/20">
              <p className="text-[11px] text-[#6D8B74] font-body">
                Booked on {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#6D8B74] hover:bg-[#5a7561] text-white text-sm font-body font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
