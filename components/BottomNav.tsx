"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/home") {
    return pathname === "/home" || pathname === "/";
  }
  return pathname === href || pathname.startsWith(href + "/");
}

function HomeIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.71 2.29a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42A1 1 0 003 13h1v7a2 2 0 002 2h12a2 2 0 002-2v-7h1a1 1 0 00.71-1.71l-9-9zM9 20v-5a1 1 0 011-1h4a1 1 0 011 1v5H9z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function MessagesIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-10.125 0C6.75 9.75 9.75 3 12 3s5.25 6.75 5.25 9c0 2.25-2.25 6-5.25 6s-5.25-3.75-5.25-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function TasksIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.59L18 11l-6 6z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}

function NavItem({ href, label, active, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center min-w-[64px] py-2 transition-all duration-200 ${
        active ? "text-primary" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <div className={`transition-transform duration-200 ${active ? "scale-110" : ""}`}>
        {children}
      </div>
      <span className={`text-[10px] mt-1 font-medium transition-all duration-200 ${
        active ? "text-primary" : "text-gray-400"
      }`}>
        {label}
      </span>
      {active && (
        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
      )}
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  const homeActive = isActive(pathname, "/home");
  const messagesActive = isActive(pathname, "/messages");
  const tasksActive = isActive(pathname, "/my-tasks");
  const profileActive = isActive(pathname, "/profile");
  const postTaskActive = isActive(pathname, "/post-task");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-lg">
          <div className="relative flex items-center justify-around h-16 px-2">
            <NavItem href="/home" label="Home" active={homeActive}>
              <HomeIcon active={homeActive} />
            </NavItem>

            <NavItem href="/messages" label="Messages" active={messagesActive}>
              <MessagesIcon active={messagesActive} />
            </NavItem>

            <div className="flex flex-col items-center justify-center min-w-[72px]">
              <Link
                href="/post-task"
                className="relative -mt-8"
              >
                <div className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  postTaskActive 
                    ? "bg-primary scale-110 shadow-primary/30" 
                    : "bg-primary hover:scale-105 hover:shadow-xl"
                }`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </Link>
              <span className={`text-[10px] mt-1 font-medium ${
                postTaskActive ? "text-primary" : "text-gray-400"
              }`}>
                Post
              </span>
            </div>

            <NavItem href="/my-tasks" label="Tasks" active={tasksActive}>
              <TasksIcon active={tasksActive} />
            </NavItem>

            <NavItem href="/profile" label="Profile" active={profileActive}>
              <ProfileIcon active={profileActive} />
            </NavItem>
          </div>
        </div>
      </div>

      <div className="h-[env(safe-area-inset-bottom)] bg-white/95 backdrop-blur-lg" />
    </nav>
  );
}
