import { supabase } from "./supabaseClient";

export type BlogPostDisplay = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  isFromDb?: boolean;
};

export type GuideDisplay = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  steps: number;
  isFromDb?: boolean;
};

const STATIC_BLOG_POSTS: BlogPostDisplay[] = [
  {
    id: "how-to-choose-tiles",
    slug: "how-to-choose-tiles",
    title: "How to Choose the Right Tiles for Your Home",
    excerpt: "A comprehensive guide to selecting the perfect tiles for different areas of your home, from kitchens to bathrooms.",
    category: "Tips",
    date: "Dec 28, 2024",
    readTime: "5 min read",
  },
  {
    id: "tile-trends-2025",
    slug: "tile-trends-2025",
    title: "Top 5 Tile Trends for 2025",
    excerpt: "Discover the hottest tile designs and patterns that will dominate home interiors this year.",
    category: "Trends",
    date: "Dec 25, 2024",
    readTime: "4 min read",
  },
  {
    id: "tiling-cost-guide",
    slug: "tiling-cost-guide",
    title: "Cost of Tiling in Sri Lanka: Complete Price Guide",
    excerpt: "Everything you need to know about tiling costs, labor rates, and material prices in Sri Lanka.",
    category: "Pricing",
    date: "Dec 22, 2024",
    readTime: "7 min read",
  },
  {
    id: "diy-vs-professional",
    slug: "diy-vs-professional",
    title: "DIY vs Professional Tiling: What You Should Know",
    excerpt: "When should you tackle a tiling project yourself vs hiring a professional? We break it down.",
    category: "Guides",
    date: "Dec 18, 2024",
    readTime: "6 min read",
  },
  {
    id: "essential-tiling-tools",
    slug: "essential-tiling-tools",
    title: "Essential Tools Every Tiler Needs",
    excerpt: "A complete list of professional tiling tools and equipment for quality installations.",
    category: "For Tilers",
    date: "Dec 15, 2024",
    readTime: "5 min read",
  },
  {
    id: "floor-preparation",
    slug: "floor-preparation",
    title: "How to Prepare Your Floors Before Tiling",
    excerpt: "Proper floor preparation is crucial for a long-lasting tile installation. Learn the best practices.",
    category: "Tips",
    date: "Dec 12, 2024",
    readTime: "4 min read",
  },
  {
    id: "tile-sizes-patterns",
    slug: "tile-sizes-patterns",
    title: "Understanding Tile Sizes and Patterns",
    excerpt: "From subway tiles to large format slabs, learn how different sizes affect the look of your space.",
    category: "Guides",
    date: "Dec 8, 2024",
    readTime: "5 min read",
  },
  {
    id: "bathroom-waterproofing",
    slug: "bathroom-waterproofing",
    title: "Bathroom Waterproofing: A Complete Guide",
    excerpt: "Protect your bathroom from water damage with proper waterproofing techniques.",
    category: "Tips",
    date: "Dec 5, 2024",
    readTime: "6 min read",
  },
];

const STATIC_GUIDES: GuideDisplay[] = [
  {
    id: "prepare-for-tiling",
    slug: "prepare-for-tiling",
    title: "How to Prepare Your Home for Tiling",
    description: "Essential steps to take before the tiler arrives",
    icon: "home",
    steps: 5,
  },
  {
    id: "choose-right-tiler",
    slug: "choose-right-tiler",
    title: "How to Choose the Right Tiler",
    description: "Tips for finding and vetting professional tilers",
    icon: "user",
    steps: 6,
  },
  {
    id: "post-task-guide",
    slug: "post-task-guide",
    title: "How to Post a Task on Tilers Hub",
    description: "Get the best quotes by creating a detailed task",
    icon: "edit",
    steps: 4,
  },
  {
    id: "compare-quotes",
    slug: "compare-quotes",
    title: "How to Compare Tiler Quotes",
    description: "What to look for beyond just the price",
    icon: "scale",
    steps: 5,
  },
  {
    id: "bathroom-renovation",
    slug: "bathroom-renovation",
    title: "Bathroom Tiling: Complete Guide",
    description: "Everything you need to know about bathroom tiles",
    icon: "droplet",
    steps: 8,
  },
  {
    id: "kitchen-tiling",
    slug: "kitchen-tiling",
    title: "Kitchen Tiling: Floor & Backsplash",
    description: "Choose and install the perfect kitchen tiles",
    icon: "kitchen",
    steps: 6,
  },
  {
    id: "outdoor-tiling",
    slug: "outdoor-tiling",
    title: "Outdoor & Patio Tiling Guide",
    description: "Weather-resistant options for outdoor spaces",
    icon: "sun",
    steps: 5,
  },
  {
    id: "tile-maintenance",
    slug: "tile-maintenance",
    title: "How to Maintain Your Tiles",
    description: "Keep your tiles looking new for years",
    icon: "sparkle",
    steps: 4,
  },
];

export async function getBlogPosts(): Promise<BlogPostDisplay[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, category, read_time, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return STATIC_BLOG_POSTS;
    }

    const dbPosts: BlogPostDisplay[] = data.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      category: post.category,
      date: new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: post.read_time,
      isFromDb: true,
    }));

    return [...dbPosts, ...STATIC_BLOG_POSTS];
  } catch {
    return STATIC_BLOG_POSTS;
  }
}

export async function getGuides(): Promise<GuideDisplay[]> {
  try {
    const { data, error } = await supabase
      .from("guides")
      .select("id, slug, title, description, icon, steps, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return STATIC_GUIDES;
    }

    const dbGuides: GuideDisplay[] = data.map((guide) => ({
      id: guide.id,
      slug: guide.slug,
      title: guide.title,
      description: guide.description || "",
      icon: guide.icon || "book",
      steps: Array.isArray(guide.steps) ? guide.steps.length : 0,
      isFromDb: true,
    }));

    return [...dbGuides, ...STATIC_GUIDES];
  } catch {
    return STATIC_GUIDES;
  }
}

export function getStaticBlogPosts() {
  return STATIC_BLOG_POSTS;
}

export function getStaticGuides() {
  return STATIC_GUIDES;
}
