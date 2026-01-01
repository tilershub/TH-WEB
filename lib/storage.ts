import { supabase } from "./supabaseClient";

export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) {
    if (error.message.includes("Bucket not found") || error.message.includes("bucket")) {
      throw new Error(`Storage bucket "${bucket}" not found. Please create it in your Supabase dashboard under Storage.`);
    }
    throw new Error(error.message);
  }
  return path;
}

export function getPublicUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  try {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}

export function generateFilePath(userId: string, folder: string, file: File): string {
  const timestamp = Date.now();
  const ext = file.name.split(".").pop() || "jpg";
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
  return `${userId}/${folder}/${timestamp}_${sanitizedName}.${ext}`;
}
