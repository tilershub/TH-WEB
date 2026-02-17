import Link from "next/link";
import { services } from "@/lib/services-data";

const serviceIcons: Record<string, React.ReactNode> = {
  droplet: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  kitchen: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="8" y1="13" x2="8" y2="17" />
      <line x1="16" y1="13" x2="16" y2="17" />
    </svg>
  ),
  grid: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  layers: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  square: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  zap: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  wrench: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const whyChooseUs = [
  {
    title: "Expert Craftsmen",
    description: "Our team brings over 10+ years of hands-on experience in interior design and renovation across Sri Lanka.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Quality Materials",
    description: "We source only premium products and materials from trusted suppliers to ensure lasting results.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "On-Time Delivery",
    description: "We respect your time. Every project is planned and executed to meet agreed-upon deadlines.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Free Consultation",
    description: "Get a no-obligation quote and expert advice before you commit. We are here to help you plan.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const portfolioPreview = [
  { name: "Modern Bathroom Renovation", service: "Bathrooms", gradient: "from-primary to-primary-dark" },
  { name: "Contemporary Kitchen Design", service: "Kitchen", gradient: "from-navy to-navy-dark" },
  { name: "Luxury Flooring Installation", service: "Flooring", gradient: "from-primary-dark to-navy" },
];

export default function HomePage() {
  return (
    <div>
      {/* ──────────────────── Hero Section ──────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-navy text-white">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Transform Your Space with{" "}
              <span className="text-secondary">Expert Interior Design</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl">
              Premium renovation and interior design services across Sri Lanka.
              From bathrooms to kitchens, flooring to electrical — we bring your
              vision to life.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-secondary text-navy hover:bg-secondary-light transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Our Services
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 border-white/30 text-white hover:bg-white/10 transition-colors duration-200"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80h1440V30C1200 70 960 0 720 30S240 70 0 30v50z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ──────────────────── Services Section ──────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive interior design and renovation solutions tailored to
              your needs. Every project receives our full attention and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-card-hover hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {serviceIcons[service.icon]}
                </div>

                <h3 className="text-lg font-bold text-navy mb-2">
                  {service.name}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {service.shortDescription}
                </p>

                <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:text-primary-light transition-colors">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── Why Choose Us Section ──────────────────── */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">
              Why Choose Us
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We combine skill, quality, and dedication to deliver results that
              exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold text-navy mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── Portfolio Preview Section ──────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">
              Our Recent Work
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our portfolio of completed projects across Sri Lanka. Each
              project reflects our commitment to quality craftsmanship and
              attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioPreview.map((project) => (
              <div
                key={project.name}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-shadow duration-300"
              >
                {/* Gradient placeholder background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />

                {/* Overlay content */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex flex-col justify-end p-6">
                  <span className="inline-block px-3 py-1 bg-secondary/90 text-navy text-xs font-semibold rounded-full mb-3 w-fit">
                    {project.service}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {project.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              View Full Portfolio
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA Section ──────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-dark to-primary text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Ready to Transform Your Space?
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let our team of experts help you create the home you have always
            envisioned. Get in touch today for a free consultation and
            personalized quote.
          </p>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-xl bg-secondary text-navy hover:bg-secondary-light transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Us Today
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
