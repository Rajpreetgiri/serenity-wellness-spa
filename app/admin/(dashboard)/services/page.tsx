"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Scissors,
  Edit2,
  Trash2,
  Power,
  Search,
  Clock,
  DollarSign,
  BookOpen,
} from "lucide-react";
import { useServicesStore } from "@/lib/admin-store";
import { ServiceData } from "@/lib/api-client";
import ServiceModal from "@/components/admin/ServiceModal";
import { useToast } from "@/components/admin/AdminToast";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Relaxation", "Therapeutic", "Luxury", "Couples", "Specialty"];

export default function ServicesPage() {
  const { services, loading, fetch, addService, updateService, deleteService, toggleActive } =
    useServicesStore();
  const { toast } = useToast();

  useEffect(() => { fetch(); }, [fetch]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = services.filter((s) => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch =
      !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = async (data: Partial<ServiceData>) => {
    try {
      if (editingService) {
        await updateService(editingService._id, data);
        toast("Service updated successfully", "success");
      } else {
        await addService(data);
        toast("Service added successfully", "success");
      }
    } catch (err: unknown) {
      toast((err as Error).message || "Failed to save service", "error");
    }
    setEditingService(null);
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setDeletingId(null);
    toast("Service deleted", "info");
  };

  const handleToggle = async (service: ServiceData) => {
    await toggleActive(service._id);
    toast(`${service.name} is now ${service.isActive ? "inactive" : "active"}`, "info");
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-[#1F2A2E] dark:text-white">
            Services
          </h1>
          <p className="font-body text-sm text-[#6D8B74] mt-0.5">
            {services.length} total · {services.filter((s) => s.isActive).length} active
          </p>
        </div>
        <button
          onClick={() => { setEditingService(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#6D8B74] hover:bg-[#5a7561] text-white text-sm font-body font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D8B74]/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-[#A8CBB7]/30 rounded-xl focus:outline-none focus:border-[#A8CBB7] font-body text-[#1F2A2E] dark:text-white transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-3 py-2 text-xs font-body font-medium rounded-xl whitespace-nowrap transition-all duration-150",
                category === c
                  ? "bg-[#6D8B74] text-white"
                  : "bg-white dark:bg-gray-900 border border-[#A8CBB7]/30 text-[#6D8B74] hover:bg-[#A8CBB7]/10"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center"
        >
          <Scissors className="w-10 h-10 text-[#A8CBB7] mx-auto mb-3" />
          <p className="font-heading text-lg text-[#1F2A2E] dark:text-white">No services found</p>
          <button
            onClick={() => { setEditingService(null); setModalOpen(true); }}
            className="mt-4 px-4 py-2 bg-[#6D8B74] text-white text-sm font-body font-medium rounded-xl hover:bg-[#5a7561] transition-colors"
          >
            Add First Service
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden group transition-all duration-200",
                  service.isActive
                    ? "border-[#A8CBB7]/30 hover:shadow-[0_4px_24px_rgba(168,203,183,0.2)]"
                    : "border-gray-200 opacity-60"
                )}
              >
                {/* Image placeholder */}
                <div className="h-32 bg-gradient-to-br from-[#A8CBB7]/20 to-[#6D8B74]/10 flex items-center justify-center relative">
                  <Scissors className="w-8 h-8 text-[#A8CBB7]" />
                  {!service.isActive && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-body font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-[10px] font-body font-medium text-[#6D8B74] bg-white/90 px-2 py-0.5 rounded-full">
                    {service.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-heading text-base text-[#1F2A2E] dark:text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-xs font-body text-[#6D8B74] line-clamp-2 mb-3">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 text-xs font-body text-[#6D8B74]">
                      <Clock className="w-3 h-3" />
                      {service.duration}min
                    </div>
                    <div className="flex items-center gap-1 text-xs font-body font-semibold text-[#1F2A2E] dark:text-white">
                      <DollarSign className="w-3 h-3 text-[#6D8B74]" />
                      {service.price}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-body text-[#6D8B74] ml-auto">
                      <BookOpen className="w-3 h-3" />
                      {service.bookingCount}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setEditingService(service); setModalOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-body font-medium text-[#6D8B74] border border-[#A8CBB7]/40 rounded-lg hover:bg-[#A8CBB7]/10 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggle(service)}
                      className={cn(
                        "p-1.5 rounded-lg border transition-colors",
                        service.isActive
                          ? "border-amber-200 text-amber-500 hover:bg-amber-50"
                          : "border-green-200 text-green-600 hover:bg-green-50"
                      )}
                      title={service.isActive ? "Deactivate" : "Activate"}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(service._id)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Service Modal */}
      {modalOpen && (
        <ServiceModal
          service={editingService}
          onClose={() => { setModalOpen(false); setEditingService(null); }}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setDeletingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="font-heading text-lg text-[#1F2A2E] dark:text-white text-center mb-1">
                Delete Service?
              </h3>
              <p className="text-sm font-body text-[#6D8B74] text-center mb-5">
                This action cannot be undone. The service will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2.5 border border-[#A8CBB7]/40 text-[#6D8B74] text-sm font-body font-medium rounded-xl hover:bg-[#A8CBB7]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-body font-medium rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
