import Link from "next/link";

const services = [
  { href: "/services/bathrooms", label: "Bathrooms" },
  { href: "/services/kitchen", label: "Kitchen" },
  { href: "/services/flooring", label: "Flooring" },
  { href: "/services/ceiling", label: "Ceiling" },
  { href: "/services/glass-work", label: "Glass Work" },
  { href: "/services/electrical", label: "Electrical" },
  { href: "/services/plumbing", label: "Plumbing" },
  { href: "/services/waterproofing", label: "Waterproofing" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-bold text-xl tracking-tight">
              <span className="text-white">TILERS</span>
              <span className="text-secondary ml-0.5">HUB</span>
            </div>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              Premium interior design and renovation services in Sri Lanka. Transforming spaces with quality craftsmanship.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider">Services</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.href}>
                  <Link className="text-gray-300 hover:text-white transition-colors" href={s.href}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-gray-300 hover:text-white transition-colors" href="/about">About Us</Link></li>
              <li><Link className="text-gray-300 hover:text-white transition-colors" href="/portfolio">Portfolio</Link></li>
              <li><Link className="text-gray-300 hover:text-white transition-colors" href="/blog">Blog</Link></li>
              <li><Link className="text-gray-300 hover:text-white transition-colors" href="/guides">Guides</Link></li>
              <li><Link className="text-gray-300 hover:text-white transition-colors" href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider">Contact Info</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>Colombo, Sri Lanka</li>
              <li>info@tilershub.com</li>
              <li>+94 11 234 5678</li>
              <li className="pt-2">
                <Link className="text-gray-300 hover:text-white transition-colors" href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link className="text-gray-300 hover:text-white transition-colors" href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-gray-400 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} TILERSHUB. All rights reserved.</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-gray-600 px-3 py-1 text-xs">Licensed &amp; Insured</span>
            <span className="rounded-full border border-gray-600 px-3 py-1 text-xs">Quality Guaranteed</span>
            <span className="rounded-full border border-gray-600 px-3 py-1 text-xs">Free Consultation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
