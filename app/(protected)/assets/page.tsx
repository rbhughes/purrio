import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import AssetJobs from "./asset-jobs";

import AssetStoreInit from "@/store/asset-store-init";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

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
  // //console.log(dna);
  // console.log("---------------------------------------");

  const { data: assetJobs } = await supabase
    .from("asset_job")
    .select()
    .order("created_at", { ascending: false });

  const { data: repos } = await supabase
    .from("repo")
    .select()
    .order("updated_at", { ascending: false });

  // Some AssetJobs may exist when their associated Repo is missing. Hide them.
  const extantReposOnly = (repos: Repo[], assetJobs: AssetJob[]) => {
    const missing: AssetJob[] = [];
    const extants: AssetJob[] = [];
    const repoIds = new Set(repos.map((repo) => repo.id));
    assetJobs.filter((aj: AssetJob) => {
      if (repoIds.has(aj.repo_id)) {
        extants.push(aj);
      } else {
        missing.push(aj);
      }
    });
    return { extants: extants, missing: missing };
  };

  const filteredAssetJobs = extantReposOnly(repos!, assetJobs!);

  return (
    user && (
      <div>
        <AssetJobs
          repos={repos!}
          assetJobs={filteredAssetJobs.extants}
          withMissingRepos={filteredAssetJobs.missing}
        />
        {/* <Toaster richColors /> */}
        <Toaster expand richColors className="flex w-6/12" />
        <AssetStoreInit />

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
