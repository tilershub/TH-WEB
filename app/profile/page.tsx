"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, Role, AvailabilityStatus } from "@/lib/types";
import { SERVICES } from "@/lib/services";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getPublicUrl } from "@/lib/storage";

function AvailabilityBadge({ status }: { status?: AvailabilityStatus }) {
  const statusConfig = {
    available: { label: "Available", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    busy: { label: "Limited Availability", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    unavailable: { label: "Not Taking Jobs", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  };
  const config = statusConfig[status || "available"];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>("homeowner");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

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
      setRole(p.role);
      setDisplayName(p.display_name ?? "");
      setCity(p.city ?? "");
      setDistrict(p.district ?? "");
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

  const save = async () => {
    setMsg(null);
    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user) return;

    const payload = {
      id: user.id,
      role,
      display_name: displayName || null,
      city: city || null,
      district: district || null,
    };

    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Saved.");
    await load();
  };

  const isTiler = role === "tiler";
  const hasCompletedTilerProfile = profile?.profile_completed === true;

  const servicesWithRates = useMemo(() => {
    if (!profile?.service_rates) return [];
    return SERVICES.filter(svc => {
      const rate = profile.service_rates?.[svc.key];
      return rate && rate.rate !== null && rate.rate > 0;
    });
  }, [profile?.service_rates]);

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 pb-28">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/tasks" className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-navy">Profile</h1>
          </div>

          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-2xl overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  displayName ? displayName[0].toUpperCase() : "U"
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-navy">{displayName || "User"}</h2>
                <p className="text-sm text-gray-600 capitalize">{role}</p>
                {isTiler && profile?.availability_status && (
                  <div className="mt-2">
                    <AvailabilityBadge status={profile.availability_status} />
                  </div>
                )}
              </div>
            </div>

            {isTiler && (
              <div className="border-t pt-6">
                {hasCompletedTilerProfile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-navy">Tiler Profile</h3>
                        <p className="text-sm text-gray-600">Your professional profile is set up</p>
                      </div>
                      <Link href="/profile/setup" className="btn-primary">
                        Edit Tiler Profile
                      </Link>
                    </div>

                    {profile?.years_experience && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {profile.years_experience}+ years experience
                      </div>
                    )}

                    {(profile?.working_districts?.length ?? 0) > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Working Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {profile?.working_districts?.slice(0, 5).map((d) => (
                            <span key={d} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {d}
                            </span>
                          ))}
                          {(profile?.working_districts?.length ?? 0) > 5 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{(profile?.working_districts?.length ?? 0) - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {servicesWithRates.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Your Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {servicesWithRates.map((svc) => (
                            <span key={svc.key} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                              {svc.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile?.id && (
                      <Link
                        href={`/tilers/${profile.id}`}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Public Profile
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="bg-primary/5 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-navy text-lg mb-2">Complete Your Tiler Profile</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Set up your services, rates, portfolio, and availability to start getting jobs from homeowners.
                    </p>
                    <Link href="/profile/setup" className="btn-primary inline-flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Set Up Tiler Profile
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-navy">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="homeowner">Homeowner</option>
                  <option value="tiler">Tiler</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Homeowners post tasks. Tilers bid and message.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Kegalle" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g., Kegalle District" />
                </div>
              </div>

              {msg && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                  {msg}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={save} className="flex-1">Save Changes</Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = "/auth";
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
