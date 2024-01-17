import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { RepoReconForm } from "./components/repo-recon-form";
import RepoTable from "./repo-table";
import RepoVis from "./repo-vis";

import { fetchGeoTypes, fetchWorkers } from "@/lib/actions";

import { TableVisSwitch } from "@/components/table-vis-switch";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const geotypes = await fetchGeoTypes(supabase);
  const workers = await fetchWorkers(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user ? user.email! : "guest";

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("row_changed", { ascending: false });

  return (
    user && (
      <div>
        <RepoReconForm email={email} geotypes={geotypes} workers={workers} />

        <TableVisSwitch
          compA={<RepoTable repos={repos!} />}
          compB={<RepoVis repos={repos!} />}
        />

        <Toaster />

        {process.env.NODE_ENV === "development" && (
          <div className="bg-amber-400 mt-20 w-fit ">
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
