"use client";

import { useEffect, useState } from "react";
import { Page } from "@/components/Page";
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
      <Page title="Profile">
        <div className="max-w-xl rounded-lg border border-neutral-200 p-4">
          <div className="text-sm text-neutral-600">
            Set your role. Homeowners post tasks. Tilers bid and message.
          </div>

          <label className="mt-4 block text-sm font-medium">Role</label>
          <select
            className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="homeowner">Homeowner</option>
            <option value="tiler">Tiler</option>
          </select>

          <label className="mt-4 block text-sm font-medium">Display name</label>
          <Input className="mt-1" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">City</label>
              <Input className="mt-1" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Kegalle" />
            </div>
            <div>
              <label className="block text-sm font-medium">District</label>
              <Input className="mt-1" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g., Kegalle District" />
            </div>
          </div>

          {msg && <div className="mt-3 rounded-md bg-neutral-50 p-2 text-sm">{msg}</div>}

          <div className="mt-4">
            <Button onClick={save}>Save</Button>
          </div>

          <div className="mt-4 text-xs text-neutral-500">
            Profile exists: {profile ? "Yes" : "No (will create on Save)"}
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}
