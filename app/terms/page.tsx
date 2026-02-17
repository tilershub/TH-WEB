import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for TILERSHUB - Read the terms and conditions that govern the use of our services.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-navy mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: January 2026</p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-navy mb-2">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed">
            By engaging TILERSHUB for any interior design or renovation services, you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">2. Services</h2>
          <p className="text-sm leading-relaxed">
            TILERSHUB provides interior design and renovation services including but not limited to bathroom renovations, kitchen design, flooring, ceiling installation, glass work, electrical work, plumbing, and waterproofing. The scope of work for each project will be defined in a written quotation or agreement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">3. Quotations &amp; Pricing</h2>
          <p className="text-sm leading-relaxed">
            All quotations are valid for 30 days from the date of issue unless otherwise stated. Prices may vary based on material costs, project scope changes, or unforeseen site conditions. Any changes to the agreed scope will be communicated and approved before additional work begins.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">4. Payment Terms</h2>
          <p className="text-sm leading-relaxed">
            Payment terms will be outlined in the project agreement. Typically, an advance payment is required before work commences, with the balance due upon completion. Specific payment schedules may be arranged for larger projects.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">5. Project Timeline</h2>
          <p className="text-sm leading-relaxed">
            We strive to complete all projects within the agreed timeline. However, delays may occur due to material availability, weather conditions, or client-requested changes. We will keep you informed of any schedule adjustments.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">6. Warranty</h2>
          <p className="text-sm leading-relaxed">
            TILERSHUB provides a workmanship warranty on all completed projects. The warranty period and coverage will be specified in your project agreement. This warranty covers defects in workmanship but does not cover normal wear and tear, misuse, or damage caused by third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">7. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed">
            TILERSHUB shall not be liable for any indirect, incidental, or consequential damages arising from our services. Our total liability shall not exceed the total amount paid for the specific project in question.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">8. Governing Law</h2>
          <p className="text-sm leading-relaxed">
            These terms shall be governed by the laws of Sri Lanka. Any disputes arising from these terms or our services shall be resolved through good-faith negotiation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-2">9. Contact</h2>
          <p className="text-sm leading-relaxed">
            For questions about these terms, please contact us at legal@tilershub.com.
          </p>
        </section>
      </div>
    </div>
  );
}
