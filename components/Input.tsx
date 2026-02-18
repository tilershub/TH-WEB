import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-taupe-200 px-4 py-3 text-sm text-charcoal bg-white",
        "placeholder:text-taupe-300",
        "outline-none transition focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:border-transparent",
        "disabled:bg-sand disabled:text-charcoal-muted disabled:cursor-not-allowed",
        className
      )}
      {...rest}
    />
  );
}
