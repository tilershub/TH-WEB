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
    .single();

  if (error) {
    console.error("Admin check error:", error);
    if (error.message.includes("is_admin")) {
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

export async function getAdminStats() {
  const [usersResult, tilersResult, tasksResult, blogResult, guidesResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "tiler"),
    supabase.from("tasks").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("guides").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: usersResult.count || 0,
    totalTilers: tilersResult.count || 0,
    totalTasks: tasksResult.count || 0,
    totalBlogPosts: blogResult.count || 0,
    totalGuides: guidesResult.count || 0,
  };
}

export async function getAllProfiles(page = 1, limit = 20, search = "") {
  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (search) {
    query = query.or(`display_name.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  return { data, error, count };
}

export async function updateProfileVerification(profileId: string, isVerified: boolean) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_verified: isVerified })
    .eq("id", profileId);
  return { error };
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
