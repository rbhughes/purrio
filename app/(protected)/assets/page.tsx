import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import TableVisSwitch from "@/components/table-vis-switch";
import AssetJobForm from "./components/asset-job-form";
import { AssetJobTable } from "./asset-job-table";
import AssetJobVis from "./asset-job-vis";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  ///
  // const { data: dna, error: error } = await supabase.functions.invoke("petra", {
  //   body: { asset: "well", filter: "" },
  // });
  // console.log("---------------------------------------");
  // console.log(dna);
  // console.log("---------------------------------------");
  ///

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
        <AssetJobForm repos={repos!} assetJobs={assetJobs!} />

        <TableVisSwitch
          //compA={<AssetJobTable assetJobs={assetJobs!} />}
          compA={<h1>used to be table</h1>}
          compB={<AssetJobVis assetJobs={assetJobs!} />}
        />

        <Toaster />

        {process.env.NODE_ENV === "development" && (
          <div className="bg-red-600 mt-20 p-4 w-fit text-white">
            TODO
            <ul>
              <li>show current asset holdings (above form?)</li>
            </ul>
          </div>
        )}
      </div>
    )
  );
}
