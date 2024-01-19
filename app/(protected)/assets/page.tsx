import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import TableVisSwitch from "@/components/table-vis-switch";
import AssetJobForm from "./components/asset-job-form";
import AssetJobTable from "./asset-job-table";
import AssetJobVis from "./asset-job-vis";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: assetJobs } = await supabase
    .from("asset_job")
    .select()
    .order("row_created", { ascending: false });

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("row_changed", { ascending: false });

  return (
    user && (
      <div>
        <AssetJobForm repos={repos!} />

        <TableVisSwitch
          compA={<AssetJobTable assetJobs={assetJobs!} />}
          compB={<AssetJobVis assetJobs={assetJobs!} />}
        />

        <Toaster />

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
      </div>
    )
  );
}
