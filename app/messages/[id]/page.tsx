"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Page } from "@/components/Page";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import type { Message } from "@/lib/types";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      setMsg(null);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(200);

      if (error) { setMsg(error.message); return; }
      setMessages((data ?? []) as Message[]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    load();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const attachmentUrl = (path: string) => {
    // For private bucket you would use createSignedUrl. For V1, we try public first.
    const pub = supabase.storage.from("message-attachments").getPublicUrl(path).data.publicUrl;
    return pub;
  };

  const send = async () => {
    setMsg(null);
    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user) { setMsg("Please login"); return; }

    let attachment_path: string | null = null;

    if (file) {
      const path = `${conversationId}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("message-attachments").upload(path, file, { upsert: false });
      if (up.error) { setMsg(up.error.message); return; }
      attachment_path = path;
    }

    if (!text && !attachment_path) { setMsg("Type a message or attach a file."); return; }

    const ins = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      text: text || null,
      attachment_path,
    });

    if (ins.error) { setMsg(ins.error.message); return; }

    setText("");
    setFile(null);
    // realtime insert will update list
  };

  return (
    <RequireAuth>
      <Page title="Chat">
        {msg && <div className="mb-3 rounded-md bg-neutral-50 p-2 text-sm">{msg}</div>}

        <div className="rounded-lg border border-neutral-200">
          <div className="h-[55vh] overflow-y-auto p-4">
            <div className="grid gap-3">
              {messages.map((m) => (
                <div key={m.id} className="rounded-md border border-neutral-200 p-3">
                  <div className="text-xs text-neutral-500">Sender: {m.sender_id}</div>
                  {m.text && <div className="mt-1 text-sm">{m.text}</div>}
                  {m.attachment_path && (
                    <div className="mt-2 text-sm">
                      <a className="underline" href={attachmentUrl(m.attachment_path)} target="_blank">Open attachment</a>
                    </div>
                  )}
                </div>
              ))}
              {messages.length === 0 && <div className="text-sm text-neutral-600">No messages yet.</div>}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-neutral-200 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" />
              <input
                type="file"
                className="text-sm"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <Button onClick={send}>Send</Button>
            </div>
            {file && <div className="mt-2 text-xs text-neutral-600">Attached: {file.name}</div>}
          </div>
        </div>
      </Page>
    </RequireAuth>
  );
}
