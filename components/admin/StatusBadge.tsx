import { cn } from "@/lib/utils";

type Status = "pending" | "confirmed" | "cancelled" | "completed" | "active" | "inactive";

const statusConfig: Record<
  Status,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-green-50 text-green-600 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-500 border-red-200",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-600 border-blue-200",
  },
  active: {
    label: "Active",
    className: "bg-green-50 text-green-600 border-green-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-body font-semibold border",
        config.className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}
