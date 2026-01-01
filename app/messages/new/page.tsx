"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";

function pub(bucket: string, path?: string | null) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export default function NewConversationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tilerId = searchParams.get("tiler");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tiler, setTiler] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        router.push(`/login?redirect=/messages/new?tiler=${tilerId}`);
        return;
      }

      setCurrentUser({ id: session.session.user.id });

      if (!tilerId) {
        setError("No tiler specified");
        setLoading(false);
        return;
      }

      const { data: tilerData, error: tilerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", tilerId)
        .maybeSingle();

      if (tilerError) {
        setError(tilerError.message);
        setLoading(false);
        return;
      }

      if (!tilerData) {
        setError("Tiler not found");
        setLoading(false);
        return;
      }

      setTiler(tilerData as Profile);
      setLoading(false);
    };

    load();
  }, [tilerId, router]);

  const handleSend = async () => {
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    if (!currentUser || !tiler) return;

    setSending(true);
    setError(null);

    try {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("homeowner_id", currentUser.id)
        .eq("tiler_id", tiler.id)
        .is("task_id", null)
        .maybeSingle();

      let conversationId: string;

      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        const { data: newConv, error: convError } = await supabase
          .from("conversations")
          .insert({
            homeowner_id: currentUser.id,
            tiler_id: tiler.id,
            task_id: null,
          })
          .select("id")
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      const { error: msgError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: currentUser.id,
        text: message.trim(),
      });

      if (msgError) throw msgError;

      router.push(`/messages/${conversationId}`);
    } catch (err: unknown) {
      console.error("Message send error:", err);
      let errorMessage = "Failed to send message";
      if (err && typeof err === "object" && "message" in err) {
        errorMessage = String((err as { message: unknown }).message);
      }
      setError(errorMessage);
      setSending(false);
    }
  };

  const avatarUrl = pub("profile-avatars", tiler?.avatar_path);
  const displayName = tiler?.full_name || tiler?.display_name || "Professional Tiler";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !tiler) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/tilers" className="text-primary hover:underline">
            Browse tilers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Request Quote</h1>
        </div>

        {tiler && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark overflow-hidden flex-shrink-0 relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                    {displayName[0]?.toUpperCase() || "T"}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{displayName}</h2>
                <p className="text-sm text-gray-500">
                  {[tiler.city, tiler.district].filter(Boolean).join(", ") || "Sri Lanka"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Hi, I'm interested in getting a quote for my tiling project. Can you please provide more details about your services and availability?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="mt-4 w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          The tiler will receive your message and can respond in the app.
        </p>
      </div>
    </div>
  );
}
