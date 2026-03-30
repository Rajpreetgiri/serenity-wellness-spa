"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/lib/admin-store";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only shift on large screens; on mobile the sidebar overlays
    const handleResize = () => {
      if (!ref.current) return;
      if (window.innerWidth >= 1024) {
        ref.current.style.paddingLeft = sidebarOpen ? "240px" : "72px";
      } else {
        ref.current.style.paddingLeft = "0px";
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  return (
    <div
      ref={ref}
      className="flex flex-col min-h-screen transition-[padding] duration-300"
      style={{ paddingLeft: "72px" }} // default for SSR (collapsed)
    >
      {children}
    </div>
  );
}
