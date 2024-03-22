import { cookies } from "next/headers";
import Search from "./search";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
//import { Database } from "@/lib/sb_types";
//type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];

import {
  enqueueSearchTask,
  updateProfileWithSearchIds,
  updateProfileSearchHistory,
} from "@/lib/actions";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: searchResults } = await supabase
    .from("search_result")
    .select()
    .order("search_id", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // const {data, error} = supabase.from('search_result')
  // .select('search_id, search_body', {distinct: true})

  // )

  await updateProfileSearchHistory(user!.id);

  return (
    user && (
      <div className="">
        <Search userId={user.id} searchResults={searchResults!} />
        <Toaster richColors />
      </div>
    )
  );
}
