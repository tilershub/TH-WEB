"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { LoadingPage } from "@/components/LoadingPage";
import { uploadFile, getPublicUrl, generateFilePath } from "@/lib/storage";
import type { Certification } from "@/lib/types";

const SRI_LANKA_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle"
];

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  bio: string | null;
  whatsapp: string | null;
  district: string | null;
  city: string | null;
  address: string | null;
  nic_no: string | null;
  service_rates: Record<string, any> | null;
  availability_status: string | null;
  working_districts: string[] | null;
  years_experience: number | null;
  avatar_path: string | null;
  cover_path: string | null;
};

export default function TaskerProfileSetup() {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [nicNo, setNicNo] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [workingDistricts, setWorkingDistricts] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertFile, setNewCertFile] = useState<File | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          setError("පැතිකඩ හමු නොවීය. කරුණාකර පිටවී නැවත ගිණුමක් සාදන්න.");
        } else {
          setError(`පැතිකඩ ලබාගැනීමේ දෝෂය: ${fetchError.message}`);
        }
        setLoading(false);
        return;
      }

      if (!data) {
        setError("පැතිකඩ හමු නොවීය. කරුණාකර පිටවී නැවත ගිණුමක් සාදන්න.");
        setLoading(false);
        return;
      }

      const p = data as Profile;
      setProfile(p);

      setFullName(p.full_name || "");
      setBio(p.bio || "");
      setWhatsapp(p.whatsapp || "");
      setDistrict(p.district || "");
      setCity(p.city || "");
      setAddress(p.address || "");
      setNicNo(p.nic_no || "");
      setYearsExperience(p.years_experience?.toString() || "");
      setWorkingDistricts(p.working_districts || []);

      setAvatarUrl(getPublicUrl("profile-avatars", p.avatar_path));

      const { data: certs } = await supabase
        .from("certifications")
        .select("*")
        .eq("tiler_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (certs) setCertifications(certs as Certification[]);

    } catch (err: any) {
      setError(err?.message || "පැතිකඩ ලබාගැනීමට අසමත් විය");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingAvatar(true);
    setError(null);

    try {
      const path = generateFilePath(profile.id, "avatar", file);
      await uploadFile("profile-avatars", path, file);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_path: path })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setAvatarUrl(getPublicUrl("profile-avatars", path));
      setSuccess("පැතිකඩ ඡායාරූපය යාවත්කාලීන විය!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "ඡායාරූපය උඩුගත කිරීමට අසමත් විය");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddCertificate = async () => {
    if (!profile || !newCertTitle.trim()) return;

    setUploadingCert(true);
    setError(null);

    try {
      let imagePath: string | null = null;
      
      if (newCertFile) {
        imagePath = generateFilePath(profile.id, "cert", newCertFile);
        await uploadFile("certifications", imagePath, newCertFile);
      }

      const { data, error: insertError } = await supabase
        .from("certifications")
        .insert({
          tiler_id: profile.id,
          title: newCertTitle.trim(),
          issuer: newCertIssuer.trim() || null,
          image_path: imagePath,
          issue_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCertifications(prev => [data as Certification, ...prev]);
      setNewCertTitle("");
      setNewCertIssuer("");
      setNewCertFile(null);
      if (certInputRef.current) certInputRef.current.value = "";
      setSuccess("සහතිකය එක් කරන ලදි!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "සහතිකය එක් කිරීමට අසමත් විය");
    } finally {
      setUploadingCert(false);
    }
  };

  const handleDeleteCertificate = async (certId: string) => {
    try {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", certId);

      if (error) throw error;

      setCertifications(prev => prev.filter(c => c.id !== certId));
    } catch (err: any) {
      setError(err?.message || "සහතිකය මකා දැමීමට අසමත් විය");
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          bio: bio.trim() || null,
          whatsapp: whatsapp.trim() || null,
          district: district || null,
          city: city.trim() || null,
          address: address.trim() || null,
          nic_no: nicNo.trim() || null,
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          working_districts: workingDistricts.length > 0 ? workingDistricts : null,
          profile_completed: true,
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setSuccess("පැතිකඩ සාර්ථකව සුරකින ලදී!");
      setTimeout(() => {
        setSuccess(null);
        router.push("/profile");
      }, 1500);

    } catch (err: any) {
      setError(err?.message || "පැතිකඩ සුරැකීමට අසමත් විය");
    } finally {
      setSaving(false);
    }
  };

  const toggleWorkingDistrict = (d: string) => {
    setWorkingDistricts(prev =>
      prev.includes(d)
        ? prev.filter(x => x !== d)
        : [...prev, d]
    );
  };

  if (loading) {
    return <LoadingPage message="ඔබගේ පැතිකඩ ලබාගනිමින්..." />;
  }

  return (
    <Page
      title="සේවාදායක පැතිකඩ සැකසීම"
      description="කාර්ය ඉල්ලීම් ලබාගැනීම සඳහා ඔබගේ පැතිකඩ සම්පූර්ණ කරන්න."
    >
      <div className="max-w-3xl mx-auto px-4 py-6 pb-36 space-y-6">
        {(error || success) && (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="relative">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-primary to-primary-dark overflow-hidden shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="පැතිකඩ ඡායාරූපය" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {fullName?.[0]?.toUpperCase() || "S"}
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
              >
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">ඡායාරූප උඩුගත කිරීමට අයිකන ටැප් කරන්න</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-navy mb-4">මූලික තොරතුරු</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">සම්පූර්ණ නම *</label>
              <Input
                className="mt-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ඔබගේ සම්පූර්ණ නම"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp අංකය *</label>
              <Input
                className="mt-2"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+94 77 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ජා.හැ. අංකය</label>
              <Input
                className="mt-2"
                value={nicNo}
                onChange={(e) => setNicNo(e.target.value)}
                placeholder="123456789V හෝ 200012345678"
              />
              <p className="text-xs text-gray-400 mt-1">සත්‍යාපනය සඳහා පමණි (පොදු දර්ශනය නොවේ)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ඔබ ගැන / හැඳින්වීම</label>
              <Textarea
                className="mt-2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="ඔබගේ අත්දැකීම් සහ කුසලතා ගැන කියන්න..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">දිස්ත්‍රික්කය *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">තෝරන්න</option>
                  {SRI_LANKA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">නගරය</label>
                <Input
                  className="mt-2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="ඔබගේ නගරය"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ලිපිනය</label>
              <Input
                className="mt-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ඔබගේ ව්‍යාපාර ලිපිනය"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">අත්දැකීම් වසර</label>
              <Input
                className="mt-2"
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="5"
                min="0"
                max="50"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-navy mb-4">කාර්ය ප්‍රදේශ</h2>
          <p className="text-sm text-gray-500 mb-4">ඔබට සේවය සැපයිය හැකි දිස්ත්‍රික්ක තෝරන්න</p>

          <div className="flex flex-wrap gap-2">
            {SRI_LANKA_DISTRICTS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => toggleWorkingDistrict(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  workingDistricts.includes(d)
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-navy mb-4">සහතික හා සුදුසුකම්</h2>
          <p className="text-sm text-gray-500 mb-4">ඔබගේ වෘත්තීය සහතික එක් කරන්න</p>

          {certifications.length > 0 && (
            <div className="space-y-3 mb-4">
              {certifications.map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {cert.image_path && (
                      <img
                        src={getPublicUrl("certifications", cert.image_path) || ""}
                        alt={cert.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm text-gray-900">{cert.title}</p>
                      {cert.issuer && <p className="text-xs text-gray-500">{cert.issuer}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCertificate(cert.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <Input
              value={newCertTitle}
              onChange={(e) => setNewCertTitle(e.target.value)}
              placeholder="සහතිකයේ නම (උදා: NVQ Level 3)"
            />
            <Input
              value={newCertIssuer}
              onChange={(e) => setNewCertIssuer(e.target.value)}
              placeholder="නිකුත් කළ ආයතනය (විකල්ප)"
            />
            <div className="flex items-center gap-2">
              <input
                ref={certInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setNewCertFile(e.target.files?.[0] || null)}
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            <Button
              onClick={handleAddCertificate}
              disabled={uploadingCert || !newCertTitle.trim()}
              className="w-full"
              variant="secondary"
            >
              {uploadingCert ? "එක් වෙමින්..." : "සහතිකය එක් කරන්න"}
            </Button>
          </div>
        </section>

        <div className="fixed bottom-20 left-0 right-0 bg-white/95 border-t border-gray-200 p-4 shadow-lg backdrop-blur">
          <div className="max-w-3xl mx-auto">
            <Button
              onClick={handleSave}
              disabled={saving || !fullName.trim() || !whatsapp.trim() || !district}
              className="w-full"
            >
              {saving ? "සුරැකෙමින්..." : "පැතිකඩ සුරකින්න"}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
