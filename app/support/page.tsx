import { Page } from "@/components/Page";
import Link from "next/link";

export default function SupportPage() {
  return (
    <Page title="Support">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">How do I post a task?</h3>
              <p className="text-neutral-700 text-sm">
                Click on the "Post Task" button from the navigation menu. Fill in your project details,
                add photos if available, and set your budget range. Your task will be visible to tilers immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">How do I become a verified tiler?</h3>
              <p className="text-neutral-700 text-sm">
                Sign up for an account, select "Tiler" as your role, and complete your profile setup.
                Add your rates, portfolio photos, and contact information to start receiving project notifications.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">What are the fees?</h3>
              <p className="text-neutral-700 text-sm">
                Posting tasks and browsing tilers is completely free for homeowners. Tilers can create profiles
                and bid on projects at no cost. We believe in transparent pricing with no hidden fees.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">How do I communicate with tilers/homeowners?</h3>
              <p className="text-neutral-700 text-sm">
                Once a bid is placed, you can use our built-in messaging system to discuss project details,
                negotiate pricing, and coordinate schedules. Access your conversations from the Messages tab.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">How do payments work?</h3>
              <p className="text-neutral-700 text-sm">
                Payment terms are arranged directly between homeowners and tilers. We recommend discussing
                and agreeing on payment schedules and milestones before starting any project.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">What if I have a dispute?</h3>
              <p className="text-neutral-700 text-sm">
                We encourage clear communication and written agreements. If issues arise, please reach out
                to our support team through the <Link href="/contact" className="text-blue-600 hover:underline">contact page</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">Need More Help?</h2>
          <p className="text-neutral-700 mb-3">
            Can't find the answer you're looking for? Get in touch with our support team.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Contact Support
          </Link>
        </section>
      </div>
    </Page>
  );
}
