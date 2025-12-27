import { Page } from "@/components/Page";

export default function AboutPage() {
  return (
    <Page title="About Tilers Hub">
      <div className="max-w-3xl mx-auto space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">Our Mission</h2>
          <p className="text-neutral-700 leading-relaxed">
            Tilers Hub connects homeowners with skilled tiling professionals across Sri Lanka.
            We make it easy to find qualified tilers, compare quotes, and get your tiling projects completed with confidence.
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">How It Works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">For Homeowners</h3>
              <p className="text-neutral-700 text-sm">
                Post your tiling project with photos and details. Receive bids from qualified tilers in your area.
                Review their profiles, rates, and portfolio before choosing the right professional for your job.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">For Tilers</h3>
              <p className="text-neutral-700 text-sm">
                Create a profile showcasing your skills, rates, and previous work. Browse available projects
                in your area and submit competitive bids. Connect directly with homeowners and grow your business.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-bold mb-3">Why Choose Tilers Hub</h2>
          <ul className="space-y-2 text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">Verified tiling professionals with portfolios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">Transparent pricing and competitive bidding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">Direct communication between homeowners and tilers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm">Easy project management and tracking</span>
            </li>
          </ul>
        </section>
      </div>
    </Page>
  );
}
