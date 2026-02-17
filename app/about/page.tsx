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
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About TILERSHUB</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Sri Lanka&apos;s trusted partner for premium interior design and renovation services.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Founded with a passion for transforming living spaces, TILERSHUB has grown into one of Sri Lanka&apos;s most trusted names in interior design and renovation. What started as a small tiling service has evolved into a comprehensive renovation company offering end-to-end solutions.
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

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-10 text-center">Why Choose Us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Expert Craftsmen", desc: "Skilled professionals with years of hands-on experience in interior renovation." },
              { title: "Quality Materials", desc: "We use only premium, durable materials sourced from trusted suppliers." },
              { title: "On-Time Delivery", desc: "Projects completed on schedule with clear milestones and communication." },
              { title: "Customer First", desc: "Your satisfaction is our priority. We work closely with you at every step." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold text-navy text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy mb-10 text-center">Our Process</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-navy text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Work With Us?</h2>
          <p className="mt-4 text-gray-200 text-lg max-w-xl mx-auto">
            Get in touch today for a free consultation. Let us help you transform your space.
          </p>
          <Link href="/contact" className="mt-8 inline-block bg-secondary text-navy font-semibold px-8 py-4 rounded-xl hover:bg-secondary-light transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
