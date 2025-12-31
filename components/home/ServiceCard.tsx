import Link from "next/link";

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  href: string;
};

export default function ServiceCard({ icon, title, href }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center">{title}</span>
    </Link>
  );
}
