"use client";

import { useState } from "react";
import { Page } from "@/components/Page";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <Page title="අපව සම්බන්ධ කරන්න">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">සම්බන්ධ වන්න</h2>
          <p className="text-neutral-700 mb-4">
            ප්‍රශ්න, ප්‍රතිචාර හෝ සහාය අවශ්‍යද? පහත පෝරමය පුරවා අප වෙත යවන්න, හැකි ඉක්මනින් ඔබ වෙත ප්‍රතිචාර දෙන්නම්.
          </p>

          {submitted && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-4">
              <p className="text-green-800 text-sm font-medium">
                අප වෙත සම්බන්ධ වූවාට ස්තුතියි! ඔබගේ පණිවිඩයට ඉක්මනින් ප්‍රතිචාර දෙන්නම්.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                නම
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ඔබගේ නම"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                ඊමේල්
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                විෂයය
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="මෙය කුමක් පිළිබඳද?"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                පණිවිඩය
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="තවත් විස්තර කියන්න..."
                rows={6}
                required
              />
            </div>

            <Button type="submit">
              පණිවිඩය යවන්න
            </Button>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">අප වෙත ළඟා වීමට වෙනත් ක්‍රම</h2>
          <div className="space-y-3 text-sm text-neutral-700">
            <div>
              <span className="font-semibold">ඊමේල්:</span> support@tilershub.lk
            </div>
            <div>
              <span className="font-semibold">දුරකථන:</span> +94 11 234 5678
            </div>
            <div>
              <span className="font-semibold">ලිපිනය:</span> කොළඹ, ශ්‍රී ලංකාව
            </div>
            <div>
              <span className="font-semibold">ව්‍යාපාර වේලාවන්:</span> සඳුදා - සිකුරාදා, පෙ.ව. 9:00 - ප.ව. 5:00
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
