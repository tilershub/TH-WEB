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
  return {
    title: `${guide.title} | TILERSHUB Guides`,
    description: guide.description,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/guides" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Guides
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              {guide.steps.length} Steps
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">{guide.title}</h1>
          <p className="text-gray-600 mb-8">{guide.description}</p>

          <div className="space-y-6">
            {guide.steps.map((step, index) => (
              <div key={index} className="border-l-4 border-primary/20 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h2 className="text-lg font-semibold text-navy">{step.title}</h2>
                </div>
                <ul className="space-y-2 ml-11">
                  {step.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-navy mb-4">Ready to get started?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary font-medium py-3 px-6 rounded-xl hover:bg-primary/5 transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
