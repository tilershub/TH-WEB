import type { Metadata } from "next";
import { Page } from "@/components/Page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Tilers Hub - Read the terms and conditions for using our platform.",
};

export default function TermsPage() {
  return (
    <Page title="Terms of Service">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-neutral-600 mb-4">Last updated: January 2026</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-2">1. Acceptance of Terms</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                By accessing and using Tilers Hub, you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, you should not use our platform.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">2. User Accounts</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for
                all activities that occur under your account. You must notify us immediately of any unauthorized
                use of your account.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">3. User Responsibilities</h2>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                As a user of Tilers Hub, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm">
                <li>Provide accurate and truthful information</li>
                <li>Not misrepresent your identity, qualifications, or work history</li>
                <li>Conduct all transactions professionally and legally</li>
                <li>Not post spam, offensive, or inappropriate content</li>
                <li>Respect the intellectual property rights of others</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">4. Service Provision</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Tilers Hub is a platform that connects homeowners with tilers. We do not provide tiling
                services directly, nor do we employ or supervise the tilers on our platform. All contractual
                relationships are between homeowners and tilers directly.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">5. Payments and Fees</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Payment arrangements are made directly between homeowners and tilers. Tilers Hub is not
                responsible for payment disputes or non-payment issues. Any fees for using our platform
                will be clearly communicated to users.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">6. Limitation of Liability</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Tilers Hub is not liable for any damages arising from the use of our platform, including
                but not limited to property damage, personal injury, financial loss, or disputes between
                users. You use our service at your own risk.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">7. Content Ownership</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                You retain ownership of all content you post on Tilers Hub. By posting content, you grant
                us a non-exclusive license to use, display, and distribute that content on our platform.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">8. Termination</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of
                these terms, fraudulent activity, or any other reason we deem necessary to protect our
                platform and users.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">9. Dispute Resolution</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Any disputes arising from the use of our platform should be resolved through good faith
                negotiation. If negotiation fails, disputes will be subject to the laws of Sri Lanka.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">10. Changes to Terms</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                We may modify these terms at any time. Continued use of the platform after changes
                constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">11. Contact Information</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                For questions about these terms, please contact us at legal@tilershub.lk
              </p>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
