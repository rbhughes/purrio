import { cookies } from "next/headers";
import Search from "./search";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";

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

  return (
    user && (
      <div className="">
        <Search
          userId={user.id}
          //searchHistory={searchHistory![0].search_history}
          searchResults={searchResults!}
        />
        <Toaster richColors />
      </div>
    )
  );
}
