import Link from "next/link";
import type { Metadata } from "next";
import { getGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description: "Step-by-step renovation and interior design guides from TILERSHUB.",
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">Resources</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">How-To Guides</h1>
          <p className="mt-4 text-charcoal-muted max-w-lg mx-auto leading-relaxed">Step-by-step guides to help you plan and understand your renovation projects.</p>
        </div>
      </section>
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`} className="group">
                <article className="rounded-2xl border border-taupe-100/60 bg-cream p-5 hover:shadow-soft transition-all">
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-charcoal mb-1 group-hover:text-sage-dark transition-colors">{guide.title}</h2>
                      <p className="text-sm text-charcoal-muted mb-2">{guide.description}</p>
                      <div className="flex items-center gap-3 text-xs text-charcoal-muted">
                        <span>{guide.steps} steps</span>
                        <span className="font-medium tracking-wide text-taupe-400 group-hover:text-charcoal transition-colors">Read &rarr;</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          <div className="rounded-2xl bg-sand/50 p-6 mt-10">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-charcoal mb-1">Ready to start your project?</h3>
                <p className="text-sm text-charcoal-muted">Contact us for a free consultation and professional quote.</p>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors whitespace-nowrap">Get a Quote</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
