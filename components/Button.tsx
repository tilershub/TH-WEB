import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const { className, variant = "primary", ...rest } = props;
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-black text-white hover:bg-neutral-800",
        variant === "secondary" && "bg-neutral-100 hover:bg-neutral-200 text-neutral-900",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...rest}
    />
  );
}
