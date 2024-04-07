import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import AssetJobs from "./asset-jobs";
import AssetDBStats from "./asset-db-stats";
import AssetStoreInit from "@/store/asset-store-init";

import { Suspense } from "react";
import { Loader } from "@/components/loader";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = createClient();

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

  const { data: stats } = await supabase
    .from("asset_stat")
    .select()
    .order("asset");

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
    <div>
      <Suspense fallback={<Loader target="AssetJobs" />}>
        <AssetJobs
          repos={repos!}
          assetJobs={filteredAssetJobs.extants}
          withMissingRepos={filteredAssetJobs.missing}
        />
      </Suspense>

      <Suspense fallback={<Loader target="AssetDBStats" />}>
        <AssetDBStats stats={stats!} />
      </Suspense>

      <Toaster expand richColors className="flex w-6/12" />

      <Suspense fallback={<Loader target="AssetStoreInit" />}>
        <AssetStoreInit />
      </Suspense>

      {process.env.NODE_ENV === "development" && (
        <div className="bg-red-600 mt-20 p-4 w-fit text-white">
          TODO
          <ul>
            <li>show current asset holdings (above form?)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
