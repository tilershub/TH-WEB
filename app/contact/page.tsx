"use client";

import { useState } from "react";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";

const services = [
  "Bathrooms",
  "Kitchen",
  "Flooring",
  "Ceiling",
  "Glass Work",
  "Electrical",
  "Plumbing",
  "Waterproofing",
  "Other",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setService("");
      setMessage("");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-charcoal-muted mb-3">
              Get in Touch
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">
              Contact Us
            </h1>
            <p className="mt-4 text-charcoal-muted max-w-lg mx-auto leading-relaxed">
              Ready to start your project? Get in touch for a free consultation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-taupe-100/60 bg-cream p-6 md:p-8">
                <h2 className="text-sm font-semibold text-charcoal mb-1">Send Us a Message</h2>
                <p className="text-charcoal-muted text-sm mb-6">Fill out the form and we will get back to you within 24 hours.</p>

                {status === "success" && (
                  <div className="mb-6 rounded-xl bg-sage-light/20 border border-sage/30 p-4">
                    <p className="text-sage-dark text-sm font-medium">Thank you for reaching out! We will respond shortly.</p>
                  </div>
                )}

                {status === "error" && (
                  <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                    <p className="text-red-800 text-sm font-medium">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-charcoal-muted tracking-wide mb-2">Name</label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-charcoal-muted tracking-wide mb-2">Email</label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-charcoal-muted tracking-wide mb-2">Phone</label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-xs font-medium text-charcoal-muted tracking-wide mb-2">Service</label>
                      <select id="service" value={service} onChange={(e) => setService(e.target.value)} required className="w-full rounded-xl border border-taupe-200 px-4 py-3 text-sm text-charcoal bg-white outline-none transition focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:border-transparent">
                        <option value="" disabled>Select a service</option>
                        {services.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-charcoal-muted tracking-wide mb-2">Message</label>
                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your project..." rows={5} required />
                  </div>
                  <Button type="submit" disabled={status === "loading"} fullWidth>
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-taupe-100/60 bg-cream p-6">
                <h2 className="text-sm font-semibold text-charcoal mb-5">Contact Information</h2>
                <div className="space-y-5 text-sm text-charcoal-muted">
                  <div>
                    <p className="font-medium text-charcoal text-xs tracking-wide uppercase mb-1">Email</p>
                    <p>info@tilershub.com</p>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal text-xs tracking-wide uppercase mb-1">Phone</p>
                    <p>+94 11 234 5678</p>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal text-xs tracking-wide uppercase mb-1">Address</p>
                    <p>Colombo, Sri Lanka</p>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal text-xs tracking-wide uppercase mb-1">Hours</p>
                    <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                    <p>Sat: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
