"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/lib/types";

function pub(bucket: string, path?: string | null) {
  if (!path) return null;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function NewConversationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // We continue to accept the `tiler` query param for backwards
  // compatibility, but refer to the current value as `taskerId` in
  // the code for clarity.  If you change your frontend to use
  // `tasker` instead, update this as well.
  const taskerId = searchParams.get("tiler");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [tasker, setTasker] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        router.push(`/login?redirect=/messages/new?tiler=${taskerId}`);
        return;
      }

      setCurrentUser({ id: session.session.user.id });

      if (!taskerId) {
        setError("කාර්යකරු සඳහන් කර නැත");
        setLoading(false);
        return;
      }

      const { data: taskerData, error: taskerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", taskerId)
        .maybeSingle();

      if (taskerError) {
        setError(taskerError.message);
        setLoading(false);
        return;
      }

      if (!taskerData) {
        setError("කාර්යකරු හමු නොවීය");
        setLoading(false);
        return;
      }

      setTasker(taskerData as Profile);
      setLoading(false);
    };

    load();
  }, [taskerId, router]);

  const handleSend = async () => {
    if (!message.trim()) {
      setError("කරුණාකර පණිවිඩයක් ඇතුළත් කරන්න");
      return;
    }

    if (!currentUser || !tasker) return;

    setSending(true);
    setError(null);

    try {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("homeowner_id", currentUser.id)
        // conversations table still uses tiler_id column; use tasker.id here
        .eq("tiler_id", tasker.id)
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
            // Again, conversations table still uses tiler_id column
            tiler_id: tasker.id,
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
      let errorMessage = "පණිවිඩය යැවීමට අසමත් විය";
      if (err && typeof err === "object" && "message" in err) {
        errorMessage = String((err as { message: unknown }).message);
      }
      setError(errorMessage);
      setSending(false);
    }
  };

  // Generate a public URL for the tasker's avatar.  We removed the
  // obsolete tiler-based avatar reference so there is only one
  // declaration here.
  const avatarUrl = pub("profile-avatars", tasker?.avatar_path);
  const displayName = tasker?.full_name || tasker?.display_name || "වෘත්තීය කාර්යකරු";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">ලෝඩ් වෙමින්...</div>
      </div>
    );
  }

  if (error && !tasker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/tilers" className="text-primary hover:underline">
            කාර්යකරුවන් සොයන්න
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
          <h1 className="text-xl font-bold text-gray-900">මිල ගණන් ඉල්ලන්න</h1>
        </div>

        {tasker && (
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
                  {[tasker.city, tasker.district].filter(Boolean).join(", ") || "ශ්‍රී ලංකාව"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            ඔබගේ පණිවිඩය
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="ආයුබෝවන්, මට මගේ ටයිල් ව්‍යාපෘතිය සඳහා මිල ගණන් ලබා ගැනීමට අවශ්‍යයි. ඔබගේ සේවාවන් සහ ලබාගත හැකි කාලය පිළිබඳ වැඩි විස්තර ලබාදිය හැකිද?"
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
                යැවෙමින්...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                පණිවිඩය යවන්න
              </>
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          කාර්යකරු ඔබගේ පණිවිඩය ලබාගෙන යෙදුමේ ප්‍රතිචාර ලබා දේ.
        </p>
      </div>
    </div>
  );
}

export default function NewConversationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">ලෝඩ් වෙමින්...</div>
      </div>
    }>
      <NewConversationContent />
    </Suspense>
  );
}
