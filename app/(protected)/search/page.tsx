import Search from "./search";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";

import { Suspense } from "react";
import { Loader } from "@/components/loader";

export default async function Page() {
  const supabase = createClient();

  const { data: searchResults } = await supabase
    .from("search_result")
    .select()
    .order("search_id", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <Suspense fallback={<Loader target="AssetJobs" />}>
        <Search
          userId={user!.id}
          //searchHistory={searchHistory![0].search_history}
          searchResults={searchResults!}
        />
      </Suspense>
      <Toaster richColors />
    </div>
  );
}
