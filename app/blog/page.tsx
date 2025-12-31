import Link from "next/link";
import { Page } from "@/components/Page";

const BLOG_POSTS = [
  {
    id: "how-to-choose-tiles",
    title: "How to Choose the Right Tiles for Your Home",
    excerpt: "A comprehensive guide to selecting the perfect tiles for different areas of your home, from kitchens to bathrooms.",
    category: "Tips",
    date: "Dec 28, 2024",
    readTime: "5 min read",
  },
  {
    id: "tile-trends-2025",
    title: "Top 5 Tile Trends for 2025",
    excerpt: "Discover the hottest tile designs and patterns that will dominate home interiors this year.",
    category: "Trends",
    date: "Dec 25, 2024",
    readTime: "4 min read",
  },
  {
    id: "tiling-cost-guide",
    title: "Cost of Tiling in Sri Lanka: Complete Price Guide",
    excerpt: "Everything you need to know about tiling costs, labor rates, and material prices in Sri Lanka.",
    category: "Pricing",
    date: "Dec 22, 2024",
    readTime: "7 min read",
  },
  {
    id: "diy-vs-professional",
    title: "DIY vs Professional Tiling: What You Should Know",
    excerpt: "When should you tackle a tiling project yourself vs hiring a professional? We break it down.",
    category: "Guides",
    date: "Dec 18, 2024",
    readTime: "6 min read",
  },
  {
    id: "essential-tiling-tools",
    title: "Essential Tools Every Tiler Needs",
    excerpt: "A complete list of professional tiling tools and equipment for quality installations.",
    category: "For Tilers",
    date: "Dec 15, 2024",
    readTime: "5 min read",
  },
  {
    id: "floor-preparation",
    title: "How to Prepare Your Floors Before Tiling",
    excerpt: "Proper floor preparation is crucial for a long-lasting tile installation. Learn the best practices.",
    category: "Tips",
    date: "Dec 12, 2024",
    readTime: "4 min read",
  },
  {
    id: "tile-sizes-patterns",
    title: "Understanding Tile Sizes and Patterns",
    excerpt: "From subway tiles to large format slabs, learn how different sizes affect the look of your space.",
    category: "Guides",
    date: "Dec 8, 2024",
    readTime: "5 min read",
  },
  {
    id: "bathroom-waterproofing",
    title: "Bathroom Waterproofing: A Complete Guide",
    excerpt: "Protect your bathroom from water damage with proper waterproofing techniques.",
    category: "Tips",
    date: "Dec 5, 2024",
    readTime: "6 min read",
  },
];

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Tips: "bg-blue-100 text-blue-700",
    Trends: "bg-purple-100 text-purple-700",
    Pricing: "bg-green-100 text-green-700",
    Guides: "bg-orange-100 text-orange-700",
    "For Tilers": "bg-primary/10 text-primary",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

export default function BlogPage() {
  return (
    <Page title="Blog">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">Blog</h1>
            <p className="text-gray-600 text-sm">Tips, guides, and trends for homeowners and tilers</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-4 py-2 rounded-full bg-navy text-white text-sm font-medium whitespace-nowrap">
            All Posts
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            Tips
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            Trends
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            Guides
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-200">
            For Tilers
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <article className="card hover:shadow-card-hover transition-shadow h-full">
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="font-semibold text-navy mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <span className="text-primary text-sm font-medium">
                      Read More
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="card p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-navy mb-2">Need Step-by-Step Guidance?</h3>
              <p className="text-sm text-gray-600">Check out our how-to guides for detailed instructions.</p>
            </div>
            <Link
              href="/guides"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
            >
              View Guides
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
