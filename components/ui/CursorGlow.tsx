"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    const handleLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [isVisible]);

  // Only render on desktop
  if (typeof window !== "undefined" && window.innerWidth < 1024) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-0 rounded-full"
      style={{
        width: 400,
        height: 400,
        background:
          "radial-gradient(circle, rgba(168,203,183,0.07) 0%, transparent 70%)",
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 80, damping: 25, mass: 0.5 }}
    />
  );
}
