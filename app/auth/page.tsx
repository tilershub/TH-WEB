"use client";

import { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { supabase } from "@/lib/supabaseClient";

type Role = "homeowner" | "tiler";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"credentials" | "role">("credentials");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleCredentialsSubmit = () => {
    if (!email || !password) return;
    if (mode === "signup") {
      setStep("role");
    } else {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = "/profile";
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async () => {
    if (!role) return;
    setBusy(true);
    setMsg(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, full_name: email.split("@")[0] },
        },
      });
      if (error) throw error;

      setMsg("Signup successful! You can now login.");
      setMode("login");
      setStep("credentials");
      setRole(null);
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const resetToLogin = () => {
    setMode("login");
    setStep("credentials");
    setRole(null);
    setMsg(null);
  };

  const resetToSignup = () => {
    setMode("signup");
    setStep("credentials");
    setRole(null);
    setMsg(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-navy overflow-hidden">
                <div className="h-1/2 bg-secondary"></div>
                <div className="h-1/2 bg-primary"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white font-bold text-center leading-tight">
                  <div className="text-xs">TILERS</div>
                  <div className="text-xs">HUB</div>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-navy mb-2">
              {mode === "login"
                ? "Login to TILERS HUB"
                : step === "role"
                ? "Choose Your Role"
                : "Sign Up to TILERS HUB"}
            </h1>
            <p className="text-gray-600 text-center text-sm">
              {step === "role"
                ? "Are you looking to hire a tiler or offer tiling services?"
                : "Join Tilers Hub to post or find tiling jobs nearby"}
            </p>
          </div>

          {step === "role" ? (
            <div className="space-y-4">
              <button
                onClick={() => setRole("homeowner")}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                  role === "homeowner"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      role === "homeowner"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">I need a Tiler</h3>
                    <p className="text-sm text-gray-500">Post jobs and find professional tilers</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setRole("tiler")}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                  role === "tiler"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      role === "tiler" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">I am a Tiler</h3>
                    <p className="text-sm text-gray-500">Find jobs and grow your business</p>
                  </div>
                </div>
              </button>

              {msg && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                  {msg}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={() => setStep("credentials")} variant="secondary" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSignup} disabled={busy || !role} className="flex-1">
                  {busy ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                />
              </div>

              {msg && (
                <div
                  className={`rounded-xl p-3 text-sm ${
                    msg.includes("successful")
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-blue-50 border border-blue-200 text-blue-800"
                  }`}
                >
                  {msg}
                </div>
              )}

              <Button
                onClick={handleCredentialsSubmit}
                disabled={busy || !email || !password}
                className="w-full"
              >
                {busy ? "Please wait..." : mode === "login" ? "Login" : "Continue"}
              </Button>

              <p className="text-center text-sm text-gray-600">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button onClick={resetToSignup} className="text-primary font-medium hover:underline">
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button onClick={resetToLogin} className="text-primary font-medium hover:underline">
                      Login
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}