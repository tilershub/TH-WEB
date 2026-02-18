import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about TILERSHUB - Sri Lanka's trusted interior design and renovation company with 10+ years of experience.",
};

const processSteps = [
  { step: "01", title: "Consultation", description: "We visit your space, understand your vision, and discuss requirements, budget, and timeline." },
  { step: "02", title: "Design & Planning", description: "Our team creates a detailed plan including materials, layout, and cost breakdown for your approval." },
  { step: "03", title: "Execution", description: "Our skilled craftsmen carry out the work with precision, keeping you informed at every stage." },
  { step: "04", title: "Handover", description: "We conduct a thorough quality check and hand over your beautifully transformed space." },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">
            Our Story
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal tracking-tight">
            About Tilershub
          </h1>
          <p className="mt-4 text-charcoal-muted max-w-xl mx-auto leading-relaxed">
            Sri Lanka&apos;s trusted partner for premium interior design and renovation services.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-5 text-charcoal-muted leading-relaxed">
            <p>
              Founded with a passion for transforming living spaces, Tilershub has grown into one of Sri Lanka&apos;s most trusted names in interior design and renovation. What started as a small tiling service has evolved into a comprehensive renovation company offering end-to-end solutions.
            </p>
            <p>
              With over 10 years of experience and hundreds of completed projects, we bring together skilled craftsmen, premium materials, and modern design sensibilities to create spaces that our clients love.
            </p>
            <p>
              From bathroom renovations to full-home makeovers, our team handles every aspect of the process — consultation, design, execution, and quality assurance — so you can enjoy a hassle-free experience.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-sand/50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-8 text-center">
            Why Choose Us
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Expert Craftsmen", desc: "Skilled professionals with years of hands-on experience in interior renovation." },
              { title: "Quality Materials", desc: "We use only premium, durable materials sourced from trusted suppliers." },
              { title: "On-Time Delivery", desc: "Projects completed on schedule with clear milestones and communication." },
              { title: "Customer First", desc: "Your satisfaction is our priority. We work closely with you at every step." },
            ].map((item) => (
              <div key={item.title} className="bg-cream rounded-2xl p-6 border border-taupe-100/60">
                <h3 className="text-sm font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-10 text-center">
            Our Process
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-sand text-charcoal flex items-center justify-center text-sm font-medium mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-sand/50">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-charcoal tracking-tight">
            Ready to work with us?
          </h2>
          <p className="mt-3 text-charcoal-muted leading-relaxed">
            Get in touch today for a free consultation. Let us help you transform your space.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
