import Link from "next/link";
import type { Metadata } from "next";
import { getGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description: "Step-by-step renovation and interior design guides from TILERSHUB.",
};

function getIcon(name: string) {
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    sparkle: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    scale: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    droplet: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c-4.97 0-9-4.03-9-9 0-4.97 9-12 9-12s9 7.03 9 12c0 4.97-4.03 9-9 9z" />
      </svg>
    ),
    kitchen: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    shield: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  };
  return icons[name] || icons.home;
}

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div>
      <section className="bg-navy text-white py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">How-To Guides</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-2xl mx-auto">
            Step-by-step guides to help you plan and understand your renovation projects.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <article key={guide.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    {getIcon(guide.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-navy mb-1">{guide.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{guide.steps} steps</span>
                      <span className="text-primary font-medium">Read Guide</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="card p-6 bg-gradient-to-br from-primary/5 to-primary/10 mt-10">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-navy mb-2">Ready to start your project?</h3>
                <p className="text-sm text-gray-600">Contact us for a free consultation and professional quote.</p>
              </div>
              <Link href="/contact" className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors whitespace-nowrap">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
