import Link from "next/link";
import { Page } from "@/components/Page";

const GUIDES = [
  {
    id: "prepare-for-tiling",
    title: "How to Prepare Your Home for Tiling",
    description: "Essential steps to take before the tiler arrives",
    icon: "home",
    steps: 5,
  },
  {
    id: "choose-right-tiler",
    title: "How to Choose the Right Tiler",
    description: "Tips for finding and vetting professional tilers",
    icon: "user",
    steps: 6,
  },
  {
    id: "post-task-guide",
    title: "How to Post a Task on Tilers Hub",
    description: "Get the best quotes by creating a detailed task",
    icon: "edit",
    steps: 4,
  },
  {
    id: "compare-quotes",
    title: "How to Compare Tiler Quotes",
    description: "What to look for beyond just the price",
    icon: "scale",
    steps: 5,
  },
  {
    id: "bathroom-renovation",
    title: "Bathroom Tiling: Complete Guide",
    description: "Everything you need to know about bathroom tiles",
    icon: "droplet",
    steps: 8,
  },
  {
    id: "kitchen-tiling",
    title: "Kitchen Tiling: Floor & Backsplash",
    description: "Choose and install the perfect kitchen tiles",
    icon: "kitchen",
    steps: 6,
  },
  {
    id: "outdoor-tiling",
    title: "Outdoor & Patio Tiling Guide",
    description: "Weather-resistant options for outdoor spaces",
    icon: "sun",
    steps: 5,
  },
  {
    id: "tile-maintenance",
    title: "How to Maintain Your Tiles",
    description: "Keep your tiles looking new for years",
    icon: "sparkle",
    steps: 4,
  },
];

function getIcon(name: string) {
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    user: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    edit: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    scale: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    droplet: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c-4.97 0-9-4.03-9-9 0-4.97 9-12 9-12s9 7.03 9 12c0 4.97-4.03 9-9 9z" />
      </svg>
    ),
    kitchen: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    sun: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    sparkle: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  };
  return icons[name] || icons.home;
}

export default function GuidesPage() {
  return (
    <Page title="How-To Guides">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">How-To Guides</h1>
            <p className="text-gray-600 text-sm">Step-by-step guides for your tiling project</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  {getIcon(guide.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-navy mb-1">{guide.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{guide.steps} steps</span>
                    <span className="text-primary font-medium">Read Guide</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="card p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-navy mb-2">Ready to Start Your Project?</h3>
              <p className="text-sm text-gray-600">Post a task and get quotes from professional tilers in your area.</p>
            </div>
            <Link
              href="/post-task"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
            >
              Post a Task
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
