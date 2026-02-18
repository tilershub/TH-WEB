import Link from "next/link";
import { services } from "@/lib/services-data";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-4">
              Interior Design &amp; Renovation
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-[1.1] tracking-tight">
              Thoughtful spaces,{" "}
              <span className="text-taupe-400">beautifully crafted</span>
            </h1>
            <p className="mt-6 text-lg text-charcoal-muted leading-relaxed max-w-xl">
              We design and renovate interiors across Sri Lanka — bringing warmth,
              quality materials, and attention to detail to every project.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide border border-charcoal/20 text-charcoal rounded-full hover:bg-sand transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 sm:py-24 bg-sand/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">
              What We Do
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-charcoal tracking-tight">
              Our Services
            </h2>
          </div>

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

      {/* Why Us */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold text-charcoal tracking-tight">
              Why Tilershub
            </h2>
            <p className="mt-4 text-charcoal-muted max-w-lg mx-auto">
              We combine craftsmanship, quality, and care to deliver spaces you
              genuinely enjoy living in.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Expert Craftsmen", desc: "Over 10 years of hands-on experience in interior renovation across Sri Lanka." },
              { title: "Quality Materials", desc: "Premium products sourced from trusted suppliers for lasting results." },
              { title: "On-Time Delivery", desc: "Every project planned and executed to meet agreed-upon deadlines." },
              { title: "Free Consultation", desc: "No-obligation advice and quotes before you commit to anything." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <h3 className="text-sm font-semibold text-charcoal tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 sm:py-24 bg-sand/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">
              Our Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-charcoal tracking-tight">
              Recent Projects
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Modern Bathroom Renovation", service: "Bathrooms" },
              { name: "Contemporary Kitchen Design", service: "Kitchen" },
              { name: "Luxury Flooring Installation", service: "Flooring" },
            ].map((project) => (
              <div
                key={project.name}
                className="group rounded-2xl overflow-hidden border border-taupe-100/60 bg-cream"
              >
                <div className="aspect-[4/3] bg-taupe-100 flex items-center justify-center">
                  <span className="text-taupe-300 text-sm">Photo</span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium tracking-wide text-taupe-400">
                    {project.service}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-charcoal">
                    {project.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide border border-charcoal/20 text-charcoal rounded-full hover:bg-charcoal hover:text-cream transition-all duration-300"
            >
              View All Work
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-charcoal tracking-tight">
            Ready to start your project?
          </h2>
          <p className="mt-4 text-lg text-charcoal-muted max-w-lg mx-auto leading-relaxed">
            Get in touch for a free consultation and let us help you create the
            space you have been envisioning.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
