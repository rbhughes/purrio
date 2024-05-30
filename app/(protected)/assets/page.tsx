import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/components/loader";
import AssetJobs from "./asset-jobs";
import { fetchWorkers } from "@/lib/actions";
import { Database } from "@/lib/sb_types";

type Repo = Database["public"]["Tables"]["repo"]["Row"];
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

export default async function Page() {
  const workers = await fetchWorkers();

  if (workers.length < 1) {
    redirect("/settings");
  }

  const supabase = createClient();

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
    return { extants, missing };
  };

  const filteredAssetJobs = extantReposOnly(repos!, assetJobs!);

  return (
    <div>
      <Suspense fallback={<Loader target="AssetJobs" />}>
        <AssetJobs
          repos={repos!}
          withMissingRepos={filteredAssetJobs.missing}
        />
      </Suspense>
      <Toaster expand richColors className="flex w-6/12" />
    </div>
  );
}
