import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { AssetJobForm } from "./components/asset-jobs-form";
import AssetJobs from "./components/asset-jobs";

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

  return (
    user && (
      <>
        <AssetJobForm repos={repos!} />
        <AssetJobs assetJobs={assetJobs!} />;
      </>
    )
  );
}
