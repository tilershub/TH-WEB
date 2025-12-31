"use client";

import { useEffect, useMemo, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { CertificationManager } from "@/components/CertificationManager";
import { AvailabilitySettings } from "@/components/AvailabilitySettings";
import { PortfolioManager } from "@/components/PortfolioManager";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, ServiceRates, Certification, AvailabilityStatus } from "@/lib/types";
import { SERVICES, type ServiceKey } from "@/lib/services";
import { uploadFile, getPublicUrl, generateFilePath } from "@/lib/storage";
import { LoadingPage } from "@/components/LoadingSpinner";

type Step = 1 | 2 | 3 | 4 | 5;

export default function ProfileSetupPage() {
  const [meId, setMeId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<Step>(1);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [nicNo, setNicNo] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [serviceRates, setServiceRates] = useState<ServiceRates>({});
  const [serviceFiles, setServiceFiles] = useState<Record<string, File | null>>({});

  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>("available");
  const [workingDistricts, setWorkingDistricts] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState<number | null>(null);

  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile]
  );
  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : null),
    [coverFile]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data: s } = await supabase.auth.getSession();
        const user = s.session?.user;
        if (!user) return;

        setMeId(user.id);

        const p = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (p.error) throw p.error;

        const prof = (p.data ?? null) as Profile | null;
        setProfile(prof);

        if (prof?.role && prof.role !== "tiler") {
          window.location.href = "/profile";
          return;
        }

        setFullName(prof?.full_name ?? "");
        setBio(prof?.bio ?? "");
        setNicNo(prof?.nic_no ?? "");
        setAddress(prof?.address ?? "");
        setWhatsapp(prof?.whatsapp ?? "");
        setDistrict(prof?.district ?? "");
        setCity(prof?.city ?? "");
        setServiceRates((prof?.service_rates ?? {}) as ServiceRates);
        setAvailabilityStatus(prof?.availability_status ?? "available");
        setWorkingDistricts(prof?.working_districts ?? []);
        setYearsExperience(prof?.years_experience ?? null);

        const { data: certs } = await supabase
          .from("certifications")
          .select("*")
          .eq("tiler_id", user.id)
          .order("created_at", { ascending: false });

        setCertifications((certs as Certification[]) ?? []);
      } catch (err: any) {
        setMsg(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const existingAvatar = useMemo(
    () => getPublicUrl("profile-avatars", profile?.avatar_path),
    [profile?.avatar_path]
  );
  const existingCover = useMemo(
    () => getPublicUrl("profile-covers", profile?.cover_path),
    [profile?.cover_path]
  );

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

  const handleAddCertification = async (formData: any) => {
    if (!meId) throw new Error("Not authenticated");

    let image_path = null;

    if (formData.image) {
      const path = generateFilePath(meId, "certifications", formData.image);
      image_path = await uploadFile("certifications", path, formData.image);
    }

    const { error } = await supabase.from("certifications").insert({
      tiler_id: meId,
      title: formData.title.trim(),
      issuer: formData.issuer.trim(),
      issue_date: formData.issue_date,
      expiry_date: formData.expiry_date || null,
      certificate_number: formData.certificate_number.trim() || null,
      description: formData.description.trim() || null,
      image_path,
    });

    if (error) throw error;

    const { data: updated } = await supabase
      .from("certifications")
      .select("*")
      .eq("tiler_id", meId)
      .order("created_at", { ascending: false });

    setCertifications((updated as Certification[]) ?? []);
  };

  const handleRemoveCertification = async (id: string) => {
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) throw error;

    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);

    try {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) throw new Error("Please login.");

      if (!fullName.trim()) throw new Error("Enter your name.");
      if (!whatsapp.trim()) throw new Error("Enter WhatsApp number.");
      if (!nicNo.trim()) throw new Error("Enter NIC number.");
      if (!address.trim()) throw new Error("Enter address.");
      if (!district.trim()) throw new Error("Enter district.");
      if (!city.trim()) throw new Error("Enter city.");

      let avatar_path = profile?.avatar_path ?? null;
      let cover_path = profile?.cover_path ?? null;

      if (avatarFile) {
        const path = generateFilePath(user.id, "avatar", avatarFile);
        avatar_path = await uploadFile("profile-avatars", path, avatarFile);
      }

      if (coverFile) {
        const path = generateFilePath(user.id, "cover", coverFile);
        cover_path = await uploadFile("profile-covers", path, coverFile);
      }

      const updatedRates: ServiceRates = { ...(serviceRates ?? {}) };

      for (const svc of SERVICES) {
        const f = serviceFiles[svc.key];
        if (f) {
          const path = generateFilePath(user.id, `portfolio/${svc.key}`, f);
          const uploaded = await uploadFile("profile-portfolio", path, f);

          updatedRates[svc.key] = {
            rate: updatedRates[svc.key]?.rate ?? null,
            unit: svc.unit,
            photo_path: uploaded,
          };
        }
      }

      for (const svc of SERVICES) {
        if (updatedRates[svc.key]) {
          updatedRates[svc.key] = {
            rate: updatedRates[svc.key]!.rate ?? null,
            unit: svc.unit,
            photo_path: updatedRates[svc.key]!.photo_path ?? null,
          };
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          display_name: fullName.trim(),
          bio: bio.trim() || null,
          nic_no: nicNo.trim(),
          address: address.trim(),
          whatsapp: whatsapp.trim(),
          district: district.trim(),
          city: city.trim(),
          avatar_path,
          cover_path,
          service_rates: updatedRates,
          availability_status: availabilityStatus,
          working_districts: workingDistricts,
          years_experience: yearsExperience,
          profile_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      window.location.href = "/profile";
    } catch (e: any) {
      setMsg(e?.message || "Failed to save profile.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPage message="Loading profile setup..." />;

  const canProceedStep1 =
    fullName.trim() && nicNo.trim() && whatsapp.trim() && address.trim() && district.trim() && city.trim();

  const stepLabels = [
    "Basic Info",
    "Services & Rates",
    "Availability",
    "Portfolio",
    "Certifications",
  ];

  return (
    <RequireAuth>
      <Page title="Complete Your Tiler Profile">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
          {msg && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-fade-in">
              <strong>Error:</strong> {msg}
            </div>
          )}

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition ${
                  s <= step ? "bg-black" : "bg-neutral-200"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
            {stepLabels.map((label, idx) => (
              <span
                key={idx}
                className={`flex items-center gap-1 ${
                  idx + 1 <= step ? "text-black font-medium" : "text-neutral-400"
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                  idx + 1 < step ? "bg-green-500 text-white" : 
                  idx + 1 === step ? "bg-black text-white" : "bg-neutral-200"
                }`}>
                  {idx + 1 < step ? "✓" : idx + 1}
                </span>
                {label}
                {idx < stepLabels.length - 1 && <span className="text-neutral-300 ml-1">→</span>}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div className="rounded-2xl border bg-white p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4">Cover Photo</h3>
                <div className="rounded-2xl overflow-hidden border bg-neutral-100">
                  <img
                    src={
                      coverPreview ||
                      existingCover ||
                      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&w=800"
                    }
                    alt="cover"
                    className="h-48 w-full object-cover"
                  />
                </div>
                <input
                  className="mt-3 text-sm w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Recommended: 1200x300px. Showcase your best work!
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Photo & Details</h3>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="shrink-0">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-2 bg-neutral-100">
                      <img
                        src={
                          avatarPreview ||
                          existingAvatar ||
                          "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&w=200"
                        }
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <input
                      className="mt-2 text-sm"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    />
                  </div>

                  <div className="flex-1 w-full grid gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <Input
                        className="mt-2"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name as per NIC"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Bio / About You</label>
                      <Textarea
                        className="mt-2"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell homeowners about your experience, specialties, and why they should hire you..."
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        {bio.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4">Identification & Contact</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      NIC Number <span className="text-red-600">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      value={nicNo}
                      onChange={(e) => setNicNo(e.target.value)}
                      placeholder="e.g., 971234567V"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      WhatsApp Number <span className="text-red-600">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g., 0771234567"
                      inputMode="tel"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      District <span className="text-red-600">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g., Gampaha"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      City <span className="text-red-600">*</span>
                    </label>
                    <Input
                      className="mt-2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Kadawatha"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <Textarea
                      className="mt-2"
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your complete address..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                  Next: Services & Rates →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div className="rounded-2xl border bg-white p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-2">Your Services & Rates</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Set your rates for each service you offer. Leave blank for services you don't provide.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SERVICES.map((svc) => {
                    const item = serviceRates?.[svc.key];
                    const photoUrl = item?.photo_path
                      ? getPublicUrl("profile-portfolio", item.photo_path)
                      : null;
                    const fileSelected = serviceFiles[svc.key];

                    return (
                      <div
                        key={svc.key}
                        className="rounded-2xl border p-4 hover:border-neutral-300 transition"
                      >
                        <div className="font-semibold">{svc.label}</div>
                        <div className="mt-1 text-xs text-neutral-500">
                          {svc.description}
                        </div>

                        <div className="mt-3">
                          <label className="text-sm font-medium">Your Rate ({svc.unit})</label>
                          <Input
                            className="mt-2"
                            value={item?.rate ?? ""}
                            onChange={(e) => updateRate(svc.key, e.target.value)}
                            placeholder={`e.g., 350`}
                            inputMode="numeric"
                          />
                        </div>

                        <div className="mt-3">
                          <label className="text-sm font-medium">Sample Photo</label>
                          <div className="mt-2 h-24 rounded-xl overflow-hidden border bg-neutral-100">
                            {fileSelected ? (
                              <img
                                src={URL.createObjectURL(fileSelected)}
                                alt={svc.label}
                                className="h-full w-full object-cover"
                              />
                            ) : photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={svc.label}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-neutral-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <input
                            className="mt-2 text-xs w-full"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setServiceFiles((p) => ({
                                ...p,
                                [svc.key]: e.target.files?.[0] ?? null,
                              }))
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next: Availability →
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-slide-up">
              <div className="rounded-2xl border bg-white p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-2">Availability & Working Areas</h3>
                <p className="text-sm text-neutral-600 mb-6">
                  Let homeowners know when you're available and where you work.
                </p>

                <AvailabilitySettings
                  availabilityStatus={availabilityStatus}
                  workingDistricts={workingDistricts}
                  yearsExperience={yearsExperience}
                  onStatusChange={setAvailabilityStatus}
                  onDistrictsChange={setWorkingDistricts}
                  onExperienceChange={setYearsExperience}
                  disabled={saving}
                />
              </div>

              <div className="flex gap-2 justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button onClick={() => setStep(4)}>
                  Next: Portfolio →
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-slide-up">
              <div className="rounded-2xl border bg-white p-4 md:p-6">
                {meId && (
                  <PortfolioManager tilerId={meId} disabled={saving} />
                )}
              </div>

              <div className="flex gap-2 justify-between">
                <Button variant="secondary" onClick={() => setStep(3)}>
                  ← Back
                </Button>
                <Button onClick={() => setStep(5)}>
                  Next: Certifications →
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-slide-up">
              <div className="rounded-2xl border bg-white p-4 md:p-6">
                <CertificationManager
                  certifications={certifications}
                  onAdd={handleAddCertification}
                  onRemove={handleRemoveCertification}
                  disabled={saving}
                />
              </div>

              <div className="rounded-2xl border bg-white p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-2">Ready to Complete?</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Your profile will be visible to homeowners looking for professional
                  tilers. Make sure all information is accurate.
                </p>

                <div className="flex gap-2 justify-between">
                  <Button variant="secondary" onClick={() => setStep(4)}>
                    ← Back
                  </Button>
                  <Button onClick={save} disabled={saving}>
                    {saving ? "Saving Profile..." : "Complete Profile"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Page>
    </RequireAuth>
  );
}
