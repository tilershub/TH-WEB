"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { SERVICES } from "@/lib/services";
import type { Profile, PortfolioItem } from "@/lib/types";

type Review = {
  id: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  service_type: string;
  date: string;
  rating: number;
  comment: string;
};

function pub(bucket: string, path?: string | null) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function waLink(phone?: string | null, text?: string) {
  if (!phone) return null;
  const p = phone.replace(/[^\d]/g, "");
  const msg = encodeURIComponent(text || "Hi, I found your profile on TILERS HUB. I'd like to request a quote for my tiling project.");
  return `https://wa.me/${p}?text=${msg}`;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-gray-700 font-medium">{rating.toFixed(1)}</span>
      <span className="text-gray-500">({reviewCount})</span>
    </div>
  );
}

export default function PublicTilerProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [tiler, setTiler] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const p = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (p.error) {
        setLoading(false);
        return;
      }

      const prof = (p.data ?? null) as Profile | null;
      setTiler(prof);

      if (prof) {
        const portfolioRes = await supabase
          .from("tiler_portfolio")
          .select("*")
          .eq("tiler_id", id)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(6);

        setPortfolio((portfolioRes.data ?? []) as PortfolioItem[]);

        setReviews([]);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const avatarUrl = useMemo(() => pub("profile-avatars", tiler?.avatar_path), [tiler?.avatar_path]);

  const locationLine = useMemo(() => {
    const parts = [tiler?.city, tiler?.district].filter(Boolean);
    return parts.length ? parts.join(", ") : "Sri Lanka";
  }, [tiler?.city, tiler?.district]);

  const whatsappHref = useMemo(() => waLink(tiler?.whatsapp), [tiler?.whatsapp]);

  const skills = useMemo(() => {
    if (!tiler?.service_rates) return [];
    return SERVICES.filter(svc => {
      const rate = tiler.service_rates?.[svc.key];
      return rate && rate.rate !== null && rate.rate > 0;
    }).map(svc => svc.label);
  }, [tiler?.service_rates]);

  const avgRating = 4.9;
  const reviewCount = reviews.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!tiler) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile not found</h1>
          <Link href="/tasks" className="text-primary hover:underline">
            Browse available tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <div className="max-w-lg mx-auto bg-white min-h-screen shadow-lg">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {tiler.display_name?.[0]?.toUpperCase() || "T"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-2xl font-bold text-gray-900">{tiler.display_name || "Tiler"}</h1>
              <div className="flex items-center gap-1 mt-1 text-gray-600">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{locationLine}</span>
              </div>
              <div className="mt-2">
                <StarRating rating={avgRating} reviewCount={reviewCount} />
              </div>
            </div>
          </div>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-6 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
              Request Quote
            </a>
          )}

          <p className="text-center text-gray-500 text-sm mt-3">Professional Tiler</p>
        </div>

        <div className="border-t border-gray-100" />

        <div className="px-5 py-5">
          <h2 className="text-lg font-bold text-gray-900 mb-3">About Me</h2>
          <p className="text-gray-700 leading-relaxed">
            {tiler.bio || `Experienced tiler specializing in quality tiling work. Contact me for your tiling needs.`}
          </p>

          <div className="mt-5 space-y-3">
            {tiler.whatsapp && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{tiler.whatsapp}</span>
              </div>
            )}
            {tiler.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{tiler.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {skills.length > 0 && (
          <>
            <div className="px-5 py-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">My Skills</h2>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100" />
          </>
        )}

        {portfolio.length > 0 && (
          <>
            <div className="px-5 py-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Portfolio</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                {portfolio.map((item) => {
                  const imgUrl = pub("tiler-portfolio", item.image_path);
                  return (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <img
                        src={imgUrl || ""}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="border-t border-gray-100" />
          </>
        )}

        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Reviews {reviewCount > 0 && <span className="font-normal text-gray-500">({reviewCount})</span>}
            </h2>
            {reviewCount > 0 && (
              <button className="text-primary text-sm font-medium hover:underline">
                View All ({reviewCount})
              </button>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {review.reviewer_avatar ? (
                        <img src={review.reviewer_avatar} alt={review.reviewer_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                          {review.reviewer_name[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{review.reviewer_name}</h3>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">
                        {review.service_type} <span className="text-gray-400">·</span> {review.date}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {tiler.years_experience && (
          <>
            <div className="border-t border-gray-100" />
            <div className="px-5 py-5">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{tiler.years_experience}+ years experience</span>
                </div>
                {(tiler.completed_jobs ?? 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tiler.completed_jobs} jobs completed</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Portfolio"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
