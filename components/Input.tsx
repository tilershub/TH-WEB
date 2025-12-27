import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      className={clsx(
        "w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300",
        className
      )}
      {...rest}
    />
  );
}
