import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceBySlug, services } from "@/lib/services-data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getServiceBySlug(params.slug);
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

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== params.slug);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-navy text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">{service.name}</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl leading-relaxed">{service.shortDescription}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-navy mb-4">About This Service</h2>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy mb-4">What We Offer</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy mb-4">Our Process</h2>
                <div className="space-y-4">
                  {["Consultation & Assessment", "Design & Planning", "Execution & Installation", "Quality Check & Handover"].map((step, i) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy">{step}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-primary text-white rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-3">Get a Quote for {service.name}</h3>
                <p className="text-gray-200 text-sm mb-5">
                  Ready to get started? Contact us for a free, no-obligation consultation and quote.
                </p>
                <Link href="/contact" className="block text-center bg-secondary text-navy font-semibold py-3 px-6 rounded-xl hover:bg-secondary-light transition-colors">
                  Contact Us
                </Link>
              </div>

              <div className="border rounded-2xl p-6">
                <h3 className="font-bold text-navy mb-3">Why Choose Us</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    10+ years of experience
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    On-time project delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Free consultation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy mb-8 text-center">Other Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherServices.slice(0, 4).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="bg-white rounded-xl p-5 hover:shadow-card-hover transition-shadow border border-gray-100">
                <h3 className="font-semibold text-navy mb-1">{s.name}</h3>
                <p className="text-xs text-gray-600">{s.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
