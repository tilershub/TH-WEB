import "server-only";

import { createServerSupabase } from "./supabase/server";

const BUCKET_NAME = "tasker-service-images";
const DEFAULT_EXPIRES_IN = 60 * 60; // 1 hour

export async function createSignedUrl(path: string | null, expiresIn = DEFAULT_EXPIRES_IN) {
  if (!path) return null;
  const supabase = createServerSupabase();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function createSignedUrlsBatch(paths: string[], expiresIn = DEFAULT_EXPIRES_IN) {
  if (paths.length === 0) return new Map<string, string>();
  const supabase = createServerSupabase();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrls(paths, expiresIn);

  if (error) throw new Error(error.message);

  const urlMap = new Map<string, string>();
  data?.forEach((item) => {
    if (item.signedUrl && typeof item.path === "string") {
      urlMap.set(item.path, item.signedUrl);
    }
  });
  return urlMap;
}

export { BUCKET_NAME };
