import type { ReactNode } from "react";

export function Page({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-charcoal tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-charcoal-muted">{description}</p>
        ) : null}
      </header>
      {children}
    </main>
  );
}
