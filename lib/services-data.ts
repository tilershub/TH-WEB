export interface ServiceInfo {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  features: string[];
  icon: string;
}

export const services: ServiceInfo[] = [
  {
    slug: "bathrooms",
    name: "Bathrooms",
    shortDescription: "Complete bathroom renovations with modern designs and premium fixtures.",
    description: "Transform your bathroom into a luxurious retreat. From complete remodels to simple upgrades, our expert team handles tile installation, vanity fitting, shower enclosures, bathtub installation, and all finishing touches to create the bathroom of your dreams.",
    features: [
      "Full bathroom renovations",
      "Tile installation (floor & wall)",
      "Shower enclosure fitting",
      "Vanity and cabinet installation",
      "Bathtub installation",
      "Bathroom fixture upgrades",
    ],
    icon: "droplet",
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    shortDescription: "Modern kitchen designs with functional layouts and quality finishes.",
    description: "Create the heart of your home with our kitchen design and renovation services. We handle everything from cabinet installation and countertop fitting to backsplash tiling and appliance integration, delivering kitchens that are both beautiful and functional.",
    features: [
      "Kitchen layout design",
      "Cabinet installation",
      "Countertop fitting",
      "Backsplash tiling",
      "Kitchen island construction",
      "Appliance integration",
    ],
    icon: "kitchen",
  },
  {
    slug: "flooring",
    name: "Flooring",
    shortDescription: "Professional flooring solutions from tiles to hardwood and vinyl.",
    description: "Whether you prefer ceramic tiles, porcelain, natural stone, hardwood, or vinyl, we deliver flawless flooring installations. Our team ensures proper subfloor preparation, precise cuts, and seamless finishes for floors that last a lifetime.",
    features: [
      "Ceramic and porcelain tile installation",
      "Natural stone flooring",
      "Hardwood floor installation",
      "Vinyl and laminate flooring",
      "Floor leveling and preparation",
      "Pattern and mosaic layouts",
    ],
    icon: "grid",
  },
  {
    slug: "ceiling",
    name: "Ceiling",
    shortDescription: "Elegant ceiling designs including false ceilings and decorative finishes.",
    description: "Elevate your interiors with our ceiling design and installation services. From modern false ceilings with integrated lighting to decorative plaster work and acoustic panels, we create stunning overhead features that complete your space.",
    features: [
      "False ceiling installation",
      "Gypsum board ceilings",
      "PVC ceiling panels",
      "Integrated lighting design",
      "Decorative ceiling features",
      "Acoustic ceiling solutions",
    ],
    icon: "layers",
  },
  {
    slug: "glass-work",
    name: "Glass Work",
    shortDescription: "Custom glass installations for partitions, doors, and shower enclosures.",
    description: "Add elegance and light to your spaces with our professional glass work services. We design and install glass partitions, frameless shower enclosures, glass railings, mirrors, and decorative glass features that bring a modern touch to any interior.",
    features: [
      "Glass partition walls",
      "Frameless shower enclosures",
      "Glass railing systems",
      "Mirror installation",
      "Glass door fitting",
      "Decorative glass panels",
    ],
    icon: "square",
  },
  {
    slug: "electrical",
    name: "Electrical Works",
    shortDescription: "Complete electrical installations and wiring for residential projects.",
    description: "Our licensed electricians handle all aspects of residential electrical work. From new wiring installations and panel upgrades to lighting design and smart home integration, we ensure safe, code-compliant electrical systems for your home.",
    features: [
      "Electrical wiring and rewiring",
      "Lighting design and installation",
      "Switchboard and panel upgrades",
      "Smart home wiring",
      "Power outlet installation",
      "Safety inspections",
    ],
    icon: "zap",
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    shortDescription: "Reliable plumbing installations and repairs for kitchens and bathrooms.",
    description: "From new plumbing installations to pipe replacements and fixture upgrades, our experienced plumbers deliver reliable solutions. We handle water supply systems, drainage, hot water installations, and all bathroom and kitchen plumbing needs.",
    features: [
      "New plumbing installations",
      "Pipe replacement and repair",
      "Water heater installation",
      "Drainage systems",
      "Fixture installation",
      "Leak detection and repair",
    ],
    icon: "wrench",
  },
  {
    slug: "waterproofing",
    name: "Waterproofing",
    shortDescription: "Professional waterproofing solutions to protect your home from moisture.",
    description: "Protect your investment with our comprehensive waterproofing services. We apply proven waterproofing systems to bathrooms, roofs, basements, balconies, and foundations, preventing water damage and ensuring the longevity of your property.",
    features: [
      "Bathroom waterproofing",
      "Roof waterproofing",
      "Basement waterproofing",
      "Balcony and terrace sealing",
      "Foundation waterproofing",
      "Damp proofing treatments",
    ],
    icon: "shield",
  },
];

export function getServiceBySlug(slug: string): ServiceInfo | undefined {
  return services.find((s) => s.slug === slug);
}
