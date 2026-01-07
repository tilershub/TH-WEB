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


  // Show the tasker dashboard if the user is a tasker.  We keep importing
  // the TilerHome component for backwards compatibility – it now renders
  // the tasker experience.  Note: the database now stores `tasker` instead
  // of `tiler`, so we compare against the string "tasker" here.  If you
  // see a compile error complaining about comparing Role | null to
  // 'tiler', it means some code still refers to the old value.  Update
  // those comparisons to 'tasker' as well.
  if (role === "tasker") {
    return <TilerHome />;
  }

  return <HomeownerHome />;
}