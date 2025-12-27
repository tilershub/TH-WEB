import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="font-extrabold leading-none">
              <div className="text-sm tracking-tight">TILERS</div>
              <div className="text-sm tracking-tight -mt-1">HUB</div>
            </div>
            <p className="mt-3 text-sm text-neutral-600">
              Task posting & bidding platform for tiling jobs.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-neutral-600 hover:text-black" href="/tasks">Browse Tasks</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/post-task">Post a Task</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/messages">Messages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-neutral-600 hover:text-black" href="/about">About</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/support">Support</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-neutral-600 hover:text-black" href="/privacy">Privacy</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-neutral-600 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {year} TILERS HUB. All rights reserved.</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1">In-app chat</span>
            <span className="rounded-full border px-3 py-1">Attachments</span>
            <span className="rounded-full border px-3 py-1">Bidding</span>
          </div>
        </div>
      </div>
    </footer>
  );
}