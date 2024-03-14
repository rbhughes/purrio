import { cookies } from "next/headers";
import Search from "./search";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
//import { Database } from "@/lib/sb_types";
//type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: searchResults } = await supabase
    .from("search_result")
    .select()
    .order("task_id", { ascending: false });

  return (
    <div>
      <Search placeholder="search..." searchResults={searchResults!} />
      <Toaster richColors />
    </div>
  );
}
