import { supabase } from "@/integrations/supabase/client";

export type Collection = "shame" | "premium";

export type Montage = {
  id: string;
  collection: Collection;
  title: string;
  description: string;
  image_path: string;
  position: number;
  created_at: string;
};

export type MontageWithUrl = Montage & { url: string };

const SIGNED_URL_TTL = 60 * 60 * 24 * 7;

export async function fetchMontages(collection: Collection): Promise<MontageWithUrl[]> {
  const { data, error } = await supabase
    .from("montages")
    .select("*")
    .eq("collection", collection)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as Montage[];
  if (rows.length === 0) return [];

  const { data: signed, error: signErr } = await supabase.storage
    .from("montages")
    .createSignedUrls(
      rows.map((r) => r.image_path),
      SIGNED_URL_TTL,
    );
  if (signErr) throw signErr;

  return rows.map((row, i) => ({ ...row, url: signed?.[i]?.signedUrl ?? "" }));
}

export async function createMontage(input: {
  collection: Collection;
  title: string;
  description: string;
  file: File;
}) {
  const ext = input.file.name.split(".").pop() ?? "jpg";
  const path = `${input.collection}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("montages")
    .upload(path, input.file, { contentType: input.file.type, upsert: false });
  if (upErr) throw upErr;

  const { error } = await supabase.from("montages").insert({
    collection: input.collection,
    title: input.title,
    description: input.description,
    image_path: path,
    position: Math.floor(Date.now() / 1000),
  });
  if (error) throw error;
}

export async function updateMontage(
  id: string,
  patch: { title?: string; description?: string; position?: number },
) {
  const { error } = await supabase.from("montages").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteMontage(montage: Montage) {
  const { error } = await supabase.from("montages").delete().eq("id", montage.id);
  if (error) throw error;
  await supabase.storage.from("montages").remove([montage.image_path]);
}
