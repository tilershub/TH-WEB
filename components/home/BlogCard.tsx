import Link from "next/link";

type BlogCardProps = {
  title: string;
  excerpt: string;
  imageUrl?: string;
  href: string;
  category?: string;
};

export default function BlogCard({ title, excerpt, imageUrl, href, category }: BlogCardProps) {
  return (
    <Link
      href={href}
      className="flex-shrink-0 w-64 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        {category && (
          <span className="absolute top-2 left-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">
            {category}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-navy line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
