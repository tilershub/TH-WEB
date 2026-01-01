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

type SectionKey = "photos" | "basic" | "services" | "availability" | "portfolio" | "certifications";

interface SectionProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  completed?: boolean;
}

function Section({ title, description, isOpen, onToggle, children, onSave, saving, completed }: SectionProps) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            completed ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
          }`}>
            {completed ? "✓" : "○"}
          </div>
          <div>
            <h3 className="font-semibold text-navy">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="border-t px-4 py-5 space-y-4 animate-fade-in">
          {children}
          {onSave && (
            <div className="pt-3 border-t flex justify-end">
              <Button onClick={onSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfileSetupPage() {
  const [meId, setMeId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<SectionKey | null>("photos");

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

  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>("available");
  const [workingDistricts, setWorkingDistricts] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState<number | null>(null);

  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [saving, setSaving] = useState<SectionKey | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

        // Fetch profile
        const p = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (p.error) {
          console.error("Profile fetch error:", p.error);
          console.error("Error code:", p.error.code);
          console.error("Error details:", p.error.details);
          console.error("Error hint:", p.error.hint);
          // Check if it's an RLS error which means tables might not exist
          if (p.error.message.includes("row-level security") || p.error.message.includes("does not exist")) {
            throw new Error("Database security policies need to be set up. Please run 'fix_rls_complete.sql' in Supabase SQL Editor.");
          }
          throw new Error(`Profile error: ${p.error.code} - ${p.error.message}`);
        }

        const prof = (p.data ?? null) as Profile | null;
        
        // If no profile exists, show error - profile should be auto-created on signup
        if (!prof) {
          throw new Error("Profile not found. Please sign out and sign in again, or run the database migrations.");
        }
        
        setProfile(prof);

        // If user is homeowner, ask them to become a tiler first
        if (prof.role === "homeowner") {
          throw new Error("Please switch to a tiler account first. Go to Profile > Edit Profile and click 'Become a Tiler'.");
        }

        setFullName(prof.full_name ?? "");
        setBio(prof.bio ?? "");
        setNicNo(prof.nic_no ?? "");
        setAddress(prof.address ?? "");
        setWhatsapp(prof.whatsapp ?? "");
        setDistrict(prof.district ?? "");
        setCity(prof.city ?? "");
        setServiceRates((prof.service_rates ?? {}) as ServiceRates);
        setAvailabilityStatus(prof.availability_status ?? "available");
        setWorkingDistricts(prof.working_districts ?? []);
        setYearsExperience(prof.years_experience ?? null);

        // Fetch certifications (ignore errors if table doesn't have proper policies)
        const { data: certs, error: certError } = await supabase
          .from("certifications")
          .select("*")
          .eq("tiler_id", user.id)
          .order("created_at", { ascending: false });
        
        if (certError) {
          console.warn("Could not load certifications:", certError.message);
          // Don't throw - just skip certifications if there's an RLS issue
        } else {
          setCertifications((certs as Certification[]) ?? []);
        }
      } catch (err: any) {
        console.error("PROFILE SETUP LOAD ERROR:", err);
        console.error("Error stack:", err?.stack);
        setMsg({ type: "error", text: err?.message || "Failed to load profile" });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Log any msg changes
  useEffect(() => {
    if (msg) {
      console.log("MSG STATE CHANGED:", msg);
    }
  }, [msg]);

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
      [key]: { ...prev[key], rate },
    }));
  };

  const toggleService = (key: ServiceKey, enabled: boolean) => {
    const service = SERVICES.find((s) => s.key === key);
    if (!service) return;
    
    if (enabled) {
      setServiceRates((prev) => ({
        ...prev,
        [key]: { rate: prev[key]?.rate ?? null, unit: service.unit, photo_path: null },
      }));
    } else {
      setServiceRates((prev) => {
        const newRates = { ...prev };
        delete newRates[key];
        return newRates;
      });
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const savePhotos = async () => {
    if (!meId) return;
    setSaving("photos");
    try {
      let avatar_path = profile?.avatar_path;
      let cover_path = profile?.cover_path;

      if (avatarFile) {
        const path = generateFilePath(meId, "avatar", avatarFile);
        await uploadFile("profile-avatars", path, avatarFile);
        avatar_path = path;
      }

      if (coverFile) {
        const path = generateFilePath(meId, "cover", coverFile);
        await uploadFile("profile-covers", path, coverFile);
        cover_path = path;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_path, cover_path })
        .eq("id", meId);

      if (error) throw error;

      setProfile((p) => p ? { ...p, avatar_path, cover_path } : null);
      setAvatarFile(null);
      setCoverFile(null);
      showMessage("success", "Photos updated!");
    } catch (err: any) {
      showMessage("error", err?.message || "Failed to save photos");
    } finally {
      setSaving(null);
    }
  };

  const saveBasicInfo = async () => {
    if (!meId) return;
    setSaving("basic");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          bio: bio.trim() || null,
          nic_no: nicNo.trim() || null,
          address: address.trim() || null,
          whatsapp: whatsapp.trim() || null,
          district: district.trim() || null,
          city: city.trim() || null,
        })
        .eq("id", meId);

      if (error) throw error;
      showMessage("success", "Basic info updated!");
    } catch (err: any) {
      showMessage("error", err?.message || "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const saveServices = async () => {
    if (!meId) return;
    setSaving("services");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ service_rates: serviceRates })
        .eq("id", meId);

      if (error) throw error;
      showMessage("success", "Services updated!");
    } catch (err: any) {
      showMessage("error", err?.message || "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const saveAvailability = async () => {
    if (!meId) return;
    setSaving("availability");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          availability_status: availabilityStatus,
          working_districts: workingDistricts,
          years_experience: yearsExperience,
        })
        .eq("id", meId);

      if (error) throw error;
      showMessage("success", "Availability updated!");
    } catch (err: any) {
      showMessage("error", err?.message || "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const handleAddCertification = async (data: {
    title: string;
    issuer: string;
    issue_date: string;
    expiry_date: string;
    certificate_number: string;
    description: string;
    image?: File | null;
  }) => {
    if (!meId) return;
    
    let image_path = null;
    if (data.image) {
      const path = generateFilePath(meId, "cert", data.image);
      await uploadFile("certifications", path, data.image);
      image_path = path;
    }

    const { data: newCert, error } = await supabase
      .from("certifications")
      .insert({
        tiler_id: meId,
        title: data.title,
        issuer: data.issuer,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date || null,
        certificate_number: data.certificate_number || null,
        description: data.description || null,
        image_path,
      })
      .select()
      .single();

    if (error) throw error;
    setCertifications((prev) => [newCert as Certification, ...prev]);
    showMessage("success", "Certification added!");
  };

  const handleRemoveCertification = async (id: string) => {
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) throw error;
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    showMessage("success", "Certification removed");
  };

  const isPhotosComplete = Boolean(profile?.avatar_path || avatarFile);
  const isBasicComplete = Boolean(fullName.trim() && whatsapp.trim() && district.trim());
  const isServicesComplete = Object.keys(serviceRates).length > 0;
  const isAvailabilityComplete = workingDistricts.length > 0;
  const isCertificationsComplete = certifications.length > 0;

  const completedCount = [
    isPhotosComplete,
    isBasicComplete,
    isServicesComplete,
    isAvailabilityComplete,
    isCertificationsComplete,
  ].filter(Boolean).length;

  if (loading) return <LoadingPage message="Loading profile..." />;

  return (
    <RequireAuth>
      <Page title="My Tiler Profile">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-navy">My Tiler Profile</h1>
            <p className="text-gray-500 mt-1">Update your details anytime</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="h-2 flex-1 max-w-xs bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(completedCount / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">{completedCount}/5 complete</span>
            </div>
          </div>

          {msg && (
            <div className={`rounded-xl p-3 text-sm animate-fade-in ${
              msg.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {msg.text}
            </div>
          )}

          <Section
            title="Profile Photos"
            description="Add your profile and cover photos"
            isOpen={openSection === "photos"}
            onToggle={() => setOpenSection(openSection === "photos" ? null : "photos")}
            onSave={savePhotos}
            saving={saving === "photos"}
            completed={isPhotosComplete}
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Cover Photo</label>
                <div className="mt-2 rounded-xl overflow-hidden border bg-gray-100">
                  <img
                    src={
                      coverPreview ||
                      existingCover ||
                      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&w=800"
                    }
                    alt="cover"
                    className="h-32 w-full object-cover"
                  />
                </div>
                <input
                  className="mt-2 text-sm"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Profile Photo</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 bg-gray-100">
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
                    type="file"
                    accept="image/*"
                    className="text-sm"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Basic Information"
            description="Your name, contact, and location"
            isOpen={openSection === "basic"}
            onToggle={() => setOpenSection(openSection === "basic" ? null : "basic")}
            onSave={saveBasicInfo}
            saving={saving === "basic"}
            completed={isBasicComplete}
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                <Input
                  className="mt-1"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Bio / About You</label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell homeowners about your experience..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{bio.length}/500</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">NIC Number</label>
                  <Input
                    className="mt-1"
                    value={nicNo}
                    onChange={(e) => setNicNo(e.target.value)}
                    placeholder="971234567V"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">WhatsApp <span className="text-red-500">*</span></label>
                  <Input
                    className="mt-1"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0771234567"
                    inputMode="tel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">District <span className="text-red-500">*</span></label>
                  <Input
                    className="mt-1"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Colombo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    className="mt-1"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Nugegoda"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <Textarea
                  className="mt-1"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your complete address"
                />
              </div>
            </div>
          </Section>

          <Section
            title="Services & Rates"
            description="Select services you offer and set prices"
            isOpen={openSection === "services"}
            onToggle={() => setOpenSection(openSection === "services" ? null : "services")}
            onSave={saveServices}
            saving={saving === "services"}
            completed={isServicesComplete}
          >
            <div className="space-y-3">
              {SERVICES.map((service) => {
                const isEnabled = service.key in serviceRates;
                const current = serviceRates[service.key];
                return (
                  <div
                    key={service.key}
                    className={`p-3 rounded-xl border transition ${
                      isEnabled ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => toggleService(service.key, e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <div>
                          <span className="font-medium">{service.label}</span>
                          <p className="text-xs text-gray-500">{service.unit}</p>
                        </div>
                      </label>
                      {isEnabled && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-500">Rs.</span>
                          <Input
                            className="w-24"
                            type="number"
                            value={current?.rate ?? ""}
                            onChange={(e) => updateRate(service.key, e.target.value)}
                            placeholder="Rate"
                            inputMode="numeric"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section
            title="Availability"
            description="Set your status and working areas"
            isOpen={openSection === "availability"}
            onToggle={() => setOpenSection(openSection === "availability" ? null : "availability")}
            onSave={saveAvailability}
            saving={saving === "availability"}
            completed={isAvailabilityComplete}
          >
            <AvailabilitySettings
              availabilityStatus={availabilityStatus}
              workingDistricts={workingDistricts}
              yearsExperience={yearsExperience}
              onStatusChange={setAvailabilityStatus}
              onDistrictsChange={setWorkingDistricts}
              onExperienceChange={setYearsExperience}
            />
          </Section>

          <Section
            title="Portfolio"
            description="Showcase your completed work"
            isOpen={openSection === "portfolio"}
            onToggle={() => setOpenSection(openSection === "portfolio" ? null : "portfolio")}
            completed={false}
          >
            {meId && <PortfolioManager tilerId={meId} />}
          </Section>

          <Section
            title="Certifications"
            description="Add professional qualifications"
            isOpen={openSection === "certifications"}
            onToggle={() => setOpenSection(openSection === "certifications" ? null : "certifications")}
            completed={isCertificationsComplete}
          >
            <CertificationManager
              certifications={certifications}
              onAdd={handleAddCertification}
              onRemove={handleRemoveCertification}
            />
          </Section>

          <div className="pt-4 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => window.location.href = "/profile"}
              className="flex-1"
            >
              View My Profile
            </Button>
            <Button
              onClick={() => window.location.href = `/tilers/${meId}`}
              className="flex-1"
            >
              Preview Public Page
            </Button>
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}
