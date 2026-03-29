"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useUIStore } from "@/lib/store";

export default function AmbientAudio() {
  const { audioPlaying, toggleAudio } = useUIStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(
      "https://www.soundjay.com/nature/sounds/rain-01.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [audioPlaying]);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      onClick={toggleAudio}
      className="audio-btn group"
      aria-label={audioPlaying ? "Mute ambient sound" : "Play ambient sound"}
      title={audioPlaying ? "Mute ambient sound" : "Play spa ambience"}
    >
      <AnimatePresence mode="wait">
        {audioPlaying ? (
          <motion.div
            key="on"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Volume2 className="w-5 h-5 text-spa-accent" strokeWidth={1.5} />
            {/* Sound waves */}
            {[0, 0.3, 0.6].map((delay) => (
              <motion.div
                key={delay}
                className="absolute inset-0 rounded-full border border-spa-accent/30"
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{
                  duration: 1.5,
                  delay,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX className="w-5 h-5 text-spa-muted" strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
