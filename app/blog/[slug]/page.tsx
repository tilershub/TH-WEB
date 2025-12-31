import Link from "next/link";
import { notFound } from "next/navigation";

const BLOG_POSTS: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}> = {
  "how-to-choose-tiles": {
    title: "How to Choose the Right Tiles for Your Home",
    category: "Tips",
    date: "Dec 28, 2024",
    readTime: "5 min read",
    content: [
      "Choosing the right tiles for your home is one of the most important decisions you'll make during renovation. The right tiles can transform a space, adding both beauty and functionality.",
      "## Consider the Room's Purpose",
      "Different rooms have different requirements. Bathrooms and kitchens need water-resistant tiles with good slip resistance. Living rooms can accommodate more decorative options, while high-traffic areas like hallways need durable, scratch-resistant tiles.",
      "## Understanding Tile Materials",
      "**Ceramic Tiles**: Affordable and versatile, perfect for walls and low-traffic floors. Easy to cut and install.",
      "**Porcelain Tiles**: Denser and more durable than ceramic. Ideal for high-traffic areas and outdoor use. More water-resistant.",
      "**Natural Stone**: Marble, granite, and slate offer unique beauty but require more maintenance and sealing.",
      "**Vitrified Tiles**: Popular in Sri Lanka, these tiles are highly durable, low-maintenance, and come in various designs.",
      "## Size Matters",
      "Larger tiles (60x60cm or bigger) make spaces appear larger and have fewer grout lines to clean. Smaller tiles (30x30cm or mosaic) work well for detailed patterns and curved surfaces.",
      "## Color and Pattern Tips",
      "Light colors make rooms feel spacious and bright. Dark tiles add drama but can make spaces feel smaller. Consider your lighting conditions and furniture when choosing colors.",
      "## Budget Considerations",
      "In Sri Lanka, tile prices range from Rs. 80 to Rs. 500+ per square foot depending on material and brand. Always buy 10-15% extra for cutting waste and future repairs.",
    ],
  },
  "tile-trends-2025": {
    title: "Top 5 Tile Trends for 2025",
    category: "Trends",
    date: "Dec 25, 2024",
    readTime: "4 min read",
    content: [
      "Stay ahead of the curve with these exciting tile trends that will dominate home interiors in 2025.",
      "## 1. Large Format Tiles",
      "Tiles measuring 120x60cm or even 120x120cm are becoming increasingly popular. They create a seamless, modern look with minimal grout lines. Perfect for open-plan living spaces.",
      "## 2. Natural Stone Look",
      "Tiles that mimic marble, travertine, and other natural stones continue to trend. Modern printing technology makes these nearly indistinguishable from real stone at a fraction of the cost.",
      "## 3. Terrazzo Revival",
      "This classic material is making a major comeback. Modern terrazzo tiles come in bold colors and patterns, perfect for adding character to floors and walls.",
      "## 4. Textured and 3D Tiles",
      "Walls are getting more interesting with tiles featuring raised patterns, wave effects, and geometric textures. These create stunning feature walls in bathrooms and living areas.",
      "## 5. Sustainable Materials",
      "Eco-conscious homeowners are choosing tiles made from recycled materials. Many manufacturers now offer beautiful options that are both stylish and environmentally responsible.",
      "## Color Trends",
      "Earthy tones like terracotta, sage green, and warm beige are replacing cool grays. Bold accent colors in deep blues and forest greens are also popular for feature areas.",
    ],
  },
  "tiling-cost-guide": {
    title: "Cost of Tiling in Sri Lanka: Complete Price Guide",
    category: "Pricing",
    date: "Dec 22, 2024",
    readTime: "7 min read",
    content: [
      "Understanding tiling costs helps you budget accurately and avoid surprises. Here's a comprehensive guide to tiling prices in Sri Lanka.",
      "## Tile Material Costs (per sq ft)",
      "- Basic ceramic tiles: Rs. 80 - 150",
      "- Mid-range vitrified tiles: Rs. 150 - 300",
      "- Premium porcelain tiles: Rs. 300 - 500",
      "- Imported designer tiles: Rs. 500 - 1,500+",
      "- Natural stone (granite, marble): Rs. 400 - 2,000+",
      "## Labor Costs",
      "Professional tiler rates vary by region and experience:",
      "- Basic floor tiling: Rs. 50 - 80 per sq ft",
      "- Wall tiling: Rs. 60 - 100 per sq ft",
      "- Complex patterns/designs: Rs. 100 - 150 per sq ft",
      "- Bathroom complete: Rs. 80 - 120 per sq ft",
      "## Additional Costs",
      "**Tile adhesive**: Rs. 1,500 - 3,000 per 20kg bag (covers ~40 sq ft)",
      "**Grout**: Rs. 500 - 1,500 per kg",
      "**Waterproofing**: Rs. 50 - 100 per sq ft for bathrooms",
      "**Screed/leveling**: Rs. 30 - 50 per sq ft if needed",
      "## Sample Project Costs",
      "**Small bathroom (40 sq ft)**: Rs. 25,000 - 50,000 total",
      "**Kitchen floor (100 sq ft)**: Rs. 30,000 - 60,000 total",
      "**Living room (300 sq ft)**: Rs. 80,000 - 150,000 total",
      "## Tips to Save Money",
      "- Get multiple quotes from tilers on Tilers Hub",
      "- Buy tiles during sales (Avurudu, Christmas)",
      "- Consider local brands - quality has improved significantly",
      "- Plan carefully to minimize cutting waste",
    ],
  },
  "diy-vs-professional": {
    title: "DIY vs Professional Tiling: What You Should Know",
    category: "Guides",
    date: "Dec 18, 2024",
    readTime: "6 min read",
    content: [
      "Should you tackle that tiling project yourself or hire a professional? Let's break down when each option makes sense.",
      "## When to DIY",
      "**Simple backsplash**: A small kitchen backsplash with basic square tiles is manageable for beginners.",
      "**Small repairs**: Replacing a few cracked tiles in an existing floor can be done with basic skills.",
      "**Non-critical areas**: Utility rooms, garages, or outdoor areas where perfection isn't essential.",
      "## When to Hire a Professional",
      "**Bathroom tiling**: Waterproofing and drainage requirements make this high-stakes work.",
      "**Large areas**: Living rooms and bedrooms need consistent, level installation.",
      "**Complex patterns**: Diagonal layouts, borders, and intricate designs require experience.",
      "**Natural stone**: Expensive materials need expert handling to avoid costly mistakes.",
      "## DIY Requirements",
      "If you decide to DIY, you'll need:",
      "- Tile cutter (manual or electric)",
      "- Notched trowel",
      "- Tile spacers",
      "- Level and measuring tape",
      "- Grout float",
      "- Bucket and sponge",
      "## Hidden Costs of DIY",
      "Consider that mistakes can be expensive. A botched tile job may need to be completely redone by a professional, costing more than hiring one initially.",
      "## Finding the Right Professional",
      "Use Tilers Hub to find verified professionals in your area. Compare quotes, review portfolios, and read reviews before making your decision.",
    ],
  },
  "essential-tiling-tools": {
    title: "Essential Tools Every Tiler Needs",
    category: "For Tilers",
    date: "Dec 15, 2024",
    readTime: "5 min read",
    content: [
      "Whether you're starting your tiling career or upgrading your toolkit, here are the essential tools every professional tiler needs.",
      "## Cutting Tools",
      "**Manual tile cutter**: Essential for straight cuts on ceramic and porcelain tiles. Invest in a quality one - cheap cutters cause chipping.",
      "**Wet tile saw**: For large format tiles, thick porcelain, and natural stone. A must for professional work.",
      "**Angle grinder**: With a diamond blade, perfect for L-cuts, curves, and adjustments.",
      "## Measuring and Layout",
      "**Laser level**: Ensures perfectly level lines across walls and floors. Worth the investment.",
      "**Spirit levels**: Various sizes for checking individual tiles and overall flatness.",
      "**Tape measure**: Metal tape for accuracy. Get one with metric and imperial markings.",
      "**Chalk line**: For marking straight guidelines on large surfaces.",
      "## Installation Tools",
      "**Notched trowels**: Different sizes for different tile formats. Larger tiles need larger notches.",
      "**Rubber mallet**: For setting tiles without cracking them.",
      "**Tile spacers**: Various sizes from 1mm to 5mm for consistent grout lines.",
      "**Tile leveling system**: Clips and wedges ensure a flat, lippage-free finish.",
      "## Finishing Tools",
      "**Grout float**: Rubber-faced for pushing grout into joints.",
      "**Sponge and bucket**: For cleaning excess grout and wiping down tiles.",
      "**Silicone gun**: For waterproof sealing in wet areas.",
      "## Safety Equipment",
      "Never forget safety glasses, dust mask, knee pads, and work gloves. Your health is your most important asset.",
    ],
  },
  "floor-preparation": {
    title: "How to Prepare Your Floors Before Tiling",
    category: "Tips",
    date: "Dec 12, 2024",
    readTime: "4 min read",
    content: [
      "Proper floor preparation is the foundation of a successful tile installation. Skip this step and you risk cracked tiles, uneven surfaces, and costly repairs.",
      "## Step 1: Assess the Subfloor",
      "Check what you're working with:",
      "- Concrete: Best for tiling, but check for cracks and levelness",
      "- Existing tiles: Can tile over if firmly attached and level",
      "- Wood: Needs cement backer board to prevent movement",
      "## Step 2: Check for Level",
      "Use a long spirit level or laser level to check the floor. Maximum variation should be 3mm over 3 meters. Any more and you'll need to level it.",
      "## Step 3: Clean Thoroughly",
      "Remove all dust, debris, oil, paint, and loose material. The surface must be clean for adhesive to bond properly. Sweep, then mop with water.",
      "## Step 4: Apply Screed if Needed",
      "Self-leveling screed is perfect for uneven floors. Mix according to instructions, pour, and let it find its level. Allow proper drying time (usually 24-48 hours).",
      "## Step 5: Prime the Surface",
      "Apply a suitable primer to ensure good adhesion. This is especially important for smooth concrete or absorbent surfaces.",
      "## Step 6: Plan Your Layout",
      "Before applying adhesive, dry-lay tiles to plan the pattern. Start from the center and work outward. Adjust to avoid small cuts at edges.",
      "## Common Mistakes to Avoid",
      "- Rushing the preparation",
      "- Not checking for level",
      "- Tiling over damp surfaces",
      "- Ignoring cracks in the subfloor",
    ],
  },
  "tile-sizes-patterns": {
    title: "Understanding Tile Sizes and Patterns",
    category: "Guides",
    date: "Dec 8, 2024",
    readTime: "5 min read",
    content: [
      "The size and pattern of your tiles dramatically affect how a room looks and feels. Here's what you need to know.",
      "## Common Tile Sizes",
      "**Small (up to 30x30cm)**: Traditional look, good for small spaces and detailed patterns. More grout lines to clean.",
      "**Medium (40x40cm to 60x60cm)**: Versatile, suitable for most rooms. Balance of modern and practical.",
      "**Large (80x80cm and above)**: Contemporary, minimal grout lines, makes spaces feel bigger. Needs very level floors.",
      "**Rectangular (30x60cm, 60x120cm)**: Modern look, can be laid in various patterns. Creates visual interest.",
      "## Popular Laying Patterns",
      "**Grid/Stack**: Tiles aligned in rows and columns. Simple, modern, shows imperfections easily.",
      "**Brick/Offset**: Each row offset by half a tile. Classic look, hides imperfections better.",
      "**Diagonal**: Tiles at 45 degrees. Makes rooms feel larger, requires more cutting.",
      "**Herringbone**: Rectangular tiles in V-shape. Elegant, traditional, labor-intensive.",
      "**Chevron**: Similar to herringbone but tiles meet at a point. Very trendy.",
      "## Size Tips for Different Rooms",
      "**Small bathrooms**: Medium tiles (40x40cm or 30x60cm) work best. Large tiles can look odd.",
      "**Open living areas**: Large format tiles (60x60cm or bigger) create seamless, spacious feel.",
      "**Kitchens**: Medium to large tiles for floors, smaller tiles for backsplash details.",
      "## Grout Line Considerations",
      "Larger tiles need minimal grout lines (2-3mm). Smaller tiles look better with wider grout (3-5mm). Grout color affects the overall look significantly.",
    ],
  },
  "bathroom-waterproofing": {
    title: "Bathroom Waterproofing: A Complete Guide",
    category: "Tips",
    date: "Dec 5, 2024",
    readTime: "6 min read",
    content: [
      "Waterproofing is the most critical step in bathroom tiling. Get it wrong and you risk water damage, mold, and structural problems.",
      "## Why Waterproofing Matters",
      "Tiles and grout are NOT waterproof. Water can seep through and damage the structure beneath. Proper waterproofing creates a barrier that protects your home.",
      "## Wet Areas Explained",
      "Building codes define 'wet areas' - zones that need waterproofing:",
      "- Shower floors and walls (up to 1.8m high)",
      "- Around bathtubs (to splash height)",
      "- Floor areas around toilets and vanities",
      "## Types of Waterproofing",
      "**Liquid membrane**: Painted on, flexible, easy to apply. Most common for DIY and professionals.",
      "**Sheet membrane**: Pre-formed sheets bonded to surface. Excellent for floors.",
      "**Cementitious coating**: Mixed and applied like render. Durable but less flexible.",
      "## Application Steps",
      "1. Prepare surface - clean, dry, and smooth",
      "2. Apply primer if required",
      "3. Reinforce corners and joints with tape",
      "4. Apply first coat of membrane",
      "5. Allow to dry (usually 4-6 hours)",
      "6. Apply second coat at right angles to first",
      "7. Allow full curing (24-48 hours)",
      "8. Test before tiling (water test)",
      "## Professional or DIY?",
      "Given the importance of waterproofing, hiring a professional is recommended for most homeowners. The cost of fixing water damage far exceeds the cost of proper installation.",
      "## Signs of Failed Waterproofing",
      "- Damp patches on walls/ceiling below bathroom",
      "- Musty smell",
      "- Peeling paint",
      "- Loose or hollow-sounding tiles",
    ],
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-medium mb-6 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <article className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-100">
            <span>{post.date}</span>
            <span>By Tilers Hub Team</span>
          </div>

          <div className="prose prose-gray max-w-none">
            {post.content.map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xl font-bold text-navy mt-8 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <p key={i} className="font-semibold text-gray-800 mt-4">
                    {paragraph.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <li key={i} className="text-gray-700 ml-4 list-disc">
                    {paragraph.replace("- ", "")}
                  </li>
                );
              }
              if (paragraph.includes("**")) {
                const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">
                    {parts.map((part, j) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={j}>{part.replace(/\*\*/g, "")}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
              return (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-navy mb-4">Need Help With Your Tiling Project?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/post-task"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                Post a Task
              </Link>
              <Link
                href="/tilers"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary font-medium py-3 px-6 rounded-xl hover:bg-primary/5 transition-colors"
              >
                Find a Tiler
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
