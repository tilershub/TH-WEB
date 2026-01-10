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
              ටයිල් කාර්යයන් සඳහා කාර්ය පළ කිරීම සහ මිල ගණන් දීම සඳහා වේදිකාවක්.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">නිෂ්පාදනය</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-neutral-600 hover:text-black" href="/tasks">කාර්ය සොයන්න</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/post-task">කාර්යයක් පළ කරන්න</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/messages">පණිවිඩ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">සමාගම</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-neutral-600 hover:text-black" href="/about">අප ගැන</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/support">සහාය</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/contact">සම්බන්ධතා</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">නීතිමය</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-neutral-600 hover:text-black" href="/privacy">පෞද්ගලිකත්වය</Link></li>
              <li><Link className="text-neutral-600 hover:text-black" href="/terms">නියමයන්</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-neutral-600 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {year} TILERS HUB. සියලු හිමිකම් ආරක්ෂිතයි.</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1">යෙදුම තුළ චැට්</span>
            <span className="rounded-full border px-3 py-1">ඇමුණුම්</span>
            <span className="rounded-full border px-3 py-1">මිල ගණන්</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
