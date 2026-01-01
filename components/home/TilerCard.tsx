import Link from "next/link";
import Image from "next/image";
import type { Profile } from "@/lib/types";

type TilerCardProps = {
  tiler: Profile;
};

function StarIcon() {
  return (
    <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function TilerCard({ tiler }: TilerCardProps) {
  const avatarUrl = tiler.avatar_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-avatars/${tiler.avatar_path}`
    : null;
  const displayName = tiler.full_name || tiler.display_name || "Professional Tiler";

  return (
    <Link
      href={`/tilers/${tiler.id}`}
      className="flex-shrink-0 w-40 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {avatarUrl ? (
          <Image 
            src={avatarUrl} 
            alt={displayName} 
            fill
            sizes="160px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        {tiler.is_verified && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-navy truncate">
          {displayName}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <StarIcon />
          <span className="text-xs text-gray-600">4.8</span>
        </div>

        {tiler.district && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{tiler.district}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
