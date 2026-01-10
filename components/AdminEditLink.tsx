"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

type AdminEditLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function AdminEditLink({ href, children, className = "" }: AdminEditLinkProps) {
  const { profile, loading } = useAuth();

  if (loading || !profile?.is_admin) {
    return null;
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark ${className}`}
    >
      {children}
    </Link>
  );
}
