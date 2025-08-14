"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AnimationContextType {
  reducedMotion: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  setAnimationSpeed: (speed: "slow" | "normal" | "fast") => void;
  toggleReducedMotion: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<"slow" | "normal" | "fast">("normal");

  useEffect(() => {
    // Check user's motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const value: AnimationContextType = {
    reducedMotion,
    animationSpeed,
    setAnimationSpeed,
    toggleReducedMotion,
  };

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}

// Hook to get animation duration based on speed preference
export function useAnimationDuration(baseDuration: number = 0.3) {
  const { animationSpeed } = useAnimation();

  switch (animationSpeed) {
    case "slow":
      return baseDuration * 1.5;
    case "fast":
      return baseDuration * 0.5;
    default:
      return baseDuration;
  }
}

// Hook to check if animations should be disabled
export function useShouldAnimate() {
  const { reducedMotion } = useAnimation();
  return !reducedMotion;
}
