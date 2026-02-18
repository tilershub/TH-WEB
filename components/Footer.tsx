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
    <footer className="border-t border-taupe-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <span className="text-charcoal tracking-[0.2em] text-sm font-semibold uppercase">Tilershub</span>
            <p className="mt-4 text-sm text-charcoal-muted leading-relaxed">
              Thoughtful renovation and interior design across Sri Lanka.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link className="text-sm text-charcoal-muted hover:text-charcoal transition-colors" href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link className="text-charcoal-muted hover:text-charcoal transition-colors" href="/about">About</Link></li>
              <li><Link className="text-charcoal-muted hover:text-charcoal transition-colors" href="/portfolio">Portfolio</Link></li>
              <li><Link className="text-charcoal-muted hover:text-charcoal transition-colors" href="/blog">Blog</Link></li>
              <li><Link className="text-charcoal-muted hover:text-charcoal transition-colors" href="/guides">Guides</Link></li>
              <li><Link className="text-charcoal-muted hover:text-charcoal transition-colors" href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-charcoal-muted mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-charcoal-muted">
              <li>Colombo, Sri Lanka</li>
              <li>info@tilershub.com</li>
              <li>+94 11 234 5678</li>
            </ul>
            <div className="mt-6 flex gap-3 text-sm">
              <Link className="text-charcoal-muted hover:text-charcoal transition-colors" href="/privacy">Privacy</Link>
              <span className="text-taupe-200">·</span>
              <Link className="text-charcoal-muted hover:text-charcoal transition-colors" href="/terms">Terms</Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-taupe-100 text-xs text-charcoal-muted">
          &copy; {year} Tilershub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
