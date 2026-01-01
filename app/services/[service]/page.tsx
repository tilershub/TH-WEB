"use client";

import { useEffect, useState, memo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";
import { SkeletonCard } from "@/components/Skeleton";

const SERVICE_INFO: Record<string, { title: string; description: string; icon: string }> = {
  floor_tiling: {
    title: "Floor Tiling",
    description: "Find expert floor tilers for your home or commercial space",
    icon: "floor",
  },
  wall_tiling: {
    title: "Wall Tiling",
    description: "Professional wall tiling services for any room",
    icon: "wall",
  },
  bathroom_tiling: {
    title: "Bathroom Tiling",
    description: "Specialized bathroom tiling with waterproofing expertise",
    icon: "bathroom",
  },
  staircase_tiling: {
    title: "Staircase Tiling",
    description: "Expert staircase tiling with attention to safety and aesthetics",
    icon: "staircase",
  },
  pantry_backsplash: {
    title: "Pantry & Backsplash",
    description: "Beautiful backsplash and pantry tiling solutions",
    icon: "pantry",
  },
  waterproofing: {
    title: "Waterproofing",
    description: "Professional waterproofing services for wet areas",
    icon: "water",
  },
};

const SERVICE_BLOGS: Record<string, { title: string; excerpt: string; category: string; href: string }[]> = {
  floor_tiling: [
    { title: "How to Choose the Right Tiles", excerpt: "A complete guide to selecting tiles for floors.", category: "Tips", href: "/blog/how-to-choose-tiles" },
    { title: "Floor Preparation Guide", excerpt: "Proper preparation for long-lasting installations.", category: "Tips", href: "/blog/floor-preparation" },
  ],
  wall_tiling: [
    { title: "Understanding Tile Sizes", excerpt: "How tile sizes affect your wall's appearance.", category: "Guides", href: "/blog/tile-sizes-patterns" },
    { title: "Top 5 Tile Trends for 2025", excerpt: "Latest wall tile design trends.", category: "Trends", href: "/blog/tile-trends-2025" },
  ],
  bathroom_tiling: [
    { title: "Bathroom Waterproofing Guide", excerpt: "Protect your bathroom from water damage.", category: "Tips", href: "/blog/bathroom-waterproofing" },
    { title: "How to Choose the Right Tiles", excerpt: "Selecting tiles for wet areas.", category: "Tips", href: "/blog/how-to-choose-tiles" },
  ],
  staircase_tiling: [
    { title: "Cost of Tiling in Sri Lanka", excerpt: "Complete pricing guide for staircase work.", category: "Pricing", href: "/blog/tiling-cost-guide" },
    { title: "DIY vs Professional Tiling", excerpt: "When to hire a professional.", category: "Guides", href: "/blog/diy-vs-professional" },
  ],
  pantry_backsplash: [
    { title: "Top 5 Tile Trends for 2025", excerpt: "Modern backsplash design ideas.", category: "Trends", href: "/blog/tile-trends-2025" },
    { title: "Understanding Tile Sizes", excerpt: "Best sizes for backsplash areas.", category: "Guides", href: "/blog/tile-sizes-patterns" },
  ],
  waterproofing: [
    { title: "Bathroom Waterproofing Guide", excerpt: "Complete waterproofing techniques.", category: "Tips", href: "/blog/bathroom-waterproofing" },
    { title: "Floor Preparation Guide", excerpt: "Preparing surfaces before waterproofing.", category: "Tips", href: "/blog/floor-preparation" },
  ],
};

const SERVICE_GUIDES: Record<string, { title: string; steps: number; duration: string; href: string }[]> = {
  floor_tiling: [
    { title: "How to Prepare Your Home for Tiling", steps: 5, duration: "3 min", href: "/guides/prepare-for-tiling" },
    { title: "How to Choose the Right Tiler", steps: 6, duration: "4 min", href: "/guides/choose-right-tiler" },
  ],
  wall_tiling: [
    { title: "How to Choose the Right Tiler", steps: 6, duration: "4 min", href: "/guides/choose-right-tiler" },
    { title: "How to Compare Tiler Quotes", steps: 5, duration: "3 min", href: "/guides/compare-quotes" },
  ],
  bathroom_tiling: [
    { title: "Bathroom Tiling: Complete Guide", steps: 8, duration: "6 min", href: "/guides/bathroom-renovation" },
    { title: "How to Choose the Right Tiler", steps: 6, duration: "4 min", href: "/guides/choose-right-tiler" },
  ],
  staircase_tiling: [
    { title: "How to Prepare Your Home for Tiling", steps: 5, duration: "3 min", href: "/guides/prepare-for-tiling" },
    { title: "How to Compare Tiler Quotes", steps: 5, duration: "3 min", href: "/guides/compare-quotes" },
  ],
  pantry_backsplash: [
    { title: "Kitchen Tiling: Floor & Backsplash", steps: 6, duration: "5 min", href: "/guides/kitchen-tiling" },
    { title: "How to Choose the Right Tiler", steps: 6, duration: "4 min", href: "/guides/choose-right-tiler" },
  ],
  waterproofing: [
    { title: "Bathroom Tiling: Complete Guide", steps: 8, duration: "6 min", href: "/guides/bathroom-renovation" },
    { title: "How to Prepare Your Home for Tiling", steps: 5, duration: "3 min", href: "/guides/prepare-for-tiling" },
  ],
};

function TilerCard({ tiler }: { tiler: Profile }) {
  const avatarUrl = tiler.avatar_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-avatars/${tiler.avatar_path}`
    : null;
  const location = [tiler.city, tiler.district].filter(Boolean).join(", ") || "Sri Lanka";
  const displayName = tiler.full_name || tiler.display_name || "Professional Tiler";

  return (
    <Link href={`/tilers/${tiler.id}`} className="card hover:shadow-card-hover transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0 relative">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={displayName} fill sizes="56px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
              {displayName[0]?.toUpperCase() || "T"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-navy truncate">{displayName}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-600 text-sm">
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-3 h-3 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-gray-600">4.0</span>
          </div>
        </div>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ title, excerpt, category, href }: { title: string; excerpt: string; category: string; href: string }) {
  return (
    <Link href={href} className="card hover:shadow-card-hover transition-shadow">
      <div className="h-24 bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-2xl flex items-center justify-center">
        <svg className="w-8 h-8 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <div className="p-3">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{category}</span>
        <h3 className="font-semibold text-sm text-navy mt-2 line-clamp-2">{title}</h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{excerpt}</p>
      </div>
    </Link>
  );
}

function GuideCard({ title, steps, duration, href }: { title: string; steps: number; duration: string; href: string }) {
  return (
    <Link href={href} className="card p-4 hover:shadow-card-hover transition-shadow flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-navy truncate">{title}</h3>
        <p className="text-xs text-gray-500">{steps} steps · {duration}</p>
      </div>
      <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

const MemoizedTilerCard = memo(TilerCard);

export default function ServicePage() {
  const params = useParams();
  const service = params.service as string;
  const [tilers, setTilers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const info = SERVICE_INFO[service] || { title: "Service", description: "Find professional tilers", icon: "floor" };
  const blogs = SERVICE_BLOGS[service] || [];
  const guides = SERVICE_GUIDES[service] || [];

  useEffect(() => {
    let cancelled = false;
    
    const loadTilers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, display_name, full_name, avatar_path, city, district, years_experience, service_rates")
          .eq("role", "tiler")
          .limit(20);

        if (!cancelled && !error && data) {
          const filtered = (data as Profile[]).filter((t) => {
            if (!t.service_rates) return false;
            return Object.keys(t.service_rates).includes(service);
          });
          setTilers(filtered);
        }
      } catch (e) {
        console.error("Failed to load tilers:", e);
      }
      if (!cancelled) setLoading(false);
    };
    
    loadTilers();
    return () => { cancelled = true; };
  }, [service]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">{info.title}</h1>
            <p className="text-gray-600 text-sm">{info.description}</p>
          </div>
        </div>

        <Link
          href={`/post-task?service=${service}`}
          className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-semibold py-4 rounded-xl transition-colors"
        >
          Post a {info.title} Task
        </Link>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-navy">Available Tilers</h2>
            <Link href="/tilers" className="text-sm text-primary font-medium">See All</Link>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : tilers.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Tilers Available</h3>
              <p className="text-gray-600 text-sm">Post a task and tilers will reach out to you!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tilers.slice(0, 3).map((tiler) => (
                <MemoizedTilerCard key={tiler.id} tiler={tiler} />
              ))}
            </div>
          )}
        </section>

        {blogs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-navy">Related Articles</h2>
              <Link href="/blog" className="text-sm text-primary font-medium">See All</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {blogs.map((blog) => (
                <BlogCard key={blog.href} {...blog} />
              ))}
            </div>
          </section>
        )}

        {tilers.length > 3 && (
          <section>
            <h2 className="text-lg font-bold text-navy mb-3">More Tilers</h2>
            <div className="space-y-3">
              {tilers.slice(3, 6).map((tiler) => (
                <MemoizedTilerCard key={tiler.id} tiler={tiler} />
              ))}
            </div>
          </section>
        )}

        {guides.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-navy">How-To Guides</h2>
              <Link href="/guides" className="text-sm text-primary font-medium">See All</Link>
            </div>
            <div className="space-y-2">
              {guides.map((guide) => (
                <GuideCard key={guide.href} {...guide} />
              ))}
            </div>
          </section>
        )}

        {tilers.length > 6 && (
          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Even More Tilers</h2>
            <div className="space-y-3">
              {tilers.slice(6).map((tiler) => (
                <MemoizedTilerCard key={tiler.id} tiler={tiler} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
