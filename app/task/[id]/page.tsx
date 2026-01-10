"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Page } from "@/components/Page";
import { supabase } from "@/lib/supabaseClient";
import type { Bid, Profile, Task, TaskPhoto } from "@/lib/types";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { formatLkr } from "@/lib/utils";
import { FormField } from "@/components/FormField";

type TaskSectionRow = {
  id: string;
  task_id: string;
  section_type: string;
  title: string;
  data: any; // JSON
  sort_order: number;
};

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [sections, setSections] = useState<TaskSectionRow[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [me, setMe] = useState<{ userId: string; profile: Profile | null } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Photos uploaded via the simplified Task Hub flow. These are stored in
  // the task_photos table with a storage_path for each image. We also
  // include the task.cover_image (a direct URL) in our image list below.
  const [photos, setPhotos] = useState<TaskPhoto[]>([]);

  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isOwner = useMemo(() => !!me?.userId && task?.owner_id === me.userId, [me, task]);

  useEffect(() => {
    const load = async () => {
      setMsg(null);

      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user ?? null;

      const { data: prof } = user
        ? await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
        : { data: null };

      setMe(user ? { userId: user.id, profile: (prof as Profile | null) } : null);

      // ✅ load task
      const t = await supabase.from("tasks").select("*").eq("id", id).single();
      if (t.error) {
        setMsg(t.error.message);
        return;
      }
      setTask(t.data as Task);

      // ✅ load any photos associated with this task (simplified flow)
      const p = await supabase.from("task_photos").select("*").eq("task_id", id).order("created_at", { ascending: true });
      if (!p.error && p.data) setPhotos((p.data as TaskPhoto[]) ?? []);

      // ✅ load sections (contains data.imagePath)
      const sres = await supabase
        .from("task_sections")
        .select("*")
        .eq("task_id", id)
        .order("sort_order", { ascending: true });

      if (!sres.error) setSections((sres.data ?? []) as TaskSectionRow[]);

      // ✅ load bids
      const b = await supabase
        .from("bids")
        .select("*")
        .eq("task_id", id)
        .order("created_at", { ascending: false });

      if (!b.error) setBids((b.data ?? []) as Bid[]);
    };

    load();
  }, [id]);

  // ✅ collect image URLs from sections JSON
  const sectionImageUrls = useMemo(() => {
    const urls = sections
      .map((sec) => sec?.data?.imagePath as string | null)
      .filter(Boolean) as string[];

    // remove duplicates
    return Array.from(new Set(urls));
  }, [sections]);

  // ✅ collect image URLs from cover_image and task_photos
  const allImageUrls = useMemo(() => {
    const urls = new Set<string>();
    // include cover image from task row if present
    if (task?.cover_image) urls.add(task.cover_image);
    // include photos from task_photos table using storage bucket public URL
    photos.forEach((photo) => {
      // Determine the public URL from storage. If the path is already a full URL
      // (as might be the case if cover_image was saved), add it directly. Otherwise
      // use Supabase storage helper to get a signed public URL.
      const path = photo.storage_path;
      if (path.startsWith("http://") || path.startsWith("https://")) {
        urls.add(path);
      } else {
        const { data } = supabase.storage.from("task-photos").getPublicUrl(path);
        if (data?.publicUrl) urls.add(data.publicUrl);
      }
    });
    // include images from old sections JSON for backwards compatibility
    sectionImageUrls.forEach((u) => urls.add(u));
    return Array.from(urls);
  }, [task, photos, sectionImageUrls]);

  // Keep a stable selected image for the gallery
  useEffect(() => {
    if (!selectedImage && allImageUrls.length > 0) {
      setSelectedImage(allImageUrls[0]);
    }
    // If the previously selected image no longer exists, fall back to first
    if (selectedImage && allImageUrls.length > 0 && !allImageUrls.includes(selectedImage)) {
      setSelectedImage(allImageUrls[0]);
    }
  }, [allImageUrls, selectedImage]);

  const placeBid = async () => {
    setMsg(null);
    if (!me?.userId) {
      setMsg("බිඩ් එකක් දමන්න පිවිසෙන්න.");
      return;
    }
    if (me.profile?.role !== "tasker") {
      setMsg("බිඩ් දමන්න හැක්කේ කාර්යකරුවන්ට පමණි. පැතිකඩේ භූමිකාව වෙනස් කරන්න.");
      return;
    }
    if (!bidAmount) {
      setMsg("මුදල ඇතුළත් කරන්න.");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMsg("කරුණාකර නැවත පිවිසෙන්න.");
        return;
      }

      const response = await supabase.functions.invoke("place-bid", {
        body: {
          task_id: id,
          amount: Number(bidAmount),
          message: bidMessage || null,
        },
      });

      if (response.error) {
        setMsg(response.error.message || "බිඩ් දමීමට අසමත් විය");
        return;
      }

      const result = response.data;
      if (result?.error) {
        setMsg(result.error);
        return;
      }

      setBidAmount("");
      setBidMessage("");

      const b = await supabase.from("bids").select("*").eq("task_id", id).order("created_at", { ascending: false });
      if (!b.error) setBids((b.data ?? []) as Bid[]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "බිඩ් දමීමට අසමත් විය";
      setMsg(errorMessage);
    }
  };

  const acceptBid = async (bid: Bid) => {
    if (!task) return;
    setMsg(null);

    const u1 = await supabase.from("bids").update({ status: "accepted" }).eq("id", bid.id);
    if (u1.error) {
      setMsg(u1.error.message);
      return;
    }

    const u2 = await supabase.from("tasks").update({ status: "awarded" }).eq("id", task.id);
    if (u2.error) {
      setMsg(u2.error.message);
      return;
    }

    const existing = await supabase
      .from("conversations")
      .select("*")
      .eq("task_id", task.id)
      .eq("homeowner_id", task.owner_id)
      .eq("tiler_id", bid.tiler_id)
      .maybeSingle();

    let convId = existing.data?.id as string | undefined;

    if (!convId) {
      const created = await supabase
        .from("conversations")
        .insert({ task_id: task.id, homeowner_id: task.owner_id, tiler_id: bid.tiler_id })
        .select("*")
        .single();

      if (created.error) {
        setMsg(created.error.message);
        return;
      }
      convId = created.data.id as string;
    }

    window.location.href = `/messages/${convId}`;
  };

  return (
    <Page title="කාර්ය විස්තර">
      {msg && <div className="mb-3 rounded-xl bg-neutral-50 p-3 text-sm text-neutral-800">{msg}</div>}

      {!task ? (
        <div className="text-sm text-neutral-600">ලෝඩ් වෙමින්…</div>
      ) : (
        <div className="grid gap-6">
          <div className="card p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold text-gray-900">{task.title}</div>
                <div className="mt-1 text-sm text-gray-600">{task.location_text ?? "ශ්‍රී ලංකාව"}</div>
                <div className="mt-2 text-sm whitespace-pre-wrap">{task.description}</div>
              </div>
              <div className="text-xs text-neutral-500">තත්ත්වය: {task.status}</div>
            </div>

            {/* ✅ images from cover_image, task_photos and old sections (unique set) */}
            {allImageUrls.length > 0 && (
              <div className="mt-4">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage ?? allImageUrls[0]}
                    alt="කාර්ය ඡායාරූපය"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {allImageUrls.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setSelectedImage(u)}
                      className={
                        "shrink-0 overflow-hidden rounded-xl border transition " +
                        (u === (selectedImage ?? allImageUrls[0])
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-gray-200 hover:border-gray-300")
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="කුඩා රූපය" className="h-20 w-24 object-cover" />
                    </button>
                  ))}
                  <a
                    href={selectedImage ?? allImageUrls[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center rounded-xl border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    විවෘත
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ✅ show sections (and their images) */}
          {sections.length > 0 && (
            <div className="card p-4 md:p-6">
              <div className="font-semibold text-gray-900">සේවා කොටස්</div>
              <div className="mt-3 grid gap-3">
                {sections.map((sec) => (
                  <div key={sec.id} className="rounded-xl border border-gray-200 p-3">
                    <div className="font-medium">{sec.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">{sec.section_type}</div>

                    {sec?.data?.imagePath && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sec.data.imagePath}
                        alt="කොටස"
                        className="mt-3 h-40 w-full max-w-md rounded-xl object-cover border"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-4 md:p-6">
              <div className="font-semibold text-gray-900">බිඩ් දමන්න</div>
              <div className="mt-1 text-sm text-gray-600">කාර්යකරුවන්ට මුදලක් සහ කෙටි සටහනක් සමඟ බිඩ් දිය හැක.</div>

              <div className="mt-4 space-y-4">
                <FormField label="මුදල (LKR)" required>
                  <Input value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="උදා: 180000" inputMode="numeric" />
                </FormField>

                <FormField label="පණිවිඩය" hint="විකල්පයි">
                  <Textarea
                    rows={4}
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="කාලසටහන්, අත්දැකීම්, ඇතුළත් ද්‍රව්‍ය ආදිය."
                  />
                </FormField>

                <Button onClick={placeBid} fullWidth size="lg">
                  බිඩ් යවන්න
                </Button>
              </div>
            </div>

            <div className="card p-4 md:p-6">
              <div className="font-semibold text-gray-900">බිඩ්</div>
              <div className="mt-1 text-sm text-gray-600">චැට් ආරම්භ කිරීමට බිඩ් එකක් පිළිගන්න.</div>

              <div className="mt-4 grid gap-2">
                {bids.map((b) => (
                  <div key={b.id} className="rounded-md border border-neutral-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{formatLkr(b.amount)}</div>
                      <div className="text-xs text-neutral-500">{b.status}</div>
                    </div>
                    {b.message && <div className="mt-2 text-sm text-neutral-700">{b.message}</div>}
                    <div className="mt-2 text-xs text-neutral-500">කාර්යකරු හැඳුනුම්පත: {b.tiler_id}</div>

                    {isOwner && task.status !== "closed" && (
                      <div className="mt-3">
                        <Button onClick={() => acceptBid(b)} disabled={b.status === "accepted"} fullWidth>
                          {b.status === "accepted" ? "පිළිගැනුණු" : "බිඩ් පිළිගන්න & චැට්"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {bids.length === 0 && <div className="text-sm text-neutral-600">තවම බිඩ් නැත.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
