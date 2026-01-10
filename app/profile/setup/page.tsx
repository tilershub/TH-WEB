"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { LoadingPage } from "@/components/LoadingPage";
import { SERVICES } from "@/lib/services";
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

type ServiceRate = {
  rate: number | null;
  unit: string;
  photo_path?: string | null;
};

type ServiceDetail = {
  id: string;
  title: string;
  level: string;
  tileSize: string;
  sqft: string;
  rate: string;
  photo_path?: string | null;
};

export default function TaskerProfileSetup() {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
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
  const [serviceMode, setServiceMode] = useState<"single" | "multiple">("single");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceRates, setServiceRates] = useState<Record<string, ServiceRate>>({});
  const [serviceDetails, setServiceDetails] = useState<Record<string, ServiceDetail[]>>({});
  const [workingDistricts, setWorkingDistricts] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertFile, setNewCertFile] = useState<File | null>(null);
  const [uploadingServiceImage, setUploadingServiceImage] = useState<string | null>(null);
  const [uploadingDetailImage, setUploadingDetailImage] = useState<{ serviceKey: string; detailId: string } | null>(null);
  const serviceImageRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const serviceDetailImageRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
      
      if (p.service_rates && typeof p.service_rates === "object") {
        const serviceKeys = Object.keys(p.service_rates);
        setSelectedServices(serviceKeys);
        setServiceRates(p.service_rates as Record<string, ServiceRate>);
        const detailsByService: Record<string, ServiceDetail[]> = {};
        serviceKeys.forEach(key => {
          const details = (p.service_rates as Record<string, any>)[key]?.details;
          if (Array.isArray(details)) {
            detailsByService[key] = details.map((detail: Record<string, any>) => ({
              id: detail.id ?? crypto.randomUUID(),
              title: detail.title ?? "",
              level: detail.level ?? "",
              tileSize: detail.tile_size ?? "",
              sqft: detail.sqft !== undefined && detail.sqft !== null ? String(detail.sqft) : "",
              rate: detail.rate !== undefined && detail.rate !== null ? String(detail.rate) : "",
              photo_path: detail.photo_path ?? null,
            }));
          }
        });
        setServiceDetails(detailsByService);
        setServiceMode(serviceKeys.length > 1 ? "multiple" : "single");
      }

      setAvatarUrl(getPublicUrl("profile-avatars", p.avatar_path));
      setCoverUrl(getPublicUrl("profile-covers", p.cover_path));

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

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingCover(true);
    setError(null);

    try {
      const path = generateFilePath(profile.id, "cover", file);
      await uploadFile("profile-covers", path, file);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cover_path: path })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setCoverUrl(getPublicUrl("profile-covers", path));
      setSuccess("කවර ඡායාරූපය යාවත්කාලීන විය!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "කවර ඡායාරූපය උඩුගත කිරීමට අසමත් විය");
    } finally {
      setUploadingCover(false);
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

  const handleServiceImageUpload = async (serviceKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingServiceImage(serviceKey);
    setError(null);

    try {
      const path = generateFilePath(profile.id, `services/${serviceKey}`, file);
      await uploadFile("portfolio", path, file);

      setServiceRates(prev => ({
        ...prev,
        [serviceKey]: {
          ...prev[serviceKey],
          photo_path: path,
        }
      }));

      setSuccess("සේවා ඡායාරූපය උඩුගත විය!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "සේවා ඡායාරූපය උඩුගත කිරීමට අසමත් විය");
    } finally {
      setUploadingServiceImage(null);
    }
  };

  const addServiceDetail = (serviceKey: string) => {
    setServiceDetails(prev => ({
      ...prev,
      [serviceKey]: [
        ...(prev[serviceKey] || []),
        {
          id: crypto.randomUUID(),
          title: "",
          level: "",
          tileSize: "",
          sqft: "",
          rate: "",
          photo_path: null,
        },
      ],
    }));
  };

  const updateServiceDetail = (
    serviceKey: string,
    detailId: string,
    field: keyof Omit<ServiceDetail, "id">,
    value: string
  ) => {
    setServiceDetails(prev => ({
      ...prev,
      [serviceKey]: (prev[serviceKey] || []).map(detail =>
        detail.id === detailId ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  const removeServiceDetail = (serviceKey: string, detailId: string) => {
    setServiceDetails(prev => ({
      ...prev,
      [serviceKey]: (prev[serviceKey] || []).filter(detail => detail.id !== detailId),
    }));
  };

  const handleServiceDetailImageUpload = async (
    serviceKey: string,
    detailId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingDetailImage({ serviceKey, detailId });
    setError(null);

    try {
      const path = generateFilePath(profile.id, `services/${serviceKey}/${detailId}`, file);
      await uploadFile("portfolio", path, file);

      setServiceDetails(prev => ({
        ...prev,
        [serviceKey]: (prev[serviceKey] || []).map(detail =>
          detail.id === detailId ? { ...detail, photo_path: path } : detail
        ),
      }));

      setSuccess("සේවා විස්තර ඡායාරූපය උඩුගත විය!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "සේවා විස්තර ඡායාරූපය උඩුගත කිරීමට අසමත් විය");
    } finally {
      setUploadingDetailImage(null);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const finalServiceRates: Record<string, any> = {};
      selectedServices.forEach(key => {
        const svc = SERVICES.find(s => s.key === key);
        if (svc) {
          const existing = serviceRates[key];
          const details = (serviceDetails[key] || [])
            .filter(detail => detail.title.trim())
            .map(detail => ({
              id: detail.id,
              title: detail.title.trim() || null,
              level: detail.level.trim() || null,
              tile_size: detail.tileSize.trim() || null,
              sqft: detail.sqft ? parseFloat(detail.sqft) : null,
              rate: detail.rate ? parseFloat(detail.rate) : null,
              photo_path: detail.photo_path ?? null,
            }));
          finalServiceRates[key] = { 
            rate: existing?.rate ?? null, 
            unit: svc.unit,
            photo_path: existing?.photo_path ?? null,
            details: details.length > 0 ? details : null,
          };
        }
      });

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
          service_rates: Object.keys(finalServiceRates).length > 0 ? finalServiceRates : null,
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

  const handleServiceModeChange = (mode: "single" | "multiple") => {
    setServiceMode(mode);
    if (mode === "single" && selectedServices.length > 1) {
      const [firstKey] = selectedServices;
      const firstRate = serviceRates[firstKey];
      const firstDetails = serviceDetails[firstKey];
      setSelectedServices(firstKey ? [firstKey] : []);
      setServiceRates(firstKey ? { [firstKey]: firstRate } : {});
      setServiceDetails(firstKey ? { [firstKey]: firstDetails || [] } : {});
    }
  };

  const toggleService = (key: string) => {
    setSelectedServices(prev => {
      if (prev.includes(key)) {
        const newRates = { ...serviceRates };
        delete newRates[key];
        setServiceRates(newRates);
        const newDetails = { ...serviceDetails };
        delete newDetails[key];
        setServiceDetails(newDetails);
        return prev.filter(k => k !== key);
      }
      const svc = SERVICES.find(s => s.key === key);
      if (svc) {
        if (serviceMode === "single") {
          setServiceRates({ [key]: { rate: null, unit: svc.unit } });
          setServiceDetails(prev => ({ [key]: prev[key] || [] }));
          return [key];
        }
        setServiceRates(r => ({ ...r, [key]: { rate: null, unit: svc.unit } }));
      }
      return serviceMode === "single" ? [key] : [...prev, key];
    });
  };

  const updateServiceRate = (key: string, rate: string) => {
    const numRate = rate ? parseFloat(rate) : null;
    const svc = SERVICES.find(s => s.key === key);
    setServiceRates(prev => ({
      ...prev,
      [key]: { 
        ...prev[key],
        rate: numRate, 
        unit: svc?.unit || "LKR/sqft" 
      }
    }));
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

        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-primary to-primary-dark">
            {coverUrl && (
              <img src={coverUrl} alt="කවර ඡායාරූපය" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute bottom-3 right-3 z-10 bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1 shadow-md"
            >
              {uploadingCover ? (
                "උඩුගත වෙමින්..."
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  කවර ඡායාරූපය
                </>
              )}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>

          <div className="px-6 pb-5 -mt-10 relative">
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
          <h2 className="text-lg font-semibold text-navy mb-2">සේවා සහ ගාස්තු</h2>
          <p className="text-sm text-gray-500 mb-4">ඔබ ලබාදෙන සේවා තෝරා ගාස්තු සකසන්න</p>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">ඔබේ සේවා හැඳින්වීම</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleServiceModeChange("single")}
                className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  serviceMode === "single"
                    ? "border-primary bg-white text-primary"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>එක සේවාවක් පමණයි</span>
                  {serviceMode === "single" && (
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">තනි සේවාවක් පමණක් තෝරාගන්න.</p>
              </button>
              <button
                type="button"
                onClick={() => handleServiceModeChange("multiple")}
                className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  serviceMode === "multiple"
                    ? "border-primary bg-white text-primary"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>බහු සේවාවන් (සමාගම්/කණ්ඩායම්)</span>
                  {serviceMode === "multiple" && (
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">බහු සේවා සපයන්නේ නම් තෝරන්න.</p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {SERVICES.map(service => {
              const isSelected = selectedServices.includes(service.key);
              const rate = serviceRates[service.key]?.rate;

              return (
                <div
                  key={service.key}
                  className={`rounded-xl border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleService(service.key)}
                    className="w-full p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-gray-300"
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-gray-900">{service.label}</span>
                        <p className="text-xs text-gray-500">{service.unit}</p>
                      </div>
                    </div>
                  </button>

                  {isSelected && (
                    <div className="px-4 pb-4 pt-0 space-y-3">
                      <div className="flex items-center gap-2 ml-8">
                        <span className="text-xs text-gray-500">ගාස්තු:</span>
                        <input
                          type="number"
                          value={rate || ""}
                          onChange={(e) => updateServiceRate(service.key, e.target.value)}
                          placeholder="0"
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                        <span className="text-xs text-gray-500">{service.unit}</span>
                      </div>

                      <div className="ml-8 rounded-lg border border-dashed border-gray-200 p-3 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-gray-700">සේවා විස්තර (උදා: Floor Tiling, Bathroom plumbing)</p>
                            <p className="text-[11px] text-gray-500">අදාළ තොරතුරු එක් කරන්න - Floor level, tile size, sq.ft, rate වැනි දේ.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addServiceDetail(service.key)}
                            className="text-xs font-medium text-primary hover:text-primary/80"
                          >
                            + සේවාවක් එක් කරන්න
                          </button>
                        </div>
                        <div className="mt-3 space-y-3">
                          {(serviceDetails[service.key] || []).map(detail => {
                            const isUploadingDetail =
                              uploadingDetailImage?.serviceKey === service.key &&
                              uploadingDetailImage.detailId === detail.id;
                            const imageKey = `${service.key}:${detail.id}`;

                            return (
                              <div key={detail.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-semibold text-gray-700">සේවා විස්තරය</p>
                                  <button
                                    type="button"
                                    onClick={() => removeServiceDetail(service.key, detail.id)}
                                    className="text-[11px] text-red-600 hover:text-red-500"
                                  >
                                    ඉවත් කරන්න
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <div>
                                    <label className="text-[11px] text-gray-500">සේවා නම</label>
                                    <Input
                                      className="mt-1"
                                      value={detail.title}
                                      onChange={(e) => updateServiceDetail(service.key, detail.id, "title", e.target.value)}
                                      placeholder="Floor Tiling"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] text-gray-500">Floor level / Type</label>
                                    <Input
                                      className="mt-1"
                                      value={detail.level}
                                      onChange={(e) => updateServiceDetail(service.key, detail.id, "level", e.target.value)}
                                      placeholder="Ground floor / Basic"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] text-gray-500">Tile size</label>
                                    <Input
                                      className="mt-1"
                                      value={detail.tileSize}
                                      onChange={(e) => updateServiceDetail(service.key, detail.id, "tileSize", e.target.value)}
                                      placeholder="600×600"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] text-gray-500">Sq.ft</label>
                                    <Input
                                      className="mt-1"
                                      value={detail.sqft}
                                      onChange={(e) => updateServiceDetail(service.key, detail.id, "sqft", e.target.value)}
                                      placeholder="120"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] text-gray-500">Rate</label>
                                    <Input
                                      className="mt-1"
                                      value={detail.rate}
                                      onChange={(e) => updateServiceDetail(service.key, detail.id, "rate", e.target.value)}
                                      placeholder="2500"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {detail.photo_path ? (
                                    <img
                                      src={getPublicUrl("portfolio", detail.photo_path) || ""}
                                      alt={`${detail.title || service.label} detail`}
                                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
                                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => serviceDetailImageRefs.current[imageKey]?.click()}
                                    disabled={isUploadingDetail}
                                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    {isUploadingDetail ? (
                                      <>
                                        <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                                        උඩුගත වෙමින්...
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        {detail.photo_path ? "වෙනස් කරන්න" : "උඩුගත කරන්න"}
                                      </>
                                    )}
                                  </button>
                                  <input
                                    ref={(el) => { serviceDetailImageRefs.current[imageKey] = el; }}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleServiceDetailImageUpload(service.key, detail.id, e)}
                                    className="hidden"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="ml-8">
                        <p className="text-xs text-gray-500 mb-2">මෙම සේවාව සඳහා උදාහරණ ඡායාරූපයක් එක් කරන්න (පෝර්ට්ෆෝලියෝවෙහි දිස්වේ)</p>
                        <div className="flex items-center gap-3">
                          {serviceRates[service.key]?.photo_path ? (
                            <img
                              src={getPublicUrl("portfolio", serviceRates[service.key].photo_path!) || ""}
                              alt={`${service.label} sample`}
                              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => serviceImageRefs.current[service.key]?.click()}
                            disabled={uploadingServiceImage === service.key}
                            className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                          >
                            {uploadingServiceImage === service.key ? (
                              <>
                                <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                                උඩුගත වෙමින්...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                {serviceRates[service.key]?.photo_path ? "වෙනස් කරන්න" : "උඩුගත කරන්න"}
                              </>
                            )}
                          </button>
                          <input
                            ref={(el) => { serviceImageRefs.current[service.key] = el; }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleServiceImageUpload(service.key, e)}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
