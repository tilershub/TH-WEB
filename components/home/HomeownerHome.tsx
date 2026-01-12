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
  { title: "බිම් ටයිල්", href: "/services/floor_tiling", icon: <FloorIcon /> },
  { title: "බිත්ති ටයිල්", href: "/services/wall_tiling", icon: <WallIcon /> },
  { title: "නානකාමරය", href: "/services/bathroom_tiling", icon: <BathroomIcon /> },
  { title: "පඩිපෙළ", href: "/services/staircase_tiling", icon: <StaircaseIcon /> },
  { title: "පෑන්ට්‍රි", href: "/services/pantry_backsplash", icon: <PantryIcon /> },
  { title: "ජලරෝධනය", href: "/services/waterproofing", icon: <WaterIcon /> },
];

const BLOG_POSTS = [
  { title: "ඔබගේ නිවස සඳහා නිවැරදි ටයිල් තෝරාගන්නේ කෙසේද", excerpt: "ද්‍රව්‍ය, ප්‍රමාණය සහ කාමර වර්ගය මත ටයිල් තේරීම සඳහා සම්පූර්ණ මාර්ගෝපදේශයක්.", category: "උපදෙස්", href: "/blog/how-to-choose-tiles" },
  { title: "2025 සඳහා ඉහළම ටයිල් ප්‍රවණතා 5", excerpt: "නිවසේ ටයිල් කිරීම් සඳහා නවතම ප්‍රවණතා හඳුනාගෙන ඔබගේ අවකාශය වෙනස් කරන්න.", category: "ප්‍රවණතා", href: "/blog/tile-trends-2025" },
  { title: "ශ්‍රී ලංකාවේ ටයිල් කිරීමේ පිරිවැය", excerpt: "විවිධ සේවාවන් සඳහා වර්ග අඩියකට ටයිල් පිරිවැය විස්තර කිරීමක්.", category: "මිල ගණන්", href: "/blog/tiling-cost-guide" },
];

const STATS = [
  { label: "සත්‍යාපිත කාර්යකරුවන්", value: "150+" },
  { label: "සම්පූර්ණ ව්‍යාපෘති", value: "1,200+" },
  { label: "සාමාන්‍ය ප්‍රතිචාර කාලය", value: "< පැය 24" },
];

const HIGHLIGHTS = [
  {
    title: "එක් වතාවක් පළකරන්න, බොහෝ දෙනාට ළඟා වන්න",
    description: "ඔබගේ ව්‍යාපෘතිය පළ කර තහවුරු කළ කාර්යකරුවන්ගෙන් බහු මිල ගණන් ලබාගන්න.",
  },
  {
    title: "පැහැදිලි පැතිකඩ",
    description: "ඔබ තීරණය කිරීමට පෙර අත්දැකීම්, ඡායාරූප සහ සමාලෝචන සසඳන්න.",
  },
  {
    title: "පාලනය ඔබ අතේ",
    description: "කාර්යකරුවන් සමඟ සෘජුවම කතා කර කාලසටහන් ඔබගේ කොන්දේසි මත තීරණය කරන්න.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "ඔබගේ අවකාශය ගැන කියන්න",
    description: "කාමරය, කාර්ය පරාසය සහ අයවැය පරාසය හුවමාරු කර නිවැරදි ප්‍රතිචාර සඳහා උදව් කරන්න.",
  },
  {
    title: "ඔබට ගැළපෙන මිල ගණන් සමාලෝචනය කරන්න",
    description: "මිල ගණන් එකිනෙක සසඳා, ප්‍රශ්න අසන්න, සහ හොඳම තේරීම තෝරාගන්න.",
  },
  {
    title: "විශ්වාසයෙන් ආරම්භ කරන්න",
    description: "ආරම්භ දිනය තහවුරු කර සියල්ල එකම තැනකින් සංවිධානය කරන්න.",
  },
];

const GUIDES = [
  {
    title: "Task Hub හි කාර්යයක් පළ කිරීමේ ක්‍රමය",
    steps: 4,
    duration: "2 මිනිත්තු",
    href: "/guides/post-task-guide",
  },
  {
    title: "හරි කාර්යකරුවා තෝරාගැනීම",
    steps: 6,
    duration: "4 මිනිත්තු",
    href: "/guides/choose-right-tiler",
  },
  {
    title: "කාර්යකරුන්ගේ මිල ගණන් සසඳන්නේ කෙසේද",
    steps: 5,
    duration: "3 මිනිත්තු",
    href: "/guides/compare-quotes",
  },
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
          .select("id, display_name, full_name, avatar_path, city, district, years_experience")
          // We now query for taskers instead of tilers.  The underlying role
          // value in the database has been migrated from 'tiler' to 'tasker'.
          .eq("role", "tasker")
          .eq("approval_status", "approved")
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
      <section className="px-4 pt-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-white to-primary/5 p-5 shadow-sm">
          <p className="text-sm font-semibold text-primary">නැවත සාදරයෙන් පිළිගනිමු</p>
          <h1 className="text-2xl font-bold text-navy mt-2">
            ඔබගේ මීළඟ ටයිල් ව්‍යාපෘතිය සඳහා විශ්වාසදායක කාර්යකරුවන් සොයන්න
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            මිනිත්තු කිහිපයකින් කාර්යයක් පළ කර, මිල ගණන් සසඳා, විශ්වාසයෙන් ඉදිරියට යන්න.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/post-task"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              කාර්යයක් පළ කරන්න
            </a>
            <a
              href="/tilers"
              className="rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary"
            >
              කාර්යකරුවන් සොයන්න
            </a>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/70 px-2 py-3">
                <p className="text-base font-bold text-navy">{stat.value}</p>
                <p className="text-xs text-neutral-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <SearchBar />
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-lg font-bold text-navy mb-3">නිවාස හිමියන් අපව තෝරන්නේ ඇයි</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map((highlight) => (
            <div key={highlight.title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-navy">{highlight.title}</h3>
              <p className="text-xs text-neutral-600 mt-2">{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-lg font-bold text-navy mb-3">සේවා</h2>
        <div className="grid grid-cols-3 gap-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} title={s.title} href={s.href} icon={s.icon} />
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="text-lg font-bold text-navy mb-3">එය කෙසේ ක්‍රියා කරන්නේද</h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((step, index) => (
            <div key={step.title} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy">{step.title}</h3>
                <p className="text-xs text-neutral-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          {/* Show top taskers instead of tilers.  The route remains `/tilers`
              for now to maintain compatibility, but the label uses the
              new terminology. */}
          <h2 className="text-lg font-bold text-navy">Top Taskers</h2>
          <a href="/tilers" className="text-sm text-primary font-medium">සියල්ල බලන්න</a>
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
              <div className="text-sm text-gray-500">කාර්යකරුවන් නොමැත</div>
            ) : (
              tilers.map((t) => <MemoizedTilerCard key={t.id} tiler={t} />)
            )}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-navy">බ්ලොග්</h2>
          <a href="/blog" className="text-sm text-primary font-medium">සියල්ල බලන්න</a>
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
          <h2 className="text-lg font-bold text-navy">කෙසේ කරන්න මාර්ගෝපදේශ</h2>
          <a href="/guides" className="text-sm text-primary font-medium">සියල්ල බලන්න</a>
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
