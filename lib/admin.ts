import { supabase } from "./supabaseClient";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  read_time: string;
  cover_image: string | null;
  is_published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type GuideStep = {
  title: string;
  content: string[];
};

export type Guide = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string;
  steps: GuideStep[];
  is_published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export async function checkIsAdmin(userId: string): Promise<{ isAdmin: boolean; error?: string }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Admin check error:", error);
    if (error.message.includes("is_admin") || error.code === "42703") {
      return { isAdmin: false, error: "migration_needed" };
    }
    return { isAdmin: false, error: error.message };
  }
  
  if (!data) {
    return { isAdmin: false, error: "profile_not_found" };
  }
  
  if (data.is_admin !== true) {
    return { isAdmin: false, error: "not_admin" };
  }
  
  return { isAdmin: true };
}

/**
 * Fetch aggregated statistics for the admin dashboard.  Counts taskers using the
 * updated role value "tasker".  If you still have existing rows with
 * role = 'tiler' in your profiles table, run a migration to update them.
 */
export async function getAdminStats() {
  const [usersResult, taskersResult, tasksResult, blogResult, guidesResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "tasker"),
    supabase.from("tasks").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("guides").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: usersResult.count || 0,
    totalTaskers: taskersResult.count || 0,
    totalTasks: tasksResult.count || 0,
    totalBlogPosts: blogResult.count || 0,
    totalGuides: guidesResult.count || 0,
  };
}

type ProfileFilters = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isVerified?: boolean;
};

export async function getAllProfiles({
  page = 1,
  limit = 20,
  search = "",
  role,
  isVerified,
}: ProfileFilters = {}) {
  const buildQuery = (includeVerificationFilter: boolean) => {
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role) {
      query = query.eq("role", role);
    }

    if (includeVerificationFilter && typeof isVerified === "boolean") {
      query = query.eq("is_verified", isVerified);
    }

    return query;
  };

  const { data, error, count } = await buildQuery(true);
  if (error && (error.message.includes("is_verified") || error.code === "42703")) {
    const fallbackResult = await buildQuery(false);
    return {
      data: fallbackResult.data,
      error: fallbackResult.error,
      count: fallbackResult.count,
      verificationSupported: false,
    };
  }
  return { data, error, count, verificationSupported: true };
}

export async function updateProfileVerification(profileId: string, isVerified: boolean) {
  const { headers, error } = await buildAdminHeaders();
  if (error) {
    return { error };
  }

  const response = await fetch("/api/admin/users/verify", {
    method: "POST",
    headers,
    body: JSON.stringify({ userId: profileId, verified: isVerified }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return { error: body?.error || "Failed to update verification status" };
  }

  return { error: null };
}

export async function deleteProfile(profileId: string) {
  const { headers, error } = await buildAdminHeaders();
  if (error) {
    return { error };
  }

  const response = await fetch("/api/admin/users/delete", {
    method: "POST",
    headers,
    body: JSON.stringify({ userId: profileId }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return { error: body?.error || "Failed to delete user" };
  }

  return { error: null };
}

type TaskerProfilePayload = {
  fullName: string;
  email: string;
  password: string;
  displayName?: string;
  city?: string;
  district?: string;
  isVerified?: boolean;
};

export async function createTaskerProfile(payload: TaskerProfilePayload) {
  const { headers, error } = await buildAdminHeaders();
  if (error) {
    return { error };
  }

  const response = await fetch("/api/admin/users/create", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return { error: body?.error || "Failed to create tasker" };
  }

  return { error: null };
}

async function buildAdminHeaders() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return { error: error.message, headers: {} as Record<string, string> };
  }

  const token = data.session?.access_token;
  if (!token) {
    return { error: "Missing auth token", headers: {} as Record<string, string> };
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    error: null,
  };
}

export async function getAllBlogPosts(page = 1, limit = 20, includeUnpublished = true) {
  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error, count } = await query;
  return { data: data as BlogPost[] | null, error, count };
}

export async function getBlogPost(id: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  return { data: data as BlogPost | null, error };
}

export async function createBlogPost(post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();
  return { data: data as BlogPost | null, error };
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update(post)
    .eq("id", id)
    .select()
    .single();
  return { data: data as BlogPost | null, error };
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);
  return { error };
}

export async function getAllGuides(page = 1, limit = 20, includeUnpublished = true) {
  let query = supabase
    .from("guides")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error, count } = await query;
  return { data: data as Guide[] | null, error, count };
}

export async function getGuide(id: string) {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("id", id)
    .single();
  return { data: data as Guide | null, error };
}

export async function createGuide(guide: Partial<Guide>) {
  const { data, error } = await supabase
    .from("guides")
    .insert(guide)
    .select()
    .single();
  return { data: data as Guide | null, error };
}

export async function updateGuide(id: string, guide: Partial<Guide>) {
  const { data, error } = await supabase
    .from("guides")
    .update(guide)
    .eq("id", id)
    .select()
    .single();
  return { data: data as Guide | null, error };
}

export async function deleteGuide(id: string) {
  const { error } = await supabase
    .from("guides")
    .delete()
    .eq("id", id);
  return { error };
}

export async function getAllTasks(page = 1, limit = 20, status?: string) {
  let query = supabase
    .from("tasks")
    .select("*, profiles!owner_id(display_name, full_name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;
  return { data, error, count };
}

export async function updateTaskStatus(taskId: string, status: string) {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);
  return { error };
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);
  return { error };
}
