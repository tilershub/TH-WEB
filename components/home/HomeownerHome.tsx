"use client";

import { useEffect, useState, memo } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";
import SearchBar from "./SearchBar";
import ServiceCard from "./ServiceCard";
import TilerCard from "./TilerCard";
import BlogCard from "./BlogCard";
import GuideCard from "./GuideCard";
import { SkeletonTilerCard } from "@/components/Skeleton";

const SERVICES = [
  { title: "Floor Tiling", href: "/post-task?service=floor_tiling", icon: <FloorIcon /> },
  { title: "Wall Tiling", href: "/post-task?service=wall_tiling", icon: <WallIcon /> },
  { title: "Bathroom", href: "/post-task?service=bathroom_tiling", icon: <BathroomIcon /> },
  { title: "Staircase", href: "/post-task?service=staircase_tiling", icon: <StaircaseIcon /> },
  { title: "Pantry", href: "/post-task?service=pantry_backsplash", icon: <PantryIcon /> },
  { title: "Waterproofing", href: "/post-task?service=waterproofing", icon: <WaterIcon /> },
];

const BLOG_POSTS = [
  { title: "How to Choose the Right Tiles for Your Home", excerpt: "A complete guide to selecting tiles based on material, size, and room type.", category: "Tips", href: "/blog/how-to-choose-tiles" },
  { title: "Top 5 Tile Trends for 2025", excerpt: "Discover the latest trends in home tiling and transform your space.", category: "Trends", href: "/blog/tile-trends-2025" },
  { title: "Cost of Tiling in Sri Lanka", excerpt: "A breakdown of tiling costs per square foot across different services.", category: "Pricing", href: "/blog/tiling-cost-guide" },
];

const GUIDES = [
  { title: "How to Post a Task on Tilers Hub", steps: 4, duration: "2 min", href: "/guides/post-task-guide" },
  { title: "How to Choose the Right Tiler", steps: 6, duration: "4 min", href: "/guides/choose-right-tiler" },
  { title: "How to Compare Tiler Quotes", steps: 5, duration: "3 min", href: "/guides/compare-quotes" },
];

function FloorIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  );
}

function WallIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v4m-6-4v4m12-4v4M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
    </svg>
  );
}

function BathroomIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4V6zm0 7h16M8 13v5m8-5v5M6 18h12" />
    </svg>
  );
}

function StaircaseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20h4v-4h4v-4h4V8h4V4" />
    </svg>
  );
}

function PantryIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c-4.97 0-9-4.03-9-9 0-4.97 9-12 9-12s9 7.03 9 12c0 4.97-4.03 9-9 9z" />
    </svg>
  );
}

const MemoizedTilerCard = memo(TilerCard);
const MemoizedBlogCard = memo(BlogCard);
const MemoizedGuideCard = memo(GuideCard);

export default function HomeownerHome() {
  const [tilers, setTilers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const loadTilers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_path, city, district, years_experience")
          .eq("role", "tiler")
          .limit(6);

        if (!cancelled && !error && data) {
          setTilers(data as Profile[]);
        }
      } catch (e) {
        console.error("Failed to load tilers:", e);
      }
      if (!cancelled) setLoading(false);
    };
    
    loadTilers();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="pb-8">
      <div className="px-4 pt-4">
        <SearchBar />
      </div>

      <section className="mt-6 px-4">
        <h2 className="text-lg font-bold text-navy mb-3">Services</h2>
        <div className="grid grid-cols-3 gap-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} title={s.title} href={s.href} icon={s.icon} />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-navy">Top Tilers</h2>
          <a href="/tilers" className="text-sm text-primary font-medium">See All</a>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {loading ? (
              <>
                <SkeletonTilerCard />
                <SkeletonTilerCard />
                <SkeletonTilerCard />
              </>
            ) : tilers.length === 0 ? (
              <div className="text-sm text-gray-500">No tilers available</div>
            ) : (
              tilers.map((t) => <MemoizedTilerCard key={t.id} tiler={t} />)
            )}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-navy">Blog</h2>
          <a href="/blog" className="text-sm text-primary font-medium">See All</a>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {BLOG_POSTS.map((post) => (
              <MemoizedBlogCard
                key={post.title}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                href={post.href}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-navy">How-To Guides</h2>
          <a href="/guides" className="text-sm text-primary font-medium">See All</a>
        </div>
        <div className="space-y-2">
          {GUIDES.map((guide) => (
            <MemoizedGuideCard
              key={guide.title}
              title={guide.title}
              steps={guide.steps}
              duration={guide.duration}
              href={guide.href}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
