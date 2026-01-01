"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";
import { uploadFile, getPublicUrl, generateFilePath } from "@/lib/storage";
import { LoadingPage } from "@/components/LoadingSpinner";

export default function HomeownerEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data: s } = await supabase.auth.getSession();
        const user = s.session?.user;
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        const prof = data as Profile | null;
        setProfile(prof);

        if (prof?.role === "tiler") {
          router.push("/profile/setup");
          return;
        }

        setDisplayName(prof?.display_name ?? prof?.full_name ?? "");
        setBio(prof?.bio ?? "");
        setWhatsapp(prof?.whatsapp ?? "");
        setDistrict(prof?.district ?? "");
        setCity(prof?.city ?? "");
      } catch (err: any) {
        setMsg(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const existingAvatar = useMemo(
    () => getPublicUrl("profile-avatars", profile?.avatar_path),
    [profile?.avatar_path]
  );

  const save = async () => {
    setSaving(true);
    setMsg(null);

    try {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) throw new Error("Please login.");

      if (!displayName.trim()) throw new Error("Please enter your name.");

      let avatar_path = profile?.avatar_path ?? null;

      if (avatarFile) {
        const path = generateFilePath(user.id, "avatar", avatarFile);
        avatar_path = await uploadFile("profile-avatars", path, avatarFile);
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          full_name: displayName.trim(),
          bio: bio.trim() || null,
          whatsapp: whatsapp.trim() || null,
          district: district.trim() || null,
          city: city.trim() || null,
          avatar_path,
        })
        .eq("id", user.id);

      if (error) throw error;

      router.push("/profile");
    } catch (e: any) {
      setMsg(e?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPage message="Loading profile..." />;

  return (
    <RequireAuth>
      <Page title="Edit Profile">
        <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
          {msg && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {msg}
            </div>
          )}

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 bg-gradient-to-br from-primary to-primary-dark flex-shrink-0">
                {avatarPreview || existingAvatar ? (
                  <img
                    src={avatarPreview || existingAvatar || ""}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {displayName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div>
              <label className="text-sm font-medium">
                Name <span className="text-red-600">*</span>
              </label>
              <Input
                className="mt-2"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">About Me</label>
              <Textarea
                className="mt-2"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{bio.length}/500</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 space-y-4">
            <h3 className="text-lg font-semibold">Contact & Location</h3>

            <div>
              <label className="text-sm font-medium">WhatsApp Number</label>
              <Input
                className="mt-2"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g., 0771234567"
                inputMode="tel"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">District</label>
                <Input
                  className="mt-2"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g., Colombo"
                />
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <Input
                  className="mt-2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Nugegoda"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/profile")}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={saving || !displayName.trim()}
              className="flex-1"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}
