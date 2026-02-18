import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TILERSHUB Privacy Policy - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-semibold text-charcoal tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-charcoal-muted mb-10">Last updated: January 2026</p>
      <div className="space-y-8 text-charcoal-muted">
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">1. Information We Collect</h2><p className="text-sm leading-relaxed">When you contact us, request a quote, or engage our services, we may collect personal information including your name, email address, phone number, address, and project details. We also collect information you voluntarily provide through our contact forms.</p></section>
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">2. How We Use Your Information</h2><p className="text-sm leading-relaxed mb-2">We use the information we collect to:</p><ul className="list-disc list-inside space-y-1 text-sm"><li>Respond to your inquiries and provide quotes</li><li>Deliver and manage our renovation services</li><li>Communicate project updates and schedules</li><li>Send relevant information about our services (with your consent)</li><li>Improve our services and customer experience</li></ul></section>
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">3. Information Sharing</h2><p className="text-sm leading-relaxed">We do not sell your personal information to third parties. We may share your information with trusted partners (such as material suppliers or subcontractors) only as necessary to deliver our services.</p></section>
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">4. Data Security</h2><p className="text-sm leading-relaxed">We take reasonable measures to protect your personal information from unauthorized access, loss, misuse, or alteration. However, no method of transmission over the internet is 100% secure.</p></section>
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">5. Your Rights</h2><p className="text-sm leading-relaxed">You have the right to access, update, or request deletion of your personal information at any time. You may also opt out of marketing communications by contacting us.</p></section>
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">6. Cookies</h2><p className="text-sm leading-relaxed">Our website may use cookies to improve your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.</p></section>
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">7. Changes to This Policy</h2><p className="text-sm leading-relaxed">We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p></section>
        <section><h2 className="text-sm font-semibold text-charcoal mb-2">8. Contact Us</h2><p className="text-sm leading-relaxed">For questions about this privacy policy, please contact us at privacy@tilershub.com.</p></section>
      </div>
    </div>
  );
}
