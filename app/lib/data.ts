import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";

export const getNumberBySlug = unstable_cache(
  async (slug: string) => {
    const { data } = await supabase
      .from("numbers")
      .select("id, slug, is_constant, title, bio")
      .eq("slug", slug)
      .single();
    return data;
  },
  ["number-by-slug"],
  { revalidate: 300, tags: ["numbers"] },
);

export const getFactsByNumberId = unstable_cache(
  async (numberId: number) => {
    const { data } = await supabase
      .from("facts")
      .select("id, content, upvotes, categories (slug, name)")
      .eq("number_id", numberId)
      .eq("status", "approved")
      .order("upvotes", { ascending: false });
    return data ?? [];
  },
  ["facts-by-number"],
  { revalidate: 300, tags: ["facts"] },
);
