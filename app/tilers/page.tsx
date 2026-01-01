"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";
import { SkeletonCard } from "@/components/Skeleton";

const TILERS_PER_PAGE = 10;

function pub(bucket: string, path?: string | null) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function TilerCard({ tiler }: { tiler: Profile }) {
  const avatarUrl = pub("profile-avatars", tiler.avatar_path);
  const location = [tiler.city, tiler.district].filter(Boolean).join(", ") || "Sri Lanka";

  return (
    <Link href={`/tilers/${tiler.id}`} className="card hover:shadow-card-hover transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0 relative">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt={tiler.display_name || "Tiler"} 
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
              {tiler.display_name?.[0]?.toUpperCase() || "T"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-navy truncate">{tiler.display_name || "Tiler"}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-600 text-sm">
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-600">4.0</span>
          </div>

          {tiler.years_experience && (
            <div className="mt-2 text-xs text-gray-500">
              {tiler.years_experience}+ years experience
            </div>
          )}
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

export default function TilersPage() {
  const [tilers, setTilers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadTilers = useCallback(async (pageNum: number, append = false) => {
    if (pageNum === 0) setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_path, city, district, years_experience, role")
        .eq("role", "tiler")
        .order("created_at", { ascending: false })
        .range(pageNum * TILERS_PER_PAGE, (pageNum + 1) * TILERS_PER_PAGE - 1);

      if (!error && data) {
        if (append) {
          setTilers(prev => [...prev, ...(data as Profile[])]);
        } else {
          setTilers(data as Profile[]);
        }
        setHasMore(data.length === TILERS_PER_PAGE);
      }
    } catch (e) {
      console.error("Failed to load tilers:", e);
    }
    setLoading(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => {
    loadTilers(0);
  }, [loadTilers]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setPage(prev => {
      const nextPage = prev + 1;
      loadTilers(nextPage, true);
      return nextPage;
    });
  };

  const filteredTilers = useMemo(() => {
    if (!search.trim()) return tilers;
    const q = search.toLowerCase();
    return tilers.filter((t) => {
      const name = (t.display_name || "").toLowerCase();
      const city = (t.city || "").toLowerCase();
      const district = (t.district || "").toLowerCase();
      return name.includes(q) || city.includes(q) || district.includes(q);
    });
  }, [tilers, search]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Browse Tilers</h1>
        </div>

        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredTilers.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Tilers Found</h3>
            <p className="text-gray-600 text-sm">
              {search ? "Try a different search term." : "Be the first tiler to join Tilers Hub!"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredTilers.map((tiler) => (
                <TilerCard key={tiler.id} tiler={tiler} />
              ))}
            </div>
            
            {hasMore && !search && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
