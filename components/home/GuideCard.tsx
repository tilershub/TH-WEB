import Link from "next/link";

type GuideCardProps = {
  title: string;
  steps: number;
  duration: string;
  href: string;
  icon?: React.ReactNode;
};

export default function GuideCard({ title, steps, duration, href, icon }: GuideCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary flex-shrink-0">
        {icon || (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-navy truncate">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span>{steps} steps</span>
          <span>•</span>
          <span>{duration}</span>
        </div>
      </div>

      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
