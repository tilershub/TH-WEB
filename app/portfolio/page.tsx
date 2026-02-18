import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore our completed interior design and renovation projects across bathrooms, kitchens, flooring, and more.",
  openGraph: {
    title: "Portfolio | TILERSHUB",
    description:
      "Explore our completed interior design and renovation projects across bathrooms, kitchens, flooring, and more.",
    url: "https://tilershub.com/portfolio",
  },
};

const projects = [
  {
    title: "Modern Bathroom Renovation",
    category: "Bathrooms",
    description: "Complete bathroom overhaul with Italian marble tiles and frameless shower enclosure.",
  },
  {
    title: "Contemporary Kitchen Design",
    category: "Kitchen",
    description: "Open-plan kitchen with quartz countertops and custom cabinetry.",
  },
  {
    title: "Living Room Flooring",
    category: "Flooring",
    description: "Large-format porcelain tiles with underfloor heating installation.",
  },
  {
    title: "Office False Ceiling",
    category: "Ceiling",
    description: "Modern gypsum false ceiling with integrated LED lighting panels.",
  },
  {
    title: "Glass Partition Installation",
    category: "Glass Work",
    description: "Frameless glass partitions for a modern open office conversion.",
  },
  {
    title: "Full Home Waterproofing",
    category: "Waterproofing",
    description: "Comprehensive waterproofing solution for a three-story residential building.",
  },
];

export default function PortfolioPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">
            Our Work
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-charcoal tracking-tight">
            Portfolio
          </h1>
          <p className="mt-4 text-charcoal-muted max-w-xl mx-auto leading-relaxed">
            Explore our completed projects and see the quality of our craftsmanship.
          </p>
        </div>
      </section>

      {/* Project Grid */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group rounded-2xl border border-taupe-100/60 bg-cream overflow-hidden"
              >
                <div className="aspect-[16/10] bg-taupe-100 flex items-center justify-center">
                  <span className="text-taupe-300 text-sm">Photo</span>
                </div>
                <div className="p-5 md:p-6">
                  <span className="text-xs font-medium tracking-wide text-taupe-400">
                    {project.category}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-charcoal">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal-muted leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-sand/50">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-charcoal tracking-tight">
            Have a project in mind?
          </h2>
          <p className="mt-3 text-charcoal-muted leading-relaxed">
            Contact us for a free consultation and let us bring your vision to life.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide bg-charcoal text-cream rounded-full hover:bg-charcoal-light transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
