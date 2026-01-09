import "server-only";

import { createServerSupabase } from "./supabase/server";
import { Service, SubService, TaskerSubService } from "./types";

export async function fetchServices() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Service[];
}

export async function fetchSubServices(serviceId: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("sub_services")
    .select("*")
    .eq("service_id", serviceId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as SubService[];
}

export async function fetchMyTaskerOffers() {
  const supabase = createServerSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!authData.user) return [] as TaskerSubService[];

  const { data, error } = await supabase
    .from("tasker_sub_services")
    .select("*")
    .eq("tasker_id", authData.user.id);

  if (error) throw new Error(error.message);
  return data as TaskerSubService[];
}

export type PublicTaskerOfferRow = TaskerSubService & {
  sub_services: SubService & { services: Service | null };
};

export async function fetchTaskerOffersPublic(taskerId: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("tasker_sub_services")
    .select(
      `
      *,
      sub_services (
        *,
        services (*)
      )
    `
    )
    .eq("tasker_id", taskerId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as PublicTaskerOfferRow[];
}
