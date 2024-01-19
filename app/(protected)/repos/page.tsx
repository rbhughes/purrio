import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchWorkers } from "@/lib/actions";
import { Toaster } from "@/components/ui/sonner";
import TableVisSwitch from "@/components/table-vis-switch";
import RepoReconForm from "./components/repo-recon-form";
import RepoTable from "./repo-table";
import RepoVis from "./repo-vis";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const workers = await fetchWorkers(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("row_changed", { ascending: false });

  return (
    user && (
      <div>
        <RepoReconForm workers={workers} />

        <TableVisSwitch
          compA={<RepoTable repos={repos!} />}
          compB={<RepoVis repos={repos!} />}
        />

        <Toaster />

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
