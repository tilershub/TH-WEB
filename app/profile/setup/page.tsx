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
};

export default function TilerProfileSetup() {
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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceRates, setServiceRates] = useState<Record<string, ServiceRate>>({});
  const [workingDistricts, setWorkingDistricts] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

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
          setError("Profile not found. Please sign out and create a new account.");
        } else {
          setError(`Error loading profile: ${fetchError.message}`);
        }
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Profile not found. Please sign out and create a new account.");
        setLoading(false);
        return;
      }

      const p = data as Profile;
      setProfile(p);

      if (p.role !== "tiler") {
        setError("This page is for tilers only. Please switch to a tiler account first.");
        setLoading(false);
        return;
      }

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
        setSelectedServices(Object.keys(p.service_rates));
        setServiceRates(p.service_rates as Record<string, ServiceRate>);
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
      setError(err?.message || "Failed to load profile");
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
      setSuccess("Profile photo updated!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to upload photo");
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
      setSuccess("Cover photo updated!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to upload cover photo");
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
      setSuccess("Certificate added!");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to add certificate");
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
      setError(err?.message || "Failed to delete certificate");
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
          finalServiceRates[key] = { 
            rate: existing?.rate ?? null, 
            unit: svc.unit 
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

      setSuccess("Profile saved successfully!");
      setTimeout(() => {
        setSuccess(null);
        router.push("/profile");
      }, 1500);

    } catch (err: any) {
      setError(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (key: string) => {
    setSelectedServices(prev => {
      if (prev.includes(key)) {
        const newRates = { ...serviceRates };
        delete newRates[key];
        setServiceRates(newRates);
        return prev.filter(k => k !== key);
      }
      const svc = SERVICES.find(s => s.key === key);
      if (svc) {
        setServiceRates(r => ({ ...r, [key]: { rate: null, unit: svc.unit } }));
      }
      return [...prev, key];
    });
  };

  const updateServiceRate = (key: string, rate: string) => {
    const numRate = rate ? parseFloat(rate) : null;
    const svc = SERVICES.find(s => s.key === key);
    setServiceRates(prev => ({
      ...prev,
      [key]: { rate: numRate, unit: svc?.unit || "LKR/sqft" }
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
    return <LoadingPage message="Loading your profile..." />;
  }

  return (
    <Page title="Tiler Profile Setup">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Setup Your Tiler Profile</h1>
          <p className="text-gray-500 mt-1">Complete your profile to start receiving job requests</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-primary to-primary-dark">
              {coverUrl && (
                <img src={coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="absolute bottom-2 right-2 z-10 bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1 shadow-md"
              >
                {uploadingCover ? (
                  "Uploading..."
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cover Photo
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
            
            <div className="px-4 pb-4 -mt-10 relative">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-primary to-primary-dark overflow-hidden shadow-lg">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {fullName?.[0]?.toUpperCase() || "T"}
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
              <p className="text-xs text-gray-500 mt-2">Tap icons to upload photos</p>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-navy mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number *</label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                <Input
                  value={nicNo}
                  onChange={(e) => setNicNo(e.target.value)}
                  placeholder="123456789V or 200012345678"
                />
                <p className="text-xs text-gray-400 mt-1">For verification purposes (not shown publicly)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About You</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell clients about yourself and your experience..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Select</option>
                    {SRI_LANKA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your business address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <Input
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

          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-navy mb-2">Services & Rates</h2>
            <p className="text-sm text-gray-500 mb-4">Select services you offer and set your rates</p>
            
            <div className="space-y-3">
              {SERVICES.map(service => {
                const isSelected = selectedServices.includes(service.key);
                const rate = serviceRates[service.key]?.rate;
                
                return (
                  <div 
                    key={service.key}
                    className={`rounded-lg border transition-all ${
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleService(service.key)}
                      className="w-full p-3 flex items-center justify-between"
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
                      <div className="px-3 pb-3 pt-0">
                        <div className="flex items-center gap-2 ml-8">
                          <span className="text-xs text-gray-500">Rate:</span>
                          <input
                            type="number"
                            value={rate || ""}
                            onChange={(e) => updateServiceRate(service.key, e.target.value)}
                            placeholder="0"
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                          <span className="text-xs text-gray-500">{service.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-navy mb-4">Working Areas</h2>
            <p className="text-sm text-gray-500 mb-4">Select districts where you can work</p>
            
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

          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-navy mb-4">Certificates & Qualifications</h2>
            <p className="text-sm text-gray-500 mb-4">Add your professional certificates</p>
            
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
                placeholder="Certificate title (e.g., NVQ Level 3)"
              />
              <Input
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                placeholder="Issued by (optional)"
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
                {uploadingCert ? "Adding..." : "Add Certificate"}
              </Button>
            </div>
          </section>

          <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <Button
                onClick={handleSave}
                disabled={saving || !fullName.trim() || !whatsapp.trim() || !district}
                className="w-full"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
