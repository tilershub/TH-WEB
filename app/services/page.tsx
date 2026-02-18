import Link from "next/link";
import { services } from "@/lib/services-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Comprehensive interior design and renovation solutions for every room in your home. Bathrooms, kitchens, flooring, ceilings, glass work, electrical, plumbing, and waterproofing.",
};

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">
            What We Do
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal tracking-tight">
            Our Services
          </h1>
          <p className="mt-4 text-charcoal-muted max-w-xl mx-auto leading-relaxed">
            Comprehensive interior design and renovation solutions for every room
            in your home.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group bg-cream rounded-2xl p-6 border border-taupe-100/60 hover:shadow-soft transition-all duration-300"
              >
                <h3 className="text-base font-semibold text-charcoal mb-2 group-hover:text-sage-dark transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-charcoal-muted leading-relaxed mb-4">
                  {service.shortDescription}
                </p>
                <span className="text-xs font-medium tracking-wide text-taupe-400 group-hover:text-charcoal transition-colors">
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-sand/50">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-charcoal tracking-tight">
            Not sure what you need?
          </h2>
          <p className="mt-3 text-charcoal-muted leading-relaxed">
            Our team will help you identify the right services for your project.
            Get a free consultation today.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
