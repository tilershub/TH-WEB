"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Role } from "@/lib/types";
import HomeownerHome from "@/components/home/HomeownerHome";
import TilerHome from "@/components/home/TilerHome";

export default function HomePage() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setRole(profile.role as Role);
        }
      }
      
      setLoading(false);
    };
    
    loadUserRole();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (role === "tiler") {
    return <TilerHome />;
  }

  return <HomeownerHome />;
}