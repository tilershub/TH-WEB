"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ConversationRow = {
  id: string;
  task_id: string;
  homeowner_id: string;
  tiler_id: string;
  created_at: string;
  tasks?: { title: string | null }[]; // ✅ Supabase returns arrays
};

type MessageRow = {
  id: string;
  conversation_id: string;
  text: string | null;
  attachment_path: string | null;
  created_at: string;
  sender_id: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function MessagesInboxPage() {
  const [loading, setLoading] = useState(true);
  const [convs, setConvs] = useState<ConversationRow[]>([]);
  const [lastByConv, setLastByConv] = useState<Record<string, MessageRow | null>>({});
  const [meId, setMeId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setMsg(null);

    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;

    if (!user) {
      setMsg("Please login to view messages.");
      setLoading(false);
      return;
    }

    setMeId(user.id);

    // Load conversations + related task title
    const c = await supabase
      .from("conversations")
      .select("id, task_id, homeowner_id, tiler_id, created_at, tasks(title)")
      .order("created_at", { ascending: false });

    if (c.error) {
      setMsg(c.error.message);
      setLoading(false);
      return;
    }

    const convRows = (c.data ?? []) as ConversationRow[];
    setConvs(convRows);

    // Load last message per conversation
    const lastMap: Record<string, MessageRow | null> = {};

    for (const conv of convRows) {
      const m = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      lastMap[conv.id] = (m.data ?? null) as MessageRow | null;
    }

    setLastByConv(lastMap);
    setLoading(false);
  };

  useEffect(() => {
    load();

    // Realtime inbox refresh
    const ch = supabase
      .channel("inbox-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">Inbox</h1>

      {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
      {loading && <div className="mt-3 text-sm text-neutral-600">Loading…</div>}

      <div className="mt-4 grid gap-2">
        {convs.map((c) => {
          const last = lastByConv[c.id];
          const other =
            meId === c.homeowner_id ? "Tiler" : "Homeowner";

          const title = c.tasks?.[0]?.title ?? "Task"; // ✅ FIXED
          const preview =
            last?.text ??
            (last?.attachment_path ? "📎 Attachment" : "No messages yet");

          return (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="block rounded-2xl border bg-white p-4 hover:bg-neutral-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{title}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{other}</div>
                  <div className="text-sm text-neutral-700 mt-2 truncate">
                    {preview}
                  </div>
                </div>

                <div className="text-xs text-neutral-500 whitespace-nowrap">
                  {last?.created_at
                    ? timeAgo(last.created_at)
                    : timeAgo(c.created_at)}
                </div>
              </div>
            </Link>
          );
        })}

        {!loading && convs.length === 0 && (
          <div className="text-sm text-neutral-600">
            No conversations yet.
          </div>
        )}
      </div>
    </div>
  );
}