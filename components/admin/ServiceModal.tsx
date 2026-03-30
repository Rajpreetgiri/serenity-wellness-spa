"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ServiceData as Service } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface ServiceFormData {
  name: string;
  category: string;
  duration: number;
  price: number;
  description: string;
  image: string;
  active: boolean;
}

interface Props {
  service?: Service | null;
  onClose: () => void;
  onSave: (data: Partial<Service>) => void;
}

const CATEGORIES = ["Relaxation", "Therapeutic", "Luxury", "Couples", "Specialty"];

export default function ServiceModal({ service, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: service
      ? {
          name: service.name,
          category: service.category,
          duration: service.duration,
          price: service.price,
          description: service.description,
          image: service.image,
          active: service.isActive,
        }
      : { active: true as boolean, category: "Relaxation" },
  });

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        category: service.category,
        duration: service.duration,
        price: service.price,
        description: service.description,
        image: service.image,
        active: service.isActive,
      });
    }
  }, [service, reset]);

  const onSubmit = (data: ServiceFormData) => {
    const { active, ...rest } = data;
    onSave({
      ...rest,
      isActive: active,
      duration: Number(data.duration),
      price: Number(data.price),
    });
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-[#F8FBF9] dark:bg-gray-800 border border-[#A8CBB7]/30 rounded-xl focus:outline-none focus:border-[#A8CBB7] font-body text-[#1F2A2E] dark:text-white transition-colors";
  const labelClass = "block text-xs font-body font-medium text-[#6D8B74] uppercase tracking-wider mb-1.5";

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
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-[#A8CBB7]/20 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
            <h3 className="font-heading text-xl text-[#1F2A2E] dark:text-white">
              {service ? "Edit Service" : "Add New Service"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#A8CBB7]/10 text-[#6D8B74] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className={labelClass}>Service Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className={cn(inputClass, errors.name && "border-red-300")}
                placeholder="e.g. Swedish Massage"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select {...register("category")} className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Duration (min)</label>
                <input
                  type="number"
                  {...register("duration", { required: true, min: 15 })}
                  className={inputClass}
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Price (AUD $)</label>
              <input
                type="number"
                {...register("price", { required: true, min: 0 })}
                className={inputClass}
                placeholder="120"
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={3}
                className={cn(inputClass, "resize-none")}
                placeholder="Describe the service..."
              />
            </div>

            <div>
              <label className={labelClass}>Image Path</label>
              <input
                {...register("image")}
                className={inputClass}
                placeholder="/images/services/service.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                {...register("active")}
                className="w-4 h-4 accent-[#6D8B74] rounded"
              />
              <label htmlFor="active" className="text-sm font-body text-[#1F2A2E] dark:text-white">
                Active (visible to customers)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-[#A8CBB7]/40 text-[#6D8B74] text-sm font-body font-medium rounded-xl hover:bg-[#A8CBB7]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#6D8B74] hover:bg-[#5a7561] text-white text-sm font-body font-medium rounded-xl transition-colors"
              >
                {service ? "Save Changes" : "Add Service"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
