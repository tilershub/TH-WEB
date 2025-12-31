"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { SERVICES } from "@/lib/services";
import type { Profile, PortfolioItem, AvailabilityStatus } from "@/lib/types";

type TilerService = {
  id: string;
  service_name: string;
  area_type: string | null;
  tile_size: string | null;
  unit: string;
  price: number;
  description: string | null;
  image_path: string | null;
  is_active: boolean;
};

type Certification = {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  certificate_number: string | null;
  image_path: string | null;
};

function pub(bucket: string, path?: string | null) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function formatPrice(n: number) {
  return `LKR ${Number(n).toLocaleString("en-LK")}`;
}

function waLink(phone?: string | null, text?: string) {
  if (!phone) return null;
  const p = phone.replace(/[^\d]/g, "");
  const msg = encodeURIComponent(text || "Hi, I found your profile on TILERS HUB. Can you help with my job?");
  return `https://wa.me/${p}?text=${msg}`;
}

function AvailabilityBadge({ status }: { status?: AvailabilityStatus }) {
  const statusConfig = {
    available: { label: "Available", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    busy: { label: "Limited Availability", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    unavailable: { label: "Not Taking Jobs", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  };
  const config = statusConfig[status || "available"];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      Verified
    </span>
  );
}

export default function PublicTilerProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [tiler, setTiler] = useState<Profile | null>(null);
  const [services, setServices] = useState<TilerService[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [activeTab, setActiveTab] = useState<"services" | "portfolio" | "about">("services");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>("all");
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const p = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (p.error) {
        setLoading(false);
        return;
      }

      const prof = (p.data ?? null) as Profile | null;
      setTiler(prof);

      if (prof) {
        const [servicesRes, certsRes, portfolioRes] = await Promise.all([
          supabase
            .from("tiler_services")
            .select("*")
            .eq("tiler_id", id)
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("certifications")
            .select("*")
            .eq("tiler_id", id)
            .order("issue_date", { ascending: false }),
          supabase
            .from("tiler_portfolio")
            .select("*")
            .eq("tiler_id", id)
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false }),
        ]);

        setServices((servicesRes.data ?? []) as TilerService[]);
        setCertifications((certsRes.data ?? []) as Certification[]);
        setPortfolio((portfolioRes.data ?? []) as PortfolioItem[]);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const avatarUrl = useMemo(() => pub("profile-avatars", tiler?.avatar_path), [tiler?.avatar_path]);
  const coverUrl = useMemo(() => pub("profile-covers", tiler?.cover_path), [tiler?.cover_path]);

  const locationLine = useMemo(() => {
    const parts = [tiler?.city, tiler?.district].filter(Boolean);
    return parts.length ? parts.join(", ") : "Sri Lanka";
  }, [tiler?.city, tiler?.district]);

  const whatsappHref = useMemo(() => waLink(tiler?.whatsapp), [tiler?.whatsapp]);

  const filteredServices = useMemo(() => {
    if (selectedServiceFilter === "all") return services;
    return services.filter((s) => s.service_name.toLowerCase().includes(selectedServiceFilter.toLowerCase()));
  }, [services, selectedServiceFilter]);

  const serviceTypes = useMemo(() => {
    const types = new Set(services.map((s) => s.service_name));
    return Array.from(types);
  }, [services]);

  const featuredPortfolio = useMemo(() => portfolio.filter((p) => p.is_featured), [portfolio]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!tiler) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile not found</h1>
          <Link href="/tasks" className="text-primary hover:underline">
            Browse available tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-5xl mx-auto">
        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/40 overflow-hidden">
          {coverUrl ? (
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 -mt-16 relative z-10">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0 shadow-lg -mt-16 sm:mt-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {tiler.display_name?.[0]?.toUpperCase() || "T"}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold text-navy">{tiler.display_name || "Tiler"}</h1>
                      {tiler.is_verified && <VerifiedBadge />}
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{locationLine}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <AvailabilityBadge status={tiler.availability_status} />
                      
                      {tiler.years_experience && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {tiler.years_experience}+ years experience
                        </span>
                      )}

                      {(tiler.completed_jobs ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {tiler.completed_jobs} jobs completed
                        </span>
                      )}

                      {certifications.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {certifications.length} certification{certifications.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Contact via WhatsApp
                    </a>
                  )}
                </div>

                {tiler.bio && (
                  <div className="mt-4 text-gray-700">
                    <p>{tiler.bio}</p>
                  </div>
                )}

                {(tiler.working_districts?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Working Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {tiler.working_districts?.slice(0, 5).map((district) => (
                        <span key={district} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {district}
                        </span>
                      ))}
                      {(tiler.working_districts?.length ?? 0) > 5 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{(tiler.working_districts?.length ?? 0) - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="flex gap-1 border-b">
            {[
              { id: "services", label: "Services & Pricing", count: services.length },
              { id: "portfolio", label: "Portfolio", count: portfolio.length },
              { id: "about", label: "About & Credentials", count: certifications.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 mt-6">
          {activeTab === "services" && (
            <div className="space-y-4">
              {services.length === 0 ? (
                <div className="card p-8 text-center text-gray-600">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p>No services listed yet.</p>
                </div>
              ) : (
                <>
                  {serviceTypes.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedServiceFilter("all")}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                          selectedServiceFilter === "all"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        All Services
                      </button>
                      {serviceTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedServiceFilter(type)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                            selectedServiceFilter === type
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service) => (
                      <div key={service.id} className="card overflow-hidden hover:shadow-card-hover transition-shadow">
                        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {service.image_path ? (
                            <img
                              src={pub("tiler-services", service.image_path) || ""}
                              alt={service.service_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-navy">{service.service_name}</h3>
                          {service.area_type && (
                            <p className="text-sm text-gray-600 mt-1">{service.area_type}</p>
                          )}
                          {service.tile_size && (
                            <p className="text-xs text-gray-500 mt-1">Tile Size: {service.tile_size}</p>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <div className="text-xl font-bold text-primary">{formatPrice(service.price)}</div>
                              <div className="text-xs text-gray-600">per {service.unit}</div>
                            </div>
                          </div>

                          {service.description && (
                            <p className="mt-3 text-sm text-gray-700 line-clamp-2">{service.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="space-y-4">
              {portfolio.length === 0 ? (
                <div className="card p-8 text-center text-gray-600">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No portfolio items yet.</p>
                </div>
              ) : (
                <>
                  {featuredPortfolio.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-navy mb-3">Featured Work</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {featuredPortfolio.map((item) => (
                          <div
                            key={item.id}
                            className="card overflow-hidden cursor-pointer hover:shadow-card-hover transition-shadow"
                            onClick={() => setSelectedPortfolioItem(item)}
                          >
                            <div className="h-56 relative">
                              <img
                                src={pub("tiler-portfolio", item.image_path) || ""}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                                Featured
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-navy">{item.title}</h4>
                              {item.service_type && (
                                <p className="text-sm text-gray-600">
                                  {SERVICES.find((s) => s.key === item.service_type)?.label || item.service_type}
                                </p>
                              )}
                              {item.location && (
                                <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-navy mb-3">
                    {featuredPortfolio.length > 0 ? "All Work" : "Portfolio Gallery"}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {portfolio
                      .filter((p) => !p.is_featured || featuredPortfolio.length === 0)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="card overflow-hidden cursor-pointer hover:shadow-card-hover transition-shadow"
                          onClick={() => setSelectedPortfolioItem(item)}
                        >
                          <div className="h-48">
                            <img
                              src={pub("tiler-portfolio", item.image_path) || ""}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-navy">{item.title}</h4>
                            {item.service_type && (
                              <p className="text-sm text-gray-600">
                                {SERVICES.find((s) => s.key === item.service_type)?.label || item.service_type}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              {tiler.bio && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-navy mb-3">About</h3>
                  <p className="text-gray-700">{tiler.bio}</p>
                </div>
              )}

              {certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-navy mb-4">Certifications & Qualifications</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="card p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-navy">{cert.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>
                            {cert.issue_date && (
                              <p className="text-xs text-gray-500 mt-1">
                                Issued: {new Date(cert.issue_date).toLocaleDateString()}
                              </p>
                            )}
                            {cert.certificate_number && (
                              <p className="text-xs text-gray-500">
                                Certificate #: {cert.certificate_number}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(tiler.working_districts?.length ?? 0) > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-navy mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {tiler.working_districts?.map((district) => (
                      <span key={district} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {district}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 mt-8 pb-6">
          <Link href="/tasks" className="btn-secondary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>
        </div>
      </div>

      {selectedPortfolioItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPortfolioItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={pub("tiler-portfolio", selectedPortfolioItem.image_path) || ""}
                alt={selectedPortfolioItem.title}
                className="w-full max-h-96 object-contain bg-gray-100"
              />
              <button
                onClick={() => setSelectedPortfolioItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-navy">{selectedPortfolioItem.title}</h3>
              {selectedPortfolioItem.service_type && (
                <p className="text-gray-600 mt-1">
                  {SERVICES.find((s) => s.key === selectedPortfolioItem.service_type)?.label || selectedPortfolioItem.service_type}
                </p>
              )}
              {selectedPortfolioItem.location && (
                <p className="text-sm text-gray-500 mt-1">{selectedPortfolioItem.location}</p>
              )}
              {selectedPortfolioItem.completed_date && (
                <p className="text-sm text-gray-500">
                  Completed: {new Date(selectedPortfolioItem.completed_date).toLocaleDateString()}
                </p>
              )}
              {selectedPortfolioItem.description && (
                <p className="text-gray-700 mt-4">{selectedPortfolioItem.description}</p>
              )}

              {selectedPortfolioItem.before_image_path && (
                <div className="mt-6">
                  <h4 className="font-semibold text-navy mb-2">Before</h4>
                  <img
                    src={pub("tiler-portfolio", selectedPortfolioItem.before_image_path) || ""}
                    alt="Before"
                    className="w-full max-h-64 object-contain bg-gray-100 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
