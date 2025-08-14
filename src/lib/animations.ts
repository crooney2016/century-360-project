/**
 * Comprehensive animation utilities for engaging user experience
 * Combines framer-motion, react-spring, and glass morphism effects
 */

import { Variants, Transition } from "framer-motion";

// ============================================================================
// GLASS MORPHISM EFFECTS
// ============================================================================

export const glassStyles = {
  // Modern glass effect with backdrop blur
  glass: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },

  // Frosted glass effect
  frosted: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },

  // Dark glass effect
  darkGlass: {
    background: "rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  },

  // Colored glass effects
  blueGlass: {
    background: "rgba(59, 130, 246, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.37)",
  },

  greenGlass: {
    background: "rgba(34, 197, 94, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(34, 197, 94, 0.37)",
  },
};

// ============================================================================
// FRAMER-MOTION ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: { opacity: 1, rotate: 0 },
};

// ============================================================================
// STAGGERED ANIMATIONS
// ============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const pageTransitionUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ============================================================================
// HOVER EFFECTS
// ============================================================================

export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const hoverLift: Variants = {
  initial: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: { y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" },
};

export const hoverGlow: Variants = {
  initial: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
  hover: { boxShadow: "0 0 0 10px rgba(59, 130, 246, 0.3)" },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const loadingPulse: Variants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const loadingBounce: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 0, -10],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

export const smoothTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

export const bouncyTransition: Transition = {
  duration: 0.6,
  ease: [0.68, -0.55, 0.265, 1.55],
};

export const elasticTransition: Transition = {
  duration: 0.8,
  ease: [0.175, 0.885, 0.32, 1.275],
};

// ============================================================================
// COMPOSITE ANIMATIONS
// ============================================================================

export const cardEnter: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const modalEnter: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const sidebarEnter: Variants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const createStaggerDelay = (index: number, staggerDelay: number = 0.1) => ({
  transition: {
    delay: index * staggerDelay,
    ...smoothTransition,
  },
});

export const createHoverAnimation = (scale: number = 1.05, duration: number = 0.2) => ({
  whileHover: { scale },
  whileTap: { scale: 0.95 },
  transition: { duration },
});

export const createScrollAnimation = (threshold: number = 0.1) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, threshold },
  variants: slideUp,
});

// ============================================================================
// CENTURY 360 SPECIFIC ANIMATIONS
// ============================================================================

// Glass morphism entrance animations
export const glassEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    backdropFilter: "blur(0px)",
    background: "rgba(255, 255, 255, 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    backdropFilter: "blur(20px)",
    background: "rgba(255, 255, 255, 0.1)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Card grid entrance with stagger
export const cardGridEntrance: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const cardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    backdropFilter: "blur(20px)",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Navigation animations
export const navEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    backdropFilter: "blur(20px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Hero section animations
export const heroEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const heroTextStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const heroTextItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Button interactions
export const buttonHover: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -2,
    boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.3)",
    scale: 1.02,
  },
  tap: {
    y: 0,
    scale: 0.98,
  },
};

// Search input focus
export const searchFocus: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
  },
  focus: {
    scale: 1.02,
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },
};

// Modal animations
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    backdropFilter: "blur(20px)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// PERFORMANCE OPTIMIZED ANIMATIONS
// ============================================================================

// Use transform properties for 60fps animations
export const optimizedHover: Variants = {
  initial: { transform: "translateY(0px) scale(1)" },
  hover: { transform: "translateY(-4px) scale(1.02)" },
  tap: { transform: "translateY(0px) scale(0.98)" },
};

// Smooth color transitions
export const colorTransition: Transition = {
  duration: 0.2,
  ease: "easeInOut",
};
