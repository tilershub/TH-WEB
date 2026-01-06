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
  const {
    className,
    variant = "primary",
    size = "md",
    fullWidth,
    loading,
    leftIcon,
    disabled,
    children,
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        fullWidth && "w-full",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-5 py-3 text-sm",
        size === "lg" && "px-6 py-3.5 text-base",
        variant === "primary" && "bg-primary text-white hover:bg-primary-dark shadow-sm",
        variant === "secondary" && "bg-white border border-gray-300 hover:bg-gray-50 text-gray-800",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
