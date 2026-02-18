import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceBySlug, services } from "@/lib/services-data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.name,
    description: service.description,
    openGraph: {
      title: `${service.name} | TILERSHUB`,
      description: service.shortDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== slug);

  return (
    <div>
      {/* Header */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm text-charcoal-muted hover:text-charcoal transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Services
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">
            {service.name}
          </h1>
          <p className="mt-4 text-lg text-charcoal-muted max-w-2xl leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-10">
              <div>
                <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-4">
                  About This Service
                </h2>
                <p className="text-charcoal-muted leading-relaxed">{service.description}</p>
              </div>

              <div>
                <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-4">
                  What We Offer
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 p-4 rounded-xl bg-sand/50">
                      <svg className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-charcoal">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-4">
                  Our Process
                </h2>
                <div className="space-y-4">
                  {["Consultation & Assessment", "Design & Planning", "Execution & Installation", "Quality Check & Handover"].map((step, i) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-sand text-charcoal flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-charcoal">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-charcoal text-cream rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">Get a Quote</h3>
                <p className="text-cream/70 text-sm mb-5 leading-relaxed">
                  Ready to get started? Contact us for a free, no-obligation consultation.
                </p>
                <Link
                  href="/contact"
                  className="block text-center bg-cream text-charcoal font-medium text-sm py-3 px-6 rounded-full hover:bg-sand transition-colors"
                >
                  Contact Us
                </Link>
              </div>

              <div className="border border-taupe-100 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-charcoal mb-4">Why Choose Us</h3>
                <ul className="space-y-3 text-sm text-charcoal-muted">
                  {["10+ years of experience", "Premium quality materials", "On-time project delivery", "Free consultation"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-sage flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-16 bg-sand/50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-6 text-center">
            Other Services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherServices.slice(0, 4).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="bg-cream rounded-xl p-5 border border-taupe-100/60 hover:shadow-soft transition-all"
              >
                <h3 className="text-sm font-semibold text-charcoal mb-1">{s.name}</h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">{s.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
