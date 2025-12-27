import type { ReactNode } from "react";

export function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="mt-4">{children}</div>
    </main>
  );
}
