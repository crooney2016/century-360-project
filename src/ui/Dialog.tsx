import * as React from "react";
import { cn } from "./cn";

export const Dialog = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("fixed inset-0 z-50 flex items-center justify-center", className)}
      {...props}
    />
  )
);
Dialog.displayName = "Dialog";
