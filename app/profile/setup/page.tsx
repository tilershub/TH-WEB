"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, ServiceRates } from "@/lib/types";
import { SERVICES, type ServiceKey } from "@/lib/services";

function publicUrl(bucket: string, path: string | null | undefined) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function uploadFile(bucket: string, path: string, file: File) {
  const up = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (up.error) throw new Error(up.error.message);
  return path;
}

export default function ProfileSetupPage() {
  const [meId, setMeId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [fullName, setFullName] = useState("");
  const [nicNo, setNicNo] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [serviceRates, setServiceRates] = useState<ServiceRates>({});
  const [serviceFiles, setServiceFiles] = useState<Record<string, File | null>>({});

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const avatarPreview = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile]);
  const coverPreview = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile]);

  useEffect(() => {
    const load = async () => {
      setMsg(null);
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) return;

      setMeId(user.id);

      const p = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (p.error) {
        setMsg(p.error.message);
        return;
      }

      const prof = (p.data ?? null) as Profile | null;
      setProfile(prof);

      setFullName(prof?.full_name ?? "");
      setNicNo(prof?.nic_no ?? "");
      setAddress(prof?.address ?? "");
      setWhatsapp(prof?.whatsapp ?? "");
      setServiceRates((prof?.service_rates ?? {}) as ServiceRates);

      // if not tiler, redirect away
      if (prof?.role && prof.role !== "tiler") {
        window.location.href = "/profile";
        return;
      }
    };

    load();
  }, []);

  const existingAvatar = useMemo(() => publicUrl("profile-avatars", profile?.avatar_path), [profile?.avatar_path]);
  const existingCover = useMemo(() => publicUrl("profile-covers", profile?.cover_path), [profile?.cover_path]);

  const updateRate = (key: ServiceKey, rateStr: string) => {
    const rate = rateStr ? Number(rateStr) : null;
    setServiceRates((prev) => ({
      ...prev,
      [key]: {
        rate: Number.isFinite(rate as any) ? rate : null,
        unit: SERVICES.find((s) => s.key === key)!.unit,
        photo_path: prev?.[key]?.photo_path ?? null,
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);

    try {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) throw new Error("Please login.");

      // basic validation
      if (!fullName.trim()) throw new Error("Enter your name.");
      if (!whatsapp.trim()) throw new Error("Enter WhatsApp number.");
      if (!nicNo.trim()) throw new Error("Enter NIC number.");
      if (!address.trim()) throw new Error("Enter address.");

      // upload avatar/cover if selected
      let avatar_path = profile?.avatar_path ?? null;
      let cover_path = profile?.cover_path ?? null;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() || "jpg";
        avatar_path = await uploadFile("profile-avatars", `${user.id}/avatar.${ext}`, avatarFile);
      }

      if (coverFile) {
        const ext = coverFile.name.split(".").pop() || "jpg";
        cover_path = await uploadFile("profile-covers", `${user.id}/cover.${ext}`, coverFile);
      }

      // upload service photos (if selected)
      const updatedRates: ServiceRates = { ...(serviceRates ?? {}) };

      for (const svc of SERVICES) {
        const f = serviceFiles[svc.key];
        if (!f) continue;

        const ext = f.name.split(".").pop() || "jpg";
        const path = await uploadFile("profile-portfolio", `${user.id}/${svc.key}.${ext}`, f);

        updatedRates[svc.key] = {
          rate: updatedRates[svc.key]?.rate ?? null,
          unit: svc.unit,
          photo_path: path,
        };
      }

      // ensure unit exists for every saved item
      for (const svc of SERVICES) {
        if (updatedRates[svc.key]) {
          updatedRates[svc.key] = {
            rate: updatedRates[svc.key]!.rate ?? null,
            unit: svc.unit,
            photo_path: updatedRates[svc.key]!.photo_path ?? null,
          };
        }
      }

      const u = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          nic_no: nicNo.trim(),
          address: address.trim(),
          whatsapp: whatsapp.trim(),
          avatar_path,
          cover_path,
          service_rates: updatedRates,
          profile_completed: true,
        })
        .eq("id", user.id);

      if (u.error) throw new Error(u.error.message);

      window.location.href = "/profile";
    } catch (e: any) {
      setMsg(e?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAuth>
      <Page title="Complete Profile">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {msg && <div className="rounded-xl border bg-neutral-50 p-3 text-sm">{msg}</div>}

          {/* Cover */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm font-semibold">Cover Image</div>
            <div className="mt-3 rounded-2xl overflow-hidden border bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreview || existingCover || "/placeholder-cover.png"}
                alt="cover"
                className="h-40 w-full object-cover"
              />
            </div>
            <input className="mt-3 text-sm" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* Avatar + basics */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="h-20 w-20 rounded-full overflow-hidden border bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarPreview || existingAvatar || "/placeholder-avatar.png"}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <input className="mt-2 text-sm" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} />
              </div>

              <div className="flex-1 grid gap-3">
                <div>
                  <div className="text-sm font-medium">Full Name</div>
                  <Input className="mt-2" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium">NIC No</div>
                    <Input className="mt-2" value={nicNo} onChange={(e) => setNicNo(e.target.value)} placeholder="NIC number" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">WhatsApp Number</div>
                    <Input className="mt-2" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="07XXXXXXXX" inputMode="tel" />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium">Address</div>
                  <Textarea className="mt-2" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Village / City / District" />
                </div>
              </div>
            </div>
          </div>

          {/* Service cards */}
          <div className="rounded-2xl border bg-white p-4">
            <div className="text-sm font-semibold">Services (Rate + Photo)</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((svc) => {
                const item = serviceRates?.[svc.key];
                const photoUrl = item?.photo_path
                  ? publicUrl("profile-portfolio", item.photo_path)
                  : null;

                return (
                  <div key={svc.key} className="rounded-2xl border p-3">
                    <div className="font-semibold">{svc.label}</div>
                    <div className="mt-1 text-xs text-neutral-500">Unit: {svc.unit}</div>

                    <div className="mt-3">
                      <div className="text-sm font-medium">Rate</div>
                      <Input
                        className="mt-2"
                        value={item?.rate ?? ""}
                        onChange={(e) => updateRate(svc.key, e.target.value)}
                        placeholder={`e.g. 350 (${svc.unit})`}
                        inputMode="numeric"
                      />
                    </div>

                    <div className="mt-3">
                      <div className="text-sm font-medium">Photo</div>
                      <div className="mt-2 h-24 rounded-xl overflow-hidden border bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl || "/placeholder-work.png"}
                          alt={svc.label}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <input
                        className="mt-2 text-sm"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setServiceFiles((p) => ({ ...p, [svc.key]: e.target.files?.[0] ?? null }))
                        }
                      />
                      {serviceFiles[svc.key] && (
                        <div className="mt-1 text-xs text-neutral-600">
                          Selected: {serviceFiles[svc.key]!.name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}