export type BlogPostDisplay = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
};

export type BlogPostFull = BlogPostDisplay & {
  content: string[];
};

export type GuideDisplay = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  steps: number;
};

export type GuideFull = Omit<GuideDisplay, "steps"> & {
  steps: { title: string; content: string[] }[];
};

const STATIC_BLOG_POSTS: BlogPostFull[] = [
  {
    id: "bathroom-renovation-guide",
    slug: "bathroom-renovation-guide",
    title: "Complete Guide to Bathroom Renovation in Sri Lanka",
    excerpt: "Everything you need to know about planning and executing a bathroom renovation, from budgeting to choosing fixtures.",
    category: "Bathrooms",
    date: "Jan 15, 2026",
    readTime: "7 min read",
    content: [
      "A bathroom renovation is one of the most impactful upgrades you can make to your home. Whether you're modernizing an outdated space or creating a luxurious retreat, proper planning is essential.",
      "## Setting Your Budget",
      "In Sri Lanka, a standard bathroom renovation typically ranges from Rs. 300,000 to Rs. 1,500,000 depending on the scope. Premium fixtures, imported tiles, and custom vanities will push costs higher. Always add a 15-20% buffer for unexpected expenses.",
      "## Choosing the Right Fixtures",
      "**Toilets**: Wall-hung toilets save space and are easier to clean. Brands like Rocell and American Standard offer excellent options locally.",
      "**Vanities**: Consider a floating vanity for a modern look. Ensure adequate storage for your needs.",
      "**Showers**: Frameless glass enclosures create an open, luxurious feel. Rain showerheads are increasingly popular.",
      "## Tile Selection",
      "Porcelain tiles with low water absorption are ideal for bathrooms. Consider larger format tiles (60x60cm or bigger) for a seamless look with fewer grout lines. Anti-slip finishes are essential for floor tiles.",
      "## Waterproofing",
      "Never compromise on waterproofing. All wet areas must be properly waterproofed before tiling. This includes shower floors, walls up to at least 1.8m, and the floor area around toilets and vanities.",
      "## Ventilation",
      "Good ventilation prevents mold and moisture damage. Install an exhaust fan rated for your bathroom size. Natural ventilation through windows is a bonus but not always sufficient.",
      "## Working with Professionals",
      "A bathroom renovation involves plumbing, electrical, waterproofing, tiling, and fixture installation. Working with an experienced team like TILERSHUB ensures all trades are coordinated properly for a seamless result.",
    ],
  },
  {
    id: "kitchen-design-trends",
    slug: "kitchen-design-trends",
    title: "Kitchen Design Trends for 2026",
    excerpt: "Discover the latest kitchen design trends including modern layouts, smart storage, and premium finishes.",
    category: "Kitchen",
    date: "Jan 10, 2026",
    readTime: "5 min read",
    content: [
      "The kitchen has evolved from a purely functional space to the heart of the home. Here are the design trends shaping kitchens in 2026.",
      "## 1. Open-Concept Layouts",
      "Open kitchens that flow into living and dining areas continue to dominate. Islands with seating serve as both prep stations and social hubs.",
      "## 2. Natural Stone Countertops",
      "Granite and quartz countertops in earthy tones are trending. They offer durability and timeless beauty that complements both modern and traditional designs.",
      "## 3. Smart Storage Solutions",
      "Pull-out pantries, corner carousels, and drawer organizers maximize every inch. Vertical storage and ceiling-height cabinets make the most of available space.",
      "## 4. Backsplash as a Feature",
      "Bold, patterned backsplashes are making a statement. From geometric tiles to natural stone slabs, the backsplash has become a key design element.",
      "## 5. Integrated Appliances",
      "Built-in ovens, concealed refrigerators, and hidden dishwashers create clean, streamlined looks. The trend is toward appliances that blend seamlessly with cabinetry.",
      "## 6. Warm Colour Palettes",
      "Cool greys are giving way to warm tones — cream, sage green, terracotta, and warm wood finishes. These create inviting spaces that feel comfortable and lived-in.",
      "## The Sri Lankan Context",
      "Sri Lankan kitchens have unique needs — space for rice cookers, spice storage, and heavy-duty cooking. A good design balances international trends with local practicality.",
    ],
  },
  {
    id: "choosing-floor-tiles",
    slug: "choosing-floor-tiles",
    title: "How to Choose the Right Floor Tiles for Your Home",
    excerpt: "A comprehensive guide to selecting the perfect tiles for different areas — from porcelain to natural stone.",
    category: "Flooring",
    date: "Jan 5, 2026",
    readTime: "6 min read",
    content: [
      "Floor tiles set the foundation for your entire interior design. The right choice enhances your space while providing years of durability and easy maintenance.",
      "## Understanding Tile Types",
      "**Porcelain Tiles**: Dense, durable, and low water absorption. Ideal for high-traffic areas, bathrooms, and outdoor spaces. Available in a wide range of finishes including wood-look and marble-look.",
      "**Ceramic Tiles**: More affordable than porcelain, suitable for walls and light-traffic floors. Easier to cut and install.",
      "**Natural Stone**: Marble, granite, and travertine offer unmatched beauty but require sealing and more maintenance.",
      "**Vitrified Tiles**: Popular in Sri Lanka for their durability and variety. Available in polished, matt, and anti-skid finishes.",
      "## Size Considerations",
      "Larger tiles (60x60cm, 80x80cm, or 60x120cm) create a sense of spaciousness with minimal grout lines. However, they need very level floors. Smaller tiles work better in compact spaces like bathrooms.",
      "## Room-by-Room Guide",
      "**Living areas**: Large format porcelain or vitrified tiles in neutral tones.",
      "**Bedrooms**: Wood-look tiles for warmth without the maintenance of real wood.",
      "**Bathrooms**: Anti-slip porcelain tiles, typically smaller format for drainage slopes.",
      "**Kitchen**: Durable, stain-resistant tiles that are easy to clean.",
      "**Outdoor**: Textured, anti-slip tiles with high weather resistance.",
      "## Colour and Pattern",
      "Light colours make rooms feel larger and brighter. Dark tiles add drama but show dust more easily. Consider your lighting conditions, furniture style, and the flow between rooms when selecting colours.",
      "## Getting Professional Help",
      "Choosing tiles is just the beginning — proper installation is equally important. At TILERSHUB, we help you select the perfect tiles and ensure flawless installation.",
    ],
  },
  {
    id: "false-ceiling-benefits",
    slug: "false-ceiling-benefits",
    title: "Benefits of False Ceiling Installation",
    excerpt: "Learn how false ceilings can transform your interiors with improved aesthetics, lighting, and acoustics.",
    category: "Ceiling",
    date: "Dec 28, 2025",
    readTime: "4 min read",
    content: [
      "False ceilings (also called drop ceilings or suspended ceilings) are one of the most effective ways to transform the look and feel of any room.",
      "## What is a False Ceiling?",
      "A false ceiling is a secondary ceiling hung below the main structural ceiling. It creates a gap that can hide wiring, ductwork, and plumbing while providing a clean, finished look.",
      "## Key Benefits",
      "**Enhanced Aesthetics**: Create multi-level designs, cove lighting, and architectural interest. Modern false ceilings can make ordinary rooms look extraordinary.",
      "**Improved Lighting**: Recessed lights, LED strips, and cove lighting integrated into false ceilings provide ambient, task, and accent lighting options.",
      "**Better Acoustics**: Acoustic panels in false ceilings reduce echo and noise, making rooms more comfortable for conversation and entertainment.",
      "**Thermal Insulation**: The air gap between the false ceiling and main ceiling provides insulation, helping to keep rooms cooler — particularly important in Sri Lanka's climate.",
      "**Concealed Services**: Hide electrical wiring, AC ducts, plumbing pipes, and fire sprinklers for a clean, uncluttered look.",
      "## Popular Materials",
      "- Gypsum board — versatile, smooth finish, easy to paint",
      "- PVC panels — moisture-resistant, ideal for bathrooms and kitchens",
      "- Mineral fibre — excellent acoustic properties for offices",
      "- Wood — adds warmth and natural beauty to living spaces",
      "## Design Ideas",
      "From simple flat panels with recessed lights to elaborate multi-layered designs with cove lighting, the possibilities are endless. Consult with our design team at TILERSHUB to explore options that suit your space and budget.",
    ],
  },
  {
    id: "waterproofing-importance",
    slug: "waterproofing-importance",
    title: "Why Waterproofing is Essential for Your Home",
    excerpt: "Protect your investment with proper waterproofing. Learn about common problem areas and professional solutions.",
    category: "Waterproofing",
    date: "Dec 22, 2025",
    readTime: "5 min read",
    content: [
      "Water damage is one of the most common and expensive problems homeowners face. Proper waterproofing is not a luxury — it's a necessity for protecting your home's structure and your family's health.",
      "## Common Problem Areas",
      "**Bathrooms and kitchens**: Constant exposure to water makes these the most vulnerable areas.",
      "**Roofs and terraces**: Sri Lanka's heavy monsoon rains can penetrate even small cracks.",
      "**Basements**: Ground-level moisture seepage can cause significant structural damage.",
      "**External walls**: Rain-driven moisture can penetrate walls, causing damp patches and paint peeling.",
      "## Signs of Water Damage",
      "- Damp patches or water stains on walls and ceilings",
      "- Peeling or bubbling paint",
      "- Musty odours indicating mold growth",
      "- Cracking or crumbling plaster",
      "- Efflorescence (white salt deposits) on walls",
      "## Types of Waterproofing",
      "**Liquid membrane**: Applied like paint, creating a seamless waterproof layer. Flexible and easy to apply to complex shapes.",
      "**Cementitious coating**: Mixed and applied like render. Durable and suitable for internal wet areas.",
      "**Sheet membrane**: Pre-formed sheets bonded to surfaces. Excellent for roofs and terraces.",
      "**Injection waterproofing**: For existing structures where external access is limited.",
      "## Prevention is Better Than Cure",
      "Waterproofing during construction costs a fraction of remedial work. If you're building new or renovating, make waterproofing a priority. At TILERSHUB, we provide comprehensive waterproofing solutions for all areas of your home.",
    ],
  },
  {
    id: "glass-partitions-modern-homes",
    slug: "glass-partitions-modern-homes",
    title: "Glass Partitions for Modern Homes and Offices",
    excerpt: "How glass work can add elegance, light, and a sense of space to your interiors without compromising privacy.",
    category: "Glass Work",
    date: "Dec 18, 2025",
    readTime: "4 min read",
    content: [
      "Glass has become one of the most sought-after materials in modern interior design. From shower enclosures to room dividers, glass adds elegance while maximizing natural light.",
      "## Types of Glass Work",
      "**Shower enclosures**: Frameless glass enclosures are the gold standard for modern bathrooms. They make spaces feel larger and are easy to clean.",
      "**Room dividers**: Glass partitions separate spaces without blocking light. Perfect for creating home offices or separating living and dining areas.",
      "**Balustrades and railings**: Glass railings on staircases and balconies provide safety without obstructing views.",
      "**Splashbacks**: Toughened glass kitchen splashbacks offer a sleek, hygienic alternative to tiles.",
      "## Glass Options",
      "**Clear glass**: Maximum transparency and light transmission.",
      "**Frosted glass**: Provides privacy while allowing light through.",
      "**Tinted glass**: Reduces glare and heat, available in various colours.",
      "**Textured glass**: Decorative patterns that add visual interest.",
      "## Safety Considerations",
      "All glass used in structural and safety-critical applications should be toughened (tempered) or laminated. Toughened glass is 4-5 times stronger than regular glass and breaks into small, safe pieces.",
      "## Maintenance",
      "Glass is remarkably low-maintenance. Regular cleaning with a glass cleaner keeps it sparkling. Anti-fingerprint and easy-clean coatings are available for high-use areas.",
      "## Custom Solutions",
      "Every space is different. TILERSHUB provides custom glass solutions measured and installed to fit your exact requirements, from standard shower screens to bespoke architectural features.",
    ],
  },
  {
    id: "electrical-safety-tips",
    slug: "electrical-safety-tips",
    title: "Electrical Safety Tips for Home Renovations",
    excerpt: "Important electrical considerations when renovating your home, from wiring upgrades to safety inspections.",
    category: "Electrical",
    date: "Dec 12, 2025",
    readTime: "5 min read",
    content: [
      "Electrical work during renovations is not something to take lightly. Poor electrical work can lead to fires, shocks, and costly damage. Here's what every homeowner should know.",
      "## When to Upgrade Wiring",
      "If your home is more than 20 years old, the electrical system may not handle modern demands. Signs you need an upgrade include frequently tripping breakers, flickering lights, warm outlets, and insufficient outlets for your needs.",
      "## Key Safety Requirements",
      "**Circuit breakers**: Ensure your main panel has adequate capacity. Modern homes need 60A or higher.",
      "**Earth leakage protection**: ELCB/RCCB devices are essential for protecting against electric shock, especially in wet areas.",
      "**Proper earthing**: All circuits and metal fittings must be properly earthed.",
      "**Adequate outlets**: Plan sufficient outlets to avoid overloading circuits with extension cords.",
      "## Renovation-Specific Considerations",
      "**Bathrooms**: All electrical work in wet areas must comply with safety zones. Use IP-rated fixtures.",
      "**Kitchens**: Dedicated circuits for heavy appliances (oven, cooktop, dishwasher). GFCI protection near water sources.",
      "**Lighting**: Plan lighting circuits separately. Consider dimmer switches and smart lighting controls.",
      "**Outdoor**: Weatherproof outlets and fixtures rated for outdoor use.",
      "## Why Professional Installation Matters",
      "Electrical work should always be done by qualified electricians. DIY electrical work is dangerous and can void your insurance. At TILERSHUB, our licensed electricians handle all electrical aspects of your renovation safely and to code.",
      "## Getting an Electrical Assessment",
      "Before starting any renovation, get a professional electrical assessment. This identifies existing issues and helps plan the electrical layout for your renovated space.",
    ],
  },
  {
    id: "plumbing-renovation-checklist",
    slug: "plumbing-renovation-checklist",
    title: "Plumbing Renovation Checklist",
    excerpt: "A step-by-step checklist to ensure your plumbing work is done right during bathroom and kitchen renovations.",
    category: "Plumbing",
    date: "Dec 8, 2025",
    readTime: "4 min read",
    content: [
      "Good plumbing is the backbone of any successful bathroom or kitchen renovation. This checklist ensures nothing gets overlooked.",
      "## Pre-Renovation Assessment",
      "- Check the condition of existing pipes and connections",
      "- Identify the water supply points and drainage routes",
      "- Test water pressure — low pressure may need a booster pump",
      "- Locate the main shutoff valve",
      "## Planning Phase",
      "**Layout**: Finalise the position of all fixtures (toilets, sinks, showers, taps) before any work begins. Moving plumbing points after tiling is extremely costly.",
      "**Materials**: Choose quality pipes and fittings. CPVC for hot water, PVC for drainage. Avoid mixing materials without proper adapters.",
      "**Hot water system**: Plan your geyser/water heater location and capacity based on usage needs.",
      "## During Installation",
      "- Ensure proper pipe sizing for adequate water flow",
      "- Install shut-off valves at each fixture point for easy maintenance",
      "- Maintain correct drainage slopes (minimum 1% fall)",
      "- Pressure test all connections before closing up walls",
      "- Photograph pipe locations before tiling for future reference",
      "## Post-Installation Checks",
      "- Test all fixtures for leaks",
      "- Verify hot and cold water connections are correct",
      "- Check drainage speed at all points",
      "- Confirm all shut-off valves work properly",
      "## Professional Plumbing Services",
      "Plumbing mistakes can cause thousands of rupees in water damage. TILERSHUB's experienced plumbers handle everything from basic fixtures to complete replumbing, coordinated with tiling and waterproofing for a seamless renovation.",
    ],
  },
];

const STATIC_GUIDES: GuideFull[] = [
  {
    id: "prepare-for-renovation",
    slug: "prepare-for-renovation",
    title: "How to Prepare Your Home for Renovation",
    description: "Essential steps to take before the renovation crew arrives",
    icon: "home",
    steps: [
      {
        title: "Define Your Scope and Budget",
        content: [
          "Clearly outline what areas of your home will be renovated.",
          "Set a realistic budget with a 15-20% contingency for unexpected costs.",
          "Prioritise must-haves versus nice-to-haves.",
        ],
      },
      {
        title: "Clear the Work Area",
        content: [
          "Remove all furniture, appliances, and personal belongings from renovation areas.",
          "Take down wall hangings, curtains, and fixtures that could be damaged.",
          "Cover nearby furniture and items with dust sheets if they cannot be moved.",
        ],
      },
      {
        title: "Arrange Temporary Facilities",
        content: [
          "If renovating the kitchen, plan for alternative cooking arrangements.",
          "For bathroom renovations, ensure access to another bathroom during work.",
          "Set up a dust barrier between living areas and the work zone.",
        ],
      },
      {
        title: "Ensure Access and Utilities",
        content: [
          "Clear a path from your entrance to the work area for materials and equipment.",
          "Provide parking space for contractor vehicles if possible.",
          "Ensure there is access to water and electricity for the work crew.",
        ],
      },
      {
        title: "Final Preparations",
        content: [
          "Confirm the start date, timeline, and daily working hours with your contractor.",
          "Inform neighbours about upcoming work, especially if noise is expected.",
          "Make arrangements for pets and children to be away from the work area.",
          "Have all materials (tiles, fixtures, paint) ready if you are supplying them.",
        ],
      },
    ],
  },
  {
    id: "choose-right-materials",
    slug: "choose-right-materials",
    title: "How to Choose the Right Materials",
    description: "Tips for selecting tiles, fixtures, and finishes for your project",
    icon: "sparkle",
    steps: [
      {
        title: "Understand Your Needs",
        content: [
          "Consider the room's purpose — bathrooms need water-resistant materials, kitchens need heat and stain resistance.",
          "Think about maintenance — some materials need regular sealing or special cleaning.",
          "Factor in durability — high-traffic areas need harder-wearing materials.",
        ],
      },
      {
        title: "Research Tile Options",
        content: [
          "Porcelain tiles are the most versatile — durable, water-resistant, available in many styles.",
          "Ceramic tiles are more affordable and suitable for walls and low-traffic floors.",
          "Natural stone offers unique beauty but requires more maintenance.",
          "Visit tile showrooms to see and feel samples in person.",
        ],
      },
      {
        title: "Select Fixtures and Fittings",
        content: [
          "Choose fixtures that match your design style — modern, classic, or transitional.",
          "Consider water-saving fixtures for taps and toilets.",
          "Test handles, knobs, and faucets for comfort and quality feel.",
        ],
      },
      {
        title: "Consider Colour and Finish",
        content: [
          "Collect samples and view them in the actual room with its lighting conditions.",
          "Neutral colours are timeless and easier to update with accessories.",
          "Matt finishes hide imperfections better; glossy finishes reflect light.",
        ],
      },
      {
        title: "Check Quality and Warranty",
        content: [
          "Look for reputable brands with proper warranties.",
          "Check tile ratings — PEI rating for wear resistance, water absorption percentage.",
          "Ask about batch consistency if ordering large quantities.",
        ],
      },
      {
        title: "Get Expert Advice",
        content: [
          "Consult with your contractor about material suitability for your specific project.",
          "Ask about installation requirements — some materials need special adhesives or preparation.",
          "TILERSHUB can help you select materials that balance quality, aesthetics, and budget.",
        ],
      },
    ],
  },
  {
    id: "budget-planning",
    slug: "budget-planning",
    title: "Renovation Budget Planning Guide",
    description: "Plan your renovation budget effectively and avoid surprises",
    icon: "scale",
    steps: [
      {
        title: "Assess Your Total Budget",
        content: [
          "Determine the maximum amount you can spend on the renovation.",
          "Include a 15-20% contingency fund for unexpected expenses.",
          "Consider financing options if needed.",
        ],
      },
      {
        title: "Break Down Costs by Category",
        content: [
          "Materials (tiles, fixtures, fittings) — typically 40-50% of the budget.",
          "Labour (tiling, plumbing, electrical, painting) — typically 30-40%.",
          "Design and planning — typically 5-10%.",
          "Permits and inspections — if required.",
        ],
      },
      {
        title: "Get Multiple Quotes",
        content: [
          "Request at least 3 detailed quotes from reputable contractors.",
          "Ensure quotes cover the same scope of work for fair comparison.",
          "Be wary of quotes significantly lower than others — quality may suffer.",
        ],
      },
      {
        title: "Prioritise Spending",
        content: [
          "Invest more in structural work (waterproofing, plumbing, electrical) — these are hard to fix later.",
          "Allocate quality materials for high-impact visible areas.",
          "Save on areas that can be upgraded later without major disruption.",
        ],
      },
      {
        title: "Track and Manage Expenses",
        content: [
          "Keep a spreadsheet tracking all expenses against the budget.",
          "Get receipts for all purchases and payments.",
          "Review spending weekly to catch overruns early.",
          "Discuss any changes or additions with your contractor before approving — scope creep is the biggest budget killer.",
        ],
      },
    ],
  },
  {
    id: "bathroom-renovation-steps",
    slug: "bathroom-renovation-steps",
    title: "Bathroom Renovation: Step by Step",
    description: "Everything you need to know about renovating your bathroom",
    icon: "droplet",
    steps: [
      {
        title: "Plan and Design",
        content: [
          "Measure your bathroom and create a layout plan.",
          "Decide on fixture positions (toilet, shower, vanity, bathtub).",
          "Choose your design style, colours, and materials.",
        ],
      },
      {
        title: "Demolition",
        content: [
          "Remove old fixtures, tiles, and fittings carefully.",
          "Inspect the underlying structure for damage or rot.",
          "Dispose of debris properly.",
        ],
      },
      {
        title: "Plumbing Rough-In",
        content: [
          "Install or relocate water supply and drainage pipes.",
          "Set up shower valve, toilet flange, and vanity connections.",
          "Pressure test all connections before closing walls.",
        ],
      },
      {
        title: "Electrical Work",
        content: [
          "Install wiring for lights, exhaust fan, and heated towel rails.",
          "Ensure all wet-area electrical work meets safety codes.",
          "Install earth leakage protection for the bathroom circuit.",
        ],
      },
      {
        title: "Waterproofing",
        content: [
          "Apply waterproof membrane to all wet areas.",
          "Reinforce corners, joints, and penetrations with tape.",
          "Apply two coats and allow full curing before tiling.",
        ],
      },
      {
        title: "Tiling",
        content: [
          "Start with floor tiles, ensuring proper slope to drains.",
          "Install wall tiles from bottom up with consistent spacing.",
          "Cut tiles neatly around fixtures and fittings.",
        ],
      },
      {
        title: "Fixture Installation",
        content: [
          "Install toilet, vanity, shower screen, and accessories.",
          "Connect all plumbing and test for leaks.",
          "Install mirrors, towel rails, and toilet roll holders.",
        ],
      },
      {
        title: "Final Touches",
        content: [
          "Apply silicone sealant at all joints and edges.",
          "Clean all tiles and fixtures thoroughly.",
          "Do a final inspection and test everything before handover.",
        ],
      },
    ],
  },
  {
    id: "kitchen-renovation-steps",
    slug: "kitchen-renovation-steps",
    title: "Kitchen Renovation: Complete Guide",
    description: "Plan and execute your dream kitchen renovation",
    icon: "kitchen",
    steps: [
      {
        title: "Design Your Layout",
        content: [
          "Choose a layout that works for your space — L-shaped, U-shaped, galley, or island.",
          "Follow the kitchen triangle principle (sink, stove, fridge) for efficient workflow.",
          "Plan adequate counter space for food preparation.",
        ],
      },
      {
        title: "Select Cabinetry",
        content: [
          "Choose cabinet material — plywood, MDF, or solid wood.",
          "Plan storage for all your kitchen needs — utensils, appliances, dry goods.",
          "Consider soft-close hinges and pull-out organisers for convenience.",
        ],
      },
      {
        title: "Choose Countertops",
        content: [
          "Granite and quartz are durable and heat-resistant choices.",
          "Consider edge profiles and thickness for your desired look.",
          "Ensure proper support for heavier countertop materials.",
        ],
      },
      {
        title: "Plan Electrical and Plumbing",
        content: [
          "Position outlets for all appliances before tiling.",
          "Dedicated circuits for oven, cooktop, and dishwasher.",
          "Plan sink position with proper drainage access.",
        ],
      },
      {
        title: "Select Tiles and Backsplash",
        content: [
          "Choose durable, easy-to-clean floor tiles.",
          "Select a backsplash that protects walls and adds visual interest.",
          "Consider the overall colour coordination between tiles, cabinets, and countertops.",
        ],
      },
      {
        title: "Install in the Right Order",
        content: [
          "Floor tiles first, then cabinets, then countertops.",
          "Backsplash after cabinets and countertops are in place.",
          "Appliances and final connections last.",
        ],
      },
      {
        title: "Final Inspection",
        content: [
          "Test all appliances and plumbing connections.",
          "Check cabinet doors, drawers, and hardware function properly.",
          "Ensure adequate ventilation with your range hood.",
          "Clean everything thoroughly and enjoy your new kitchen.",
        ],
      },
    ],
  },
  {
    id: "waterproofing-guide",
    slug: "waterproofing-guide",
    title: "Home Waterproofing Guide",
    description: "Protect your home from water damage with proper waterproofing",
    icon: "shield",
    steps: [
      {
        title: "Identify Vulnerable Areas",
        content: [
          "Bathrooms and kitchens — constant water exposure.",
          "Roofs and terraces — exposed to rain and sun.",
          "Basements and foundations — ground moisture seepage.",
          "External walls — rain-driven moisture penetration.",
        ],
      },
      {
        title: "Choose the Right System",
        content: [
          "Liquid membrane for bathrooms and internal wet areas.",
          "Sheet membrane for roofs and terraces.",
          "Cementitious coating for basements and water tanks.",
          "Consult a professional for the best solution for your situation.",
        ],
      },
      {
        title: "Prepare the Surface",
        content: [
          "Clean the surface thoroughly — remove dust, debris, and loose material.",
          "Repair cracks and fill holes with appropriate filler.",
          "Ensure the surface is dry before applying waterproofing.",
        ],
      },
      {
        title: "Apply Waterproofing",
        content: [
          "Follow the manufacturer's instructions precisely.",
          "Reinforce corners, joints, and pipe penetrations with tape or fabric.",
          "Apply multiple coats for complete coverage.",
          "Allow proper curing time between coats and before tiling or covering.",
        ],
      },
      {
        title: "Test and Verify",
        content: [
          "Perform a flood test — fill the area with water for 24-48 hours.",
          "Check for any leaks or seepage in areas below.",
          "Document the waterproofing with photos for future reference.",
          "TILERSHUB provides waterproofing with warranty for your peace of mind.",
        ],
      },
    ],
  },
];

export async function getBlogPosts(): Promise<BlogPostDisplay[]> {
  return STATIC_BLOG_POSTS.map(({ content, ...display }) => display);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getGuides(): Promise<GuideDisplay[]> {
  return STATIC_GUIDES.map(({ steps, ...rest }) => ({
    ...rest,
    steps: steps.length,
  }));
}

export async function getGuideBySlug(slug: string): Promise<GuideFull | null> {
  return STATIC_GUIDES.find((g) => g.slug === slug) ?? null;
}
