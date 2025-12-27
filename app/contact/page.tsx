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
    <Page title="Contact Us">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">Get in Touch</h2>
          <p className="text-neutral-700 mb-4">
            Have questions, feedback, or need assistance? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          {submitted && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-4">
              <p className="text-green-800 text-sm font-medium">
                Thank you for contacting us! We'll respond to your message shortly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
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
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What is this about?"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more..."
                rows={6}
                required
              />
            </div>

            <Button type="submit">
              Send Message
            </Button>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">Other Ways to Reach Us</h2>
          <div className="space-y-3 text-sm text-neutral-700">
            <div>
              <span className="font-semibold">Email:</span> support@tilershub.lk
            </div>
            <div>
              <span className="font-semibold">Phone:</span> +94 11 234 5678
            </div>
            <div>
              <span className="font-semibold">Address:</span> Colombo, Sri Lanka
            </div>
            <div>
              <span className="font-semibold">Business Hours:</span> Monday - Friday, 9:00 AM - 5:00 PM
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
