"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, Role } from "@/lib/types";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role>("homeowner");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user) return;

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
  };

  useEffect(() => { load(); }, []);

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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-2xl">
                {displayName ? displayName[0].toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">{displayName || "User"}</h2>
                <p className="text-sm text-gray-600 capitalize">{role}</p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
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
