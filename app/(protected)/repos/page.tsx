import { createClient } from "@/utils/supabase/server";
import { fetchWorkers } from "@/lib/actions";
import { Toaster } from "@/components/ui/sonner";
import Repos from "./repos";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = createClient();

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
              <li>
                broken suite filter:
                https://github.com/shadcn-ui/ui/discussions/2976
              </li>
              <li>
                cmdk css bugs (select, dropdown-menu, command)
                https://github.com/shadcn-ui/ui/pull/3037
                https://github.com/shadcn-ui/ui/issues/3024
                https://github.com/shadcn-ui/ui/pull/2945
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  );
}
