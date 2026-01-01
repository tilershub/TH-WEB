"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ProfileInfo = {
  id: string;
  display_name: string | null;
  full_name: string | null;
  avatar_path: string | null;
};

type ConversationRow = {
  id: string;
  task_id: string | null;
  homeowner_id: string;
  tiler_id: string;
  created_at: string;
  tasks?: { title: string | null }[];
};

type MessageRow = {
  id: string;
  conversation_id: string;
  text: string | null;
  attachment_path: string | null;
  created_at: string;
  sender_id: string;
};

function pub(path?: string | null) {
  if (!path) return null;
  return supabase.storage.from("profile-avatars").getPublicUrl(path).data.publicUrl;
}

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
  const [profiles, setProfiles] = useState<Record<string, ProfileInfo>>({});
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

    const userIds = new Set<string>();
    convRows.forEach((conv) => {
      userIds.add(conv.homeowner_id);
      userIds.add(conv.tiler_id);
    });

    if (userIds.size > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, display_name, full_name, avatar_path")
        .in("id", Array.from(userIds));

      const profileMap: Record<string, ProfileInfo> = {};
      (profilesData ?? []).forEach((p: ProfileInfo) => {
        profileMap[p.id] = p;
      });
      setProfiles(profileMap);
    }

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
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/tasks" className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Messages</h1>
        </div>

        {msg && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">{msg}</div>}
        {loading && <div className="text-sm text-gray-600">Loading...</div>}

        <div className="space-y-3">
          {convs.map((c) => {
            const last = lastByConv[c.id];
            const otherId = meId === c.homeowner_id ? c.tiler_id : c.homeowner_id;
            const otherProfile = profiles[otherId];
            const otherName = otherProfile?.full_name || otherProfile?.display_name || (meId === c.homeowner_id ? "Tiler" : "Homeowner");
            const avatarUrl = pub(otherProfile?.avatar_path);
            const title = c.task_id ? (c.tasks?.[0]?.title ?? "Task") : "Direct Message";
            const preview = last?.text ?? (last?.attachment_path ? "Attachment" : "No messages yet");

            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden relative">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={otherName} fill className="object-cover" sizes="48px" />
                    ) : (
                      otherName[0]?.toUpperCase() || "?"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-navy truncate">{otherName}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {last?.created_at ? timeAgo(last.created_at) : timeAgo(c.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{title}</p>
                    <p className="text-sm text-gray-700 truncate">{preview}</p>
                  </div>

                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}

          {!loading && convs.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-gray-600">No conversations yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}