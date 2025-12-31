"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";

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

export default function PublicTilerProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [tiler, setTiler] = useState<Profile | null>(null);
  const [services, setServices] = useState<TilerService[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMsg(null);

      const p = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (p.error) {
        setMsg(p.error.message);
        setLoading(false);
        return;
      }

      const prof = (p.data ?? null) as Profile | null;
      setTiler(prof);

      if (prof) {
        const { data: servicesData } = await supabase
          .from("tiler_services")
          .select("*")
          .eq("tiler_id", id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        setServices((servicesData ?? []) as TilerService[]);

        const { data: certsData } = await supabase
          .from("certifications")
          .select("*")
          .eq("tiler_id", id)
          .order("issue_date", { ascending: false });

        setCertifications(certsData ?? []);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : !tiler ? (
          <div className="p-6 text-gray-600">Profile not found.</div>
        ) : (
          <div>
            <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="px-4 -mt-16 relative z-10">
              <div className="card p-6">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0 shadow-lg">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {tiler.display_name?.[0]?.toUpperCase() || "T"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-16">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <h1 className="text-3xl font-bold text-navy">{tiler.display_name || "Tiler"}</h1>
                        <div className="flex items-center gap-2 mt-2 text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>{locationLine}</span>
                        </div>
                      </div>

                      {whatsappHref && (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary flex items-center gap-2"
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
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 mt-6">
              <h2 className="text-2xl font-bold text-navy mb-4">Services & Pricing</h2>

              {services.length === 0 ? (
                <div className="card p-8 text-center text-gray-600">
                  No services added yet.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div key={service.id} className="card overflow-hidden hover:shadow-card-hover transition-shadow">
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {service.image_path ? (
                          <img
                            src={pub("tiler-services", service.image_path) || ""}
                            alt={service.service_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-navy text-lg">{service.service_name}</h3>
                        {service.area_type && (
                          <p className="text-sm text-gray-600 mt-1">{service.area_type}</p>
                        )}
                        {service.tile_size && (
                          <p className="text-xs text-gray-500 mt-1">Tile Size: {service.tile_size}</p>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-primary">{formatPrice(service.price)}</div>
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
              )}
            </div>

            {certifications.length > 0 && (
              <div className="px-4 mt-8 pb-6">
                <h2 className="text-2xl font-bold text-navy mb-4">Certifications & Qualifications</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="card p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy">{cert.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{cert.issuer}</p>
                          {cert.issue_date && (
                            <p className="text-xs text-gray-500 mt-1">
                              Issued: {new Date(cert.issue_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-4 mt-6 pb-6">
              <Link href="/tasks" className="btn-secondary">
                Back to Jobs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
