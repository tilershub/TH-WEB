import Link from "next/link";
import { notFound } from "next/navigation";

const GUIDES: Record<string, {
  title: string;
  description: string;
  steps: { title: string; content: string[] }[];
}> = {
  "prepare-for-tiling": {
    title: "How to Prepare Your Home for Tiling",
    description: "Essential steps to take before the tiler arrives",
    steps: [
      {
        title: "Clear the Area",
        content: [
          "Remove all furniture, appliances, and belongings from the room.",
          "Take down any wall hangings, curtains, or fixtures that might get in the way.",
          "Cover nearby furniture and items with dust sheets if they can't be moved.",
        ],
      },
      {
        title: "Remove Existing Flooring",
        content: [
          "If you're replacing old tiles, discuss with your tiler whether removal is included in the quote.",
          "For other flooring types (vinyl, carpet), remove them completely.",
          "Remove the underlay and any old adhesive residue.",
        ],
      },
      {
        title: "Check the Subfloor",
        content: [
          "Inspect the floor for cracks, holes, or uneven areas.",
          "Note any damp patches or water damage.",
          "Take photos and share with your tiler so they can plan accordingly.",
        ],
      },
      {
        title: "Ensure Access",
        content: [
          "Clear a path from your entrance to the work area.",
          "Provide parking space if possible for the tiler's vehicle.",
          "Make sure there's access to water and electricity.",
        ],
      },
      {
        title: "Final Preparations",
        content: [
          "Have all your tiles, grout, and materials ready if you're supplying them.",
          "Confirm the start time and duration with your tiler.",
          "Make arrangements for pets and children to be away from the work area.",
        ],
      },
    ],
  },
  "choose-right-tiler": {
    title: "How to Choose the Right Tiler",
    description: "Tips for finding and vetting professional tilers",
    steps: [
      {
        title: "Check Their Portfolio",
        content: [
          "Look for photos of completed projects similar to yours.",
          "Pay attention to the quality of edges, grout lines, and pattern alignment.",
          "Ask for before and after photos to see the transformation.",
        ],
      },
      {
        title: "Read Reviews",
        content: [
          "Check reviews on Tilers Hub and other platforms.",
          "Look for consistent positive feedback about quality and professionalism.",
          "Note how they respond to any negative reviews.",
        ],
      },
      {
        title: "Get Multiple Quotes",
        content: [
          "Request at least 3 quotes to compare prices.",
          "Make sure quotes include all costs (labor, materials, preparation).",
          "Be wary of quotes that are significantly lower than others.",
        ],
      },
      {
        title: "Ask the Right Questions",
        content: [
          "How long have you been tiling professionally?",
          "Do you have insurance?",
          "What's included in your quote?",
          "How long will the job take?",
          "Do you clean up after the work?",
        ],
      },
      {
        title: "Check Credentials",
        content: [
          "Verify any certifications or training they claim to have.",
          "Ask for references from recent clients.",
          "Check if they're a registered business.",
        ],
      },
      {
        title: "Trust Your Instincts",
        content: [
          "Good communication is essential - they should respond promptly.",
          "They should be willing to answer all your questions.",
          "A professional tiler will visit your home to quote accurately.",
        ],
      },
    ],
  },
  "post-task-guide": {
    title: "How to Post a Task on Tilers Hub",
    description: "Get the best quotes by creating a detailed task",
    steps: [
      {
        title: "Describe Your Project",
        content: [
          "Choose the type of tiling work you need (floor, wall, bathroom, etc.).",
          "Provide accurate measurements of the area to be tiled.",
          "Mention any special requirements or challenges.",
        ],
      },
      {
        title: "Add Photos",
        content: [
          "Take clear photos of the current state of the area.",
          "Include photos of any problem areas (cracks, uneven surfaces).",
          "If you've chosen tiles, add photos of them too.",
        ],
      },
      {
        title: "Set Your Budget",
        content: [
          "Research average costs for your type of project.",
          "Set a realistic budget range.",
          "Be transparent about whether materials are included.",
        ],
      },
      {
        title: "Review and Post",
        content: [
          "Double-check all details before posting.",
          "Make sure your contact information is correct.",
          "Respond promptly to tilers who submit bids.",
        ],
      },
    ],
  },
  "compare-quotes": {
    title: "How to Compare Tiler Quotes",
    description: "What to look for beyond just the price",
    steps: [
      {
        title: "Understand What's Included",
        content: [
          "Does the quote include tile adhesive and grout?",
          "Is floor preparation (screed, leveling) included?",
          "What about cleanup and waste removal?",
        ],
      },
      {
        title: "Compare Experience Levels",
        content: [
          "More experienced tilers may charge more but deliver better results.",
          "Check their portfolio for similar projects.",
          "Consider their years in business and number of completed jobs.",
        ],
      },
      {
        title: "Check Timeline",
        content: [
          "When can they start the work?",
          "How long will they need to complete it?",
          "Are there any schedule conflicts to consider?",
        ],
      },
      {
        title: "Review Payment Terms",
        content: [
          "What deposit is required?",
          "When is the balance due?",
          "What payment methods do they accept?",
        ],
      },
      {
        title: "Consider Value, Not Just Price",
        content: [
          "The cheapest quote isn't always the best choice.",
          "Factor in quality, reliability, and peace of mind.",
          "A slightly higher quote with better reviews may be worth it.",
        ],
      },
    ],
  },
  "bathroom-renovation": {
    title: "Bathroom Tiling: Complete Guide",
    description: "Everything you need to know about bathroom tiles",
    steps: [
      {
        title: "Plan Your Design",
        content: [
          "Decide on your overall color scheme and style.",
          "Consider using feature walls or accent tiles.",
          "Think about practical aspects like slip resistance.",
        ],
      },
      {
        title: "Choose the Right Tiles",
        content: [
          "Porcelain tiles are best for bathrooms due to low water absorption.",
          "Consider textured tiles for floors to prevent slipping.",
          "Smaller tiles work well in showers for better drainage slopes.",
        ],
      },
      {
        title: "Waterproofing is Critical",
        content: [
          "All wet areas must be properly waterproofed before tiling.",
          "This includes shower floors, walls, and areas around the bathtub.",
          "Professional waterproofing is recommended.",
        ],
      },
      {
        title: "Consider Drainage",
        content: [
          "Shower floors need proper slope toward the drain.",
          "Discuss drainage options with your tiler.",
          "Linear drains are popular for modern, seamless looks.",
        ],
      },
      {
        title: "Plan for Fixtures",
        content: [
          "Decide on toilet, vanity, and shower positions before tiling.",
          "Allow for proper spacing around fixtures.",
          "Consider recessed shelves and niches during planning.",
        ],
      },
      {
        title: "Choose Quality Grout",
        content: [
          "Epoxy grout is best for wet areas - more waterproof and mold-resistant.",
          "Consider darker grout colors that hide staining better.",
          "Silicone should be used in corners and where tiles meet fixtures.",
        ],
      },
      {
        title: "Allow Proper Curing Time",
        content: [
          "Don't use the bathroom for at least 24-48 hours after grouting.",
          "Wait longer before exposing to heavy water use.",
          "Follow your tiler's specific recommendations.",
        ],
      },
      {
        title: "Maintenance Tips",
        content: [
          "Ventilate the bathroom well to prevent mold.",
          "Clean tiles regularly with appropriate cleaners.",
          "Reseal grout annually in high-use areas.",
        ],
      },
    ],
  },
  "kitchen-tiling": {
    title: "Kitchen Tiling: Floor & Backsplash",
    description: "Choose and install the perfect kitchen tiles",
    steps: [
      {
        title: "Choose Durable Floor Tiles",
        content: [
          "Kitchen floors face high traffic and spills.",
          "Porcelain or ceramic tiles with high PEI ratings are ideal.",
          "Avoid highly polished tiles that can be slippery when wet.",
        ],
      },
      {
        title: "Plan Your Backsplash",
        content: [
          "Measure the area between countertop and cabinets.",
          "Consider extending tiles behind the stove and sink.",
          "Choose materials that are easy to clean.",
        ],
      },
      {
        title: "Coordinate with Countertops",
        content: [
          "Choose tiles that complement your countertop material.",
          "Consider neutral tiles that won't clash if you change decor.",
          "Bring countertop samples when choosing tiles.",
        ],
      },
      {
        title: "Consider Grout Color",
        content: [
          "Light grout shows stains more easily in kitchens.",
          "Darker grout is more practical near cooking areas.",
          "Epoxy grout resists staining better than cement grout.",
        ],
      },
      {
        title: "Prepare for Installation",
        content: [
          "Clear countertops and remove items from cabinets.",
          "Cover appliances and floors with protective sheets.",
          "Ensure the tiler has access to water and power.",
        ],
      },
      {
        title: "Aftercare",
        content: [
          "Seal grout if using cement-based products.",
          "Clean spills promptly to prevent staining.",
          "Use cutting boards to protect tiles near prep areas.",
        ],
      },
    ],
  },
  "outdoor-tiling": {
    title: "Outdoor & Patio Tiling Guide",
    description: "Weather-resistant options for outdoor spaces",
    steps: [
      {
        title: "Choose Weather-Resistant Tiles",
        content: [
          "Porcelain tiles with low water absorption (<0.5%) are best.",
          "Look for frost-resistant ratings if temperatures drop.",
          "Avoid natural stone that's porous unless properly sealed.",
        ],
      },
      {
        title: "Consider Slip Resistance",
        content: [
          "Outdoor tiles must have good grip when wet.",
          "Look for tiles rated R10 or higher for outdoor use.",
          "Textured surfaces are safer than smooth ones.",
        ],
      },
      {
        title: "Prepare the Base",
        content: [
          "Outdoor tiles need a solid concrete base.",
          "Ensure proper drainage with a slight slope away from the house.",
          "Fix any cracks in existing concrete before tiling.",
        ],
      },
      {
        title: "Use Outdoor-Grade Materials",
        content: [
          "Use flexible, outdoor-rated tile adhesive.",
          "Choose grout designed for external use.",
          "Allow for expansion joints to prevent cracking.",
        ],
      },
      {
        title: "Maintenance for Longevity",
        content: [
          "Sweep regularly to remove debris.",
          "Pressure wash annually to remove buildup.",
          "Reapply sealant as recommended by the manufacturer.",
        ],
      },
    ],
  },
  "tile-maintenance": {
    title: "How to Maintain Your Tiles",
    description: "Keep your tiles looking new for years",
    steps: [
      {
        title: "Daily Cleaning",
        content: [
          "Sweep or vacuum floors regularly to remove grit.",
          "Wipe up spills immediately to prevent staining.",
          "Use doormats to reduce dirt tracked onto tiles.",
        ],
      },
      {
        title: "Weekly Deep Clean",
        content: [
          "Mop with warm water and pH-neutral cleaner.",
          "Avoid harsh chemicals that can damage grout.",
          "Use a soft brush to clean textured tiles.",
        ],
      },
      {
        title: "Grout Care",
        content: [
          "Clean grout with a grout brush and appropriate cleaner.",
          "Reseal grout annually in wet areas.",
          "Address mold promptly with mold-killing products.",
        ],
      },
      {
        title: "Repair and Replace",
        content: [
          "Fix cracked tiles promptly to prevent water damage.",
          "Keep spare tiles for future repairs.",
          "Re-grout areas where grout is crumbling or missing.",
        ],
      },
    ],
  },
};

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = GUIDES[params.slug];

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/guides" className="inline-flex items-center gap-2 text-primary font-medium mb-6 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Guides
        </Link>

        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              {guide.steps.length} Steps
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">{guide.title}</h1>
          <p className="text-gray-600 mb-8">{guide.description}</p>

          <div className="space-y-6">
            {guide.steps.map((step, index) => (
              <div key={index} className="border-l-4 border-primary/20 pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h2 className="text-lg font-semibold text-navy">{step.title}</h2>
                </div>
                <ul className="space-y-2 ml-11">
                  {step.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-navy mb-4">Ready to Get Started?</h3>
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
                Browse Tilers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
