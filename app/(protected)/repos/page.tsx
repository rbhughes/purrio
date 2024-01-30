import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchWorkers } from "@/lib/actions";
import { Toaster } from "@/components/ui/sonner";
import TableVisSwitch from "@/components/table-vis-switch";
import Repos from "./components/repos";
//import RepoTable from "./repo-table";
//import RepoVis from "./repo-vis";

//import { createPortal } from "react-dom";

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
    .order("row_changed", { ascending: false });

  //const tableOrViz = document.getElementById("table-or-viz");

  return (
    user && (
      <div>
        <Repos workers={workers} repos={repos!} />

        {/* <TableVisSwitch
          //compA={<RepoTable repos={repos!} />}
          compA={<h1>used to be table</h1>}
          compB={<RepoVis repos={repos!} />}
        /> */}
        {/* {tableOrViz && createPortal(<h1>MONSTER</h1>, tableOrViz)} */}

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
