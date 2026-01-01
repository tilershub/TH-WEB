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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: data.user.email,
            role,
            full_name: email.split("@")[0],
          }, { onConflict: "id" });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    role === "homeowner" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    role === "tiler" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                <Button
                  onClick={() => setStep("credentials")}
                  variant="secondary"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSignup}
                  disabled={busy || !role}
                  className="flex-1"
                >
                  {busy ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                </button>

                <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Continue with Apple</span>
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

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
                  <div className={`rounded-xl p-3 text-sm ${
                    msg.includes("successful") 
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-blue-50 border border-blue-200 text-blue-800"
                  }`}>
                    {msg}
                  </div>
                )}

                <Button
                  onClick={handleCredentialsSubmit}
                  disabled={busy || !email || !password}
                  className="w-full"
                >
                  {busy ? "Please wait..." : (mode === "login" ? "Login" : "Continue")}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={resetToSignup}
                        className="text-primary font-medium hover:underline"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={resetToLogin}
                        className="text-primary font-medium hover:underline"
                      >
                        Login
                      </button>
                    </>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
