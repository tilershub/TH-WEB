import type { Metadata } from "next";
import { Page } from "@/components/Page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Tilers Hub - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <Page title="Privacy Policy">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-neutral-600 mb-4">Last updated: January 2026</p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-2">1. Information We Collect</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                We collect information you provide directly to us when you create an account, post tasks,
                submit bids, or communicate through our platform. This includes your name, email address,
                phone number, location information, and any content you share such as photos and messages.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">2. How We Use Your Information</h2>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm">
                <li>Provide, maintain, and improve our services</li>
                <li>Connect homeowners with tilers and facilitate communication</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">3. Information Sharing</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                We share your information with other users as necessary to provide our services. For example,
                when you post a task, your information is visible to tilers who may bid on your project.
                We do not sell your personal information to third parties.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">4. Data Security</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                We take reasonable measures to protect your information from unauthorized access, loss,
                misuse, or alteration. However, no internet transmission is ever fully secure, and we
                cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">5. Your Rights</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                You have the right to access, update, or delete your personal information at any time
                through your account settings. You may also contact us to request information about
                the data we hold about you.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">6. Cookies and Advertising</h2>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                We use cookies and similar tracking technologies to track activity on our platform
                and store certain information. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-sm mb-2">
                <li><strong>Essential Cookies:</strong> Required for the platform to function properly.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform.</li>
                <li><strong>Advertising Cookies:</strong> Used by our advertising partners to show relevant ads.</li>
              </ul>
              <p className="text-neutral-700 text-sm leading-relaxed mb-2">
                <strong>Third-Party Advertising:</strong> We use Google AdSense to display advertisements on our platform. 
                Google and other third-party vendors use cookies to serve ads based on your prior visits to our website 
                and other websites on the Internet.
              </p>
              <p className="text-neutral-700 text-sm leading-relaxed">
                You can opt out of personalized advertising by visiting{" "}
                <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Ad Settings
                </a>. You may also visit{" "}
                <a href="https://www.aboutads.info/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  aboutads.info
                </a>{" "}
                to opt out of third-party vendor cookies.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">7. Children's Privacy</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Our service is not intended for users under the age of 18. We do not knowingly
                collect personal information from children under 18.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">8. Changes to This Policy</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2">9. Contact Us</h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                If you have any questions about this privacy policy, please contact us at
                privacy@tilershub.lk
              </p>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
