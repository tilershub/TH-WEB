"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, Role, PortfolioItem } from "@/lib/types";
import { SERVICES } from "@/lib/services";
import { getPublicUrl } from "@/lib/storage";

function pub(bucket: string, path?: string | null) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function StarRating({ rating }: { rating: number }) {
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
      <span className="text-gray-500">(0)</span>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      const p = data as Profile;
      setProfile(p);

      if (p.role === "tiler") {
        const portfolioRes = await supabase
          .from("tiler_portfolio")
          .select("*")
          .eq("tiler_id", user.id)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(6);
        setPortfolio((portfolioRes.data ?? []) as PortfolioItem[]);
      }
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const avatarUrl = useMemo(
    () => getPublicUrl("profile-avatars", profile?.avatar_path),
    [profile?.avatar_path]
  );

  const locationLine = useMemo(() => {
    const parts = [profile?.city, profile?.district].filter(Boolean);
    return parts.length ? parts.join(", ") : "Sri Lanka";
  }, [profile?.city, profile?.district]);

  const skills = useMemo(() => {
    if (!profile?.service_rates) return [];
    return SERVICES.filter(svc => {
      const rate = profile.service_rates?.[svc.key];
      return rate && rate.rate !== null && rate.rate > 0;
    }).map(svc => svc.label);
  }, [profile?.service_rates]);

  const isTiler = profile?.role === "tiler";
  const hasCompletedTilerProfile = profile?.profile_completed === true;

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </RequireAuth>
    );
  }

  if (!isTiler) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-100 pb-28">
          <div className="max-w-lg mx-auto bg-white min-h-screen shadow-lg">
            <div className="px-5 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {profile?.display_name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h1 className="text-2xl font-bold text-gray-900">{profile?.display_name || "User"}</h1>
                  <div className="flex items-center gap-1 mt-1 text-gray-600">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{locationLine}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 capitalize">{profile?.role || "Homeowner"}</p>
                </div>
              </div>

              <Link
                href="/profile/setup"
                className="mt-5 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-6 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </Link>
            </div>

            <div className="border-t border-gray-100" />

            <div className="px-5 py-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About Me</h2>
              <p className="text-gray-700 leading-relaxed">
                {profile?.bio || "No bio added yet."}
              </p>

              <div className="mt-5 space-y-3">
                {profile?.whatsapp && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{profile.whatsapp}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="px-5 py-5">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/auth";
                }}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100 pb-28">
        <div className="max-w-lg mx-auto bg-white min-h-screen shadow-lg">
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.display_name?.[0]?.toUpperCase() || "T"}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <h1 className="text-2xl font-bold text-gray-900">{profile?.display_name || "Tiler"}</h1>
                <div className="flex items-center gap-1 mt-1 text-gray-600">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{locationLine}</span>
                </div>
                <div className="mt-2">
                  <StarRating rating={4.9} />
                </div>
              </div>
            </div>

            {hasCompletedTilerProfile ? (
              <Link
                href="/profile/setup"
                className="mt-5 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-6 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </Link>
            ) : (
              <Link
                href="/profile/setup"
                className="mt-5 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-6 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Complete Your Profile
              </Link>
            )}

            <p className="text-center text-gray-500 text-sm mt-3">Professional Tiler</p>
          </div>

          <div className="border-t border-gray-100" />

          <div className="px-5 py-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About Me</h2>
            <p className="text-gray-700 leading-relaxed">
              {profile?.bio || "Add a bio to tell homeowners about your experience and skills."}
            </p>

            <div className="mt-5 space-y-3">
              {profile?.whatsapp && (
                <div className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{profile.whatsapp}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {skills.length > 0 ? (
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
          ) : (
            <>
              <div className="px-5 py-5">
                <h2 className="text-lg font-bold text-gray-900 mb-3">My Skills</h2>
                <p className="text-gray-500 text-sm">No skills added yet. Complete your profile to add services.</p>
              </div>
              <div className="border-t border-gray-100" />
            </>
          )}

          {portfolio.length > 0 ? (
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
          ) : (
            <>
              <div className="px-5 py-5">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h2>
                <p className="text-gray-500 text-sm">No work samples added yet. Add portfolio items to showcase your work.</p>
              </div>
              <div className="border-t border-gray-100" />
            </>
          )}

          <div className="px-5 py-5">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {profile?.years_experience && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{profile.years_experience}+ years</span>
                </div>
              )}
              {(profile?.completed_jobs ?? 0) > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{profile.completed_jobs} jobs</span>
                </div>
              )}
            </div>

            {profile?.id && (
              <Link
                href={`/tilers/${profile.id}`}
                className="mt-4 w-full flex items-center justify-center gap-2 border border-primary text-primary font-medium py-3 px-6 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Public Profile
              </Link>
            )}

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/auth";
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
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
    </RequireAuth>
  );
}
