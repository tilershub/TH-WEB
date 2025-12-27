"use client";

import { useState } from "react";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setMsg(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Signup successful. You can now login.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/profile";
      }
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page title={mode === "login" ? "Login" : "Create Account"}>
      <div className="max-w-md rounded-lg border border-neutral-200 p-4">
        <label className="text-sm">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />

        <label className="mt-3 block text-sm">Password</label>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" className="mt-1" />

        {msg && <div className="mt-3 rounded-md bg-neutral-50 p-2 text-sm text-neutral-700">{msg}</div>}

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={submit} disabled={busy || !email || !password}>
            {busy ? "Please wait…" : (mode === "login" ? "Login" : "Sign up")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            type="button"
          >
            Switch to {mode === "login" ? "Sign up" : "Login"}
          </Button>
        </div>

        <p className="mt-3 text-xs text-neutral-600">
          After login, go to <b>Profile</b> to set your role.
        </p>
      </div>
    </Page>
  );
}
