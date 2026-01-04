"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Page } from "@/components/Page";
import { supabase } from "@/lib/supabaseClient";
import type { Bid, Profile, Task } from "@/lib/types";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { formatLkr } from "@/lib/utils";

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

  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");

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

  const placeBid = async () => {
    setMsg(null);
    if (!me?.userId) {
      setMsg("Login to place a bid.");
      return;
    }
    if (me.profile?.role !== "tiler") {
      setMsg("Only Tilers can place bids. Change role in Profile.");
      return;
    }
    if (!bidAmount) {
      setMsg("Enter amount.");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMsg("Please login again.");
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
        setMsg(response.error.message || "Failed to place bid");
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
      const errorMessage = error instanceof Error ? error.message : "Failed to place bid";
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
    <Page title="Task Details">
      {msg && <div className="mb-3 rounded-md bg-neutral-50 p-2 text-sm">{msg}</div>}

      {!task ? (
        <div className="text-sm text-neutral-600">Loading…</div>
      ) : (
        <div className="grid gap-6">
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{task.title}</div>
                <div className="text-sm text-neutral-600">{task.location_text ?? "Sri Lanka"}</div>
                <div className="mt-2 text-sm whitespace-pre-wrap">{task.description}</div>
              </div>
              <div className="text-xs text-neutral-500">Status: {task.status}</div>
            </div>

            {/* ✅ images from task_sections.data.imagePath */}
            {sectionImageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {sectionImageUrls.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="task" className="h-28 w-full rounded-md object-cover border" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ✅ show sections (and their images) */}
          {sections.length > 0 && (
            <div className="rounded-lg border border-neutral-200 p-4">
              <div className="font-medium">Service Sections</div>
              <div className="mt-3 grid gap-3">
                {sections.map((sec) => (
                  <div key={sec.id} className="rounded-md border border-neutral-200 p-3">
                    <div className="font-medium">{sec.title}</div>
                    <div className="mt-1 text-xs text-neutral-500">{sec.section_type}</div>

                    {sec?.data?.imagePath && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={sec.data.imagePath}
                        alt="section"
                        className="mt-3 h-40 w-full max-w-md rounded-md object-cover border"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 p-4">
              <div className="font-medium">Place a Bid</div>
              <div className="mt-2 text-sm text-neutral-600">Tilers can bid with amount and a short message.</div>

              <label className="mt-4 block text-sm font-medium">Amount (LKR)</label>
              <Input className="mt-1" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="e.g., 180000" />

              <label className="mt-4 block text-sm font-medium">Message (optional)</label>
              <Textarea
                className="mt-1"
                rows={4}
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                placeholder="Explain timeline, experience, tile leveling system, etc."
              />

              <div className="mt-4">
                <Button onClick={placeBid}>Submit Bid</Button>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 p-4">
              <div className="font-medium">Bids</div>
              <div className="mt-2 text-sm text-neutral-600">
                Homeowner can accept a bid to start chat. (Visibility depends on RLS.)
              </div>

              <div className="mt-4 grid gap-2">
                {bids.map((b) => (
                  <div key={b.id} className="rounded-md border border-neutral-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{formatLkr(b.amount)}</div>
                      <div className="text-xs text-neutral-500">{b.status}</div>
                    </div>
                    {b.message && <div className="mt-2 text-sm text-neutral-700">{b.message}</div>}
                    <div className="mt-2 text-xs text-neutral-500">Tiler ID: {b.tiler_id}</div>

                    {isOwner && task.status !== "closed" && (
                      <div className="mt-3">
                        <Button onClick={() => acceptBid(b)} disabled={b.status === "accepted"}>
                          {b.status === "accepted" ? "Accepted" : "Accept bid & Chat"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {bids.length === 0 && <div className="text-sm text-neutral-600">No bids yet.</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}