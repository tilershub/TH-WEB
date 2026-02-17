"use client";

import { useState } from "react";
import { Page } from "@/components/Page";
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
    <Page title="Contact Us">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
            Contact Us
          </h1>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Ready to start your project? Get in touch for a free consultation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <section className="rounded-2xl border bg-white p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#1B4D3E] mb-1">
                Send Us a Message
              </h2>
              <p className="text-neutral-600 text-sm mb-6">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {status === "success" && (
                <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4">
                  <p className="text-green-800 text-sm font-medium">
                    Thank you for reaching out! We will respond to your message shortly.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-red-800 text-sm font-medium">
                    {errorMsg}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 7X XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                      Service
                    </label>
                    <select
                      id="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 bg-white outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-transparent"
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </section>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-bold text-[#1B4D3E] mb-4">
                Contact Information
              </h2>
              <div className="space-y-5 text-sm text-neutral-700">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#C8A96E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Email</p>
                    <p>info@tilershub.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#C8A96E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Phone</p>
                    <p>+94 11 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#C8A96E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Address</p>
                    <p>Colombo, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#C8A96E]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Business Hours</p>
                    <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                    <p>Sat: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Page>
  );
}
