"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransition, pageTransitionUp } from "../../lib/animations";

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: "slide" | "fade" | "up";
}

export function PageTransition({ children, variant = "slide" }: PageTransitionProps) {
  const pathname = usePathname();

  const getVariants = () => {
    switch (variant) {
      case "slide":
        return pageTransition;
      case "up":
        return pageTransitionUp;
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      default:
        return pageTransition;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={getVariants()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
