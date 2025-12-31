import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const { className, variant = "primary", ...rest } = props;
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-primary text-white hover:bg-primary-dark shadow-sm",
        variant === "secondary" && "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...rest}
    />
  );
}
