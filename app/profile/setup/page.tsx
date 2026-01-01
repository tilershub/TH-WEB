"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { LoadingPage } from "@/components/LoadingPage";
import { SERVICES } from "@/lib/services";

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

export default function TilerProfileSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [workingDistricts, setWorkingDistricts] = useState<string[]>([]);

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
        console.error("Profile fetch error:", fetchError);
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

      // Check if user is a tiler
      if (p.role !== "tiler") {
        setError("This page is for tilers only. Please switch to a tiler account first.");
        setLoading(false);
        return;
      }

      // Populate form fields
      setFullName(p.full_name || "");
      setBio(p.bio || "");
      setWhatsapp(p.whatsapp || "");
      setDistrict(p.district || "");
      setCity(p.city || "");
      setAddress(p.address || "");
      setYearsExperience(p.years_experience?.toString() || "");
      setWorkingDistricts(p.working_districts || []);
      
      // Extract selected services from service_rates
      if (p.service_rates && typeof p.service_rates === "object") {
        setSelectedServices(Object.keys(p.service_rates));
      }

    } catch (err: any) {
      console.error("Load error:", err);
      setError(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Build service_rates object
      const serviceRates: Record<string, any> = {};
      selectedServices.forEach(key => {
        const svc = SERVICES.find(s => s.key === key);
        if (svc) {
          serviceRates[key] = { rate: null, unit: svc.unit };
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
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          working_districts: workingDistricts.length > 0 ? workingDistricts : null,
          service_rates: Object.keys(serviceRates).length > 0 ? serviceRates : null,
        })
        .eq("id", profile.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess("Profile saved successfully!");
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      console.error("Save error:", err);
      setError(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (key: string) => {
    setSelectedServices(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
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
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Setup Your Tiler Profile</h1>
          <p className="text-gray-500 mt-1">Complete your profile to start receiving job requests</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select district</option>
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

          {/* Services */}
          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-navy mb-4">Services You Offer</h2>
            <p className="text-sm text-gray-500 mb-4">Select the services you provide</p>
            
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map(service => (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => toggleService(service.key)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedServices.includes(service.key)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedServices.includes(service.key)
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}>
                      {selectedServices.includes(service.key) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium">{service.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Working Districts */}
          <section className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-navy mb-4">Working Areas</h2>
            <p className="text-sm text-gray-500 mb-4">Select districts where you can work</p>
            
            <div className="flex flex-wrap gap-2">
              {SRI_LANKA_DISTRICTS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleWorkingDistrict(d)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
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

          {/* Save Button */}
          <div className="sticky bottom-20 bg-white py-4 border-t border-gray-100">
            <Button
              onClick={handleSave}
              disabled={saving || !fullName.trim() || !whatsapp.trim() || !district}
              className="w-full"
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              * Required fields
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}
