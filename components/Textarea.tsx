import { clsx } from "clsx";
import type { TextareaHTMLAttributes } from "react";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return (
    <textarea
      className={clsx(
        "w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300",
        className
      )}
      {...rest}
    />
  );
}
