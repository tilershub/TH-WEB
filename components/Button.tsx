import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: ReactNode;
  }
) {
  const { className, variant = "primary", size = "md", fullWidth, loading, leftIcon, disabled, children, ...rest } = props;
  const isDisabled = disabled || loading;

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-3.5 text-base",
        variant === "primary" && "bg-charcoal text-cream hover:bg-charcoal-light",
        variant === "secondary" && "bg-cream border border-taupe-200 hover:bg-sand text-charcoal",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
          <span>{children}</span>
        </span>
      ) : (
        <>
          {leftIcon}
          {children}
        </>
      )}
    </button>
  );
}
