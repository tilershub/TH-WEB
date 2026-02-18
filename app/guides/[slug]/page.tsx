import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getGuideBySlug, getGuides } from "@/lib/content";

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found | TILERSHUB" };
  return { title: `${guide.title} | TILERSHUB Guides`, description: guide.description };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="pb-28">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <Link href="/guides" className="inline-flex items-center gap-1.5 text-sm text-charcoal-muted hover:text-charcoal transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            Guides
          </Link>
        </div>
        <div>
          <span className="text-xs font-medium tracking-wide text-taupe-400 mb-4 block">{guide.steps.length} Steps</span>
          <h1 className="text-2xl md:text-3xl font-semibold text-charcoal tracking-tight mb-2">{guide.title}</h1>
          <p className="text-charcoal-muted mb-10">{guide.description}</p>
          <div className="space-y-8">
            {guide.steps.map((step, index) => (
              <div key={index} className="border-l-2 border-taupe-100 pl-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-sand text-charcoal flex items-center justify-center text-xs font-medium">{index + 1}</div>
                  <h2 className="text-base font-semibold text-charcoal">{step.title}</h2>
                </div>
                <ul className="space-y-2 ml-10">
                  {step.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-charcoal-muted text-sm">
                      <svg className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-taupe-100">
            <h3 className="text-sm font-semibold text-charcoal mb-4">Ready to get started?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors">Get a Free Quote</Link>
              <Link href="/services" className="inline-flex items-center justify-center px-6 py-2.5 text-sm tracking-wide border border-charcoal/20 text-charcoal rounded-full hover:bg-sand transition-colors">View Our Services</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
