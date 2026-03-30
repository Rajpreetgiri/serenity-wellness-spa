"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: "green" | "peach" | "blue" | "purple";
  index?: number;
}

const colorMap = {
  green: {
    bg: "bg-[#A8CBB7]/15",
    icon: "bg-[#6D8B74]",
    text: "text-[#6D8B74]",
    border: "border-[#A8CBB7]/40",
  },
  peach: {
    bg: "bg-[#F6C1A6]/15",
    icon: "bg-[#F6C1A6]",
    text: "text-[#c07850]",
    border: "border-[#F6C1A6]/40",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-500",
    text: "text-blue-500",
    border: "border-blue-100",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-500",
    text: "text-purple-500",
    border: "border-purple-100",
  },
};

export default function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color,
  index = 0,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl p-5 border",
        colors.border,
        "hover:shadow-[0_4px_24px_rgba(168,203,183,0.2)] transition-all duration-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-body font-medium text-[#6D8B74]/70 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-heading font-semibold text-[#1F2A2E] dark:text-white">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "mt-1 text-xs font-body font-medium",
                changeType === "up" && "text-green-500",
                changeType === "down" && "text-red-400",
                changeType === "neutral" && "text-[#6D8B74]"
              )}
            >
              {changeType === "up" && "↑ "}
              {changeType === "down" && "↓ "}
              {change}
            </p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.icon)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
