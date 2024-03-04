import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchWorkers } from "@/lib/actions";
import { Toaster } from "@/components/ui/sonner";
import Repos from "./repos";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const workers = await fetchWorkers();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("updated_at", { ascending: false });

  return (
    user && (
      <div>
        <Repos workers={workers} repos={repos!} />

        <Toaster richColors />

        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-600 mt-20 p-4 w-fit text-white">
            TODO
            <ul>
              <li>add recon-root to repo model?</li>
            </ul>
          </div>
        )}
      </div>
    )
  );
}
