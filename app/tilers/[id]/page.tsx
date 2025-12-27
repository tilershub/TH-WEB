"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { Profile, ServiceRates } from "@/lib/types";
import { Page } from "@/components/Page";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/Button";

function pub(bucket: string, path?: string | null) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function formatRate(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  if (!Number.isFinite(n)) return "—";
  return `Rs ${Number(n).toLocaleString("en-LK")}`;
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
      setLoading(false);
    };

    load();
  }, [id]);

  const avatarUrl = useMemo(() => pub("profile-avatars", tiler?.avatar_path), [tiler?.avatar_path]);
  const coverUrl = useMemo(() => pub("profile-covers", tiler?.cover_path), [tiler?.cover_path]);

  const serviceRates = (tiler?.service_rates ?? {}) as ServiceRates;

  const locationLine = useMemo(() => {
    const parts = [tiler?.city, tiler?.district].filter(Boolean);
    return parts.length ? parts.join(", ") : "Sri Lanka";
  }, [tiler?.city, tiler?.district]);

  const whatsappHref = useMemo(() => waLink(tiler?.whatsapp), [tiler?.whatsapp]);

  return (
    <Page title="Tiler Profile">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {msg && <div className="mb-4 rounded-xl border bg-neutral-50 p-3 text-sm">{msg}</div>}

        {loading ? (
          <div className="text-sm text-neutral-600">Loading…</div>
        ) : !tiler ? (
          <div className="text-sm text-neutral-600">Profile not found.</div>
        ) : (
          <div className="space-y-4">
            {/* Cover */}
            <div className="rounded-2xl border overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl || "/placeholder-cover.png"}
                alt="cover"
                className="h-44 w-full object-cover"
              />
            </div>

            {/* Header */}
            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-full border overflow-hidden bg-neutral-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl || "/placeholder-avatar.png"}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xl font-bold truncate">
                    {tiler.display_name || "Tiler"}
                  </div>
                  <div className="mt-1 text-sm text-neutral-600">{locationLine}</div>

                  {/* WhatsApp (public) */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {whatsappHref ? (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-500">
                        WhatsApp not added
                      </span>
                    )}

                    {/* NOTE: NIC + Address intentionally hidden publicly */}
                    <span className="text-xs rounded-full border px-3 py-2 text-neutral-600">
                      TILERS HUB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services grid */}
            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Services & Rates</div>
                <div className="text-xs text-neutral-500">Public rates</div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SERVICES.map((svc) => {
                  const item = serviceRates?.[svc.key];
                  const photoUrl = item?.photo_path ? pub("profile-portfolio", item.photo_path) : null;
                  const rateText = `${formatRate(item?.rate ?? null)} / ${item?.unit ?? svc.unit}`;

                  return (
                    <div key={svc.key} className="rounded-2xl border overflow-hidden">
                      <div className="h-28 bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl || "/placeholder-work.png"}
                          alt={svc.label}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-3">
                        <div className="font-semibold">{svc.label}</div>
                        <div className="mt-1 text-sm text-neutral-700">{rateText}</div>

                        {/* Optional CTA */}
                        {whatsappHref && (
                          <div className="mt-3">
                            <a
                              href={whatsappHref}
                              target="_blank"
                              className="inline-flex items-center rounded-xl border px-3 py-2 text-sm"
                            >
                              Request quote
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-xs text-neutral-500">
                NIC & address are shared only after a job is awarded / accepted (for safety).
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}
