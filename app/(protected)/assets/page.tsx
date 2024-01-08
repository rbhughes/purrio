import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { AssetJobForm } from "./components/asset-job-form";
//import AssetJobs from "./components/asset-jobs";

import AssetJobTable from "./asset-job-table";
import AssetJobVis from "./asset-job-vis";

import { TableVisSwitch } from "@/components/table-vis-switch";
export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //const email = user ? user.email! : "guest";

  const { data: assetJobs } = await supabase
    .from("asset_job")
    .select()
    .order("row_created", { ascending: false });

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("row_changed", { ascending: false });

  //return <AssetJobTable assetJobs={assetJobs!} />;
  return (
    user && (
      <>
        <AssetJobForm repos={repos!} />
        {/* <AssetJobTable assetJobs={assetJobs!} /> */}

        <TableVisSwitch
          compA={<AssetJobTable assetJobs={assetJobs!} />}
          compB={<AssetJobVis assetJobs={assetJobs!} />}
        />

        {process.env.NODE_ENV === "development" && (
          <div className="bg-amber-400 mt-20 w-fit ">
            TODO
            <ul>
              <li>move view/toggle column list</li>
              <li>clean up asset-job form</li>
              <li>show current asset holdings (above form?)</li>
              <li>row action: enqueue</li>
              <li>row action: delete</li>
              <li>table action: delete selected</li>
              <li>table action: enqueue selected</li>
              <li>icon for geographix</li>
              <li>icon for petra</li>
              <li>icon for kingdom</li>
              <li>icon for las</li>
            </ul>
          </div>
        )}
      </>
    )
  );
}
