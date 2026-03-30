"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/admin-store";

export default function AdminDarkModeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { darkMode } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
}
