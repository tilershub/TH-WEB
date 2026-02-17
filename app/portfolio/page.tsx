import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore our completed interior design and renovation projects. See the quality of our craftsmanship across bathrooms, kitchens, flooring, ceilings, glass work, and more.",
  openGraph: {
    title: "Portfolio | TILERSHUB",
    description:
      "Explore our completed interior design and renovation projects across bathrooms, kitchens, flooring, and more.",
    url: "https://tilershub.com/portfolio",
  },
};

const filterTabs = [
  "All Projects",
  "Bathrooms",
  "Kitchen",
  "Flooring",
  "Ceiling",
  "Glass Work",
  "Electrical",
  "Plumbing",
  "Waterproofing",
];

const projects = [
  {
    title: "Modern Bathroom Renovation",
    category: "Bathrooms",
    description:
      "Complete bathroom overhaul with Italian marble tiles and frameless shower enclosure.",
    gradient: "from-sky-700 via-cyan-600 to-teal-500",
    icon: (
      <svg
        className="w-10 h-10 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 21c-4.97 0-9-4.03-9-9 0-4.97 9-12 9-12s9 7.03 9 12c0 4.97-4.03 9-9 9z"
        />
      </svg>
    ),
  },
  {
    title: "Contemporary Kitchen Design",
    category: "Kitchen",
    description:
      "Open-plan kitchen with quartz countertops and custom cabinetry.",
    gradient: "from-amber-700 via-orange-600 to-yellow-500",
    icon: (
      <svg
        className="w-10 h-10 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    title: "Living Room Flooring",
    category: "Flooring",
    description:
      "Large-format porcelain tiles with underfloor heating installation.",
    gradient: "from-stone-700 via-stone-600 to-amber-700",
    icon: (
      <svg
        className="w-10 h-10 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
        />
      </svg>
    ),
  },
  {
    title: "Office False Ceiling",
    category: "Ceiling",
    description:
      "Modern gypsum false ceiling with integrated LED lighting panels.",
    gradient: "from-indigo-700 via-violet-600 to-purple-500",
    icon: (
      <svg
        className="w-10 h-10 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Glass Partition Installation",
    category: "Glass Work",
    description:
      "Frameless glass partitions for a modern open office conversion.",
    gradient: "from-slate-600 via-blue-500 to-sky-400",
    icon: (
      <svg
        className="w-10 h-10 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
  },
  {
    title: "Full Home Waterproofing",
    category: "Waterproofing",
    description:
      "Comprehensive waterproofing solution for a three-story residential building.",
    gradient: "from-emerald-700 via-teal-600 to-cyan-500",
    icon: (
      <svg
        className="w-10 h-10 text-white/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>
    ),
  },
];

function getCategoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    Bathrooms: "bg-sky-100 text-sky-700",
    Kitchen: "bg-amber-100 text-amber-700",
    Flooring: "bg-stone-100 text-stone-700",
    Ceiling: "bg-violet-100 text-violet-700",
    "Glass Work": "bg-blue-100 text-blue-700",
    Waterproofing: "bg-emerald-100 text-emerald-700",
    Electrical: "bg-yellow-100 text-yellow-700",
    Plumbing: "bg-cyan-100 text-cyan-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

export default function PortfolioPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light/50 to-navy opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium tracking-wide">
            Our Work
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Our Portfolio
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our completed projects and see the quality of our
            craftsmanship across bathrooms, kitchens, flooring, and more.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab, index) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  index === 0
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group rounded-2xl border border-gray-200 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
              >
                {/* Gradient placeholder image area */}
                <div
                  className={`relative h-52 md:h-60 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                >
                  {/* Decorative pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id={`grid-${project.title.replace(/\s+/g, "-")}`}
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#grid-${project.title.replace(/\s+/g, "-")})`}
                      />
                    </svg>
                  </div>

                  {/* Centered icon */}
                  <div className="relative">{project.icon}</div>

                  {/* Category badge on image */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getCategoryBadgeColor(project.category)}`}
                    >
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5 md:p-6">
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-navy">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-gray-200 text-base md:text-lg mb-8 leading-relaxed">
              Contact us for a free consultation and let us bring your vision to
              life.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white font-semibold py-3.5 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Get a Free Quote
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
