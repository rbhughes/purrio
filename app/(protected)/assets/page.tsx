import React from "react";
import { createClient } from "@/lib/supabase/server";

import { Database } from "@/lib/sb_types";

export const dynamic = "force-dynamic";

//type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];
//type Repo = Database["public"]["Tables"]["repo"]["Row"];

import AssetJobs from "./components/asset-jobs";

import { AssetJobForm } from "./components/asset-jobs-form";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user ? user.email! : "guest";

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
      <>
        <AssetJobForm repos={repos!} />
        <AssetJobs assetJobs={assetJobs!} />;
      </>
    )
  );
}
