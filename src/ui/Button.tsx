import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

/**
 * A small, expressive button primitive for the Century 360 UI kit.
 *
 * @remarks
 * Uses Tailwind global component classes defined in `src/styles/ui.css` and
 * class-variance-authority for typed variants/sizes.
 *
 * @example
 * ```tsx
 * <Button>Default</Button>
 * <Button variant="primary">Primary</Button>
 * <Button variant="outline" size="sm">Small Outline</Button>
 * <Button variant="ghost" onClick={()=>{}}>Ghost</Button>
 * ```
 */
export const buttonStyles = cva("btn btn--md", {
  variants: {
    variant: {
      primary: "btn--primary",
      secondary: "btn--secondary",
      outline: "btn--outline",
      ghost: "btn--ghost",
      link: "btn--link",
    },
    size: {
      sm: "btn--sm",
      md: "btn--md",
      lg: "btn--lg",
    },
    block: {
      true: "btn--block",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    block: false,
  },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    asChild?: boolean;
  };

/** {@link ButtonProps} */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size, block }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export default Button;
