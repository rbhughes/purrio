import SlowThing from "./test";
import { Suspense } from "react";
import { Loader } from "@/components/loader";

import { createClient } from "@/utils/supabase/server";
import AssetDBStats from "./asset-db-stats";

export default async function Settings() {
  const supabase = createClient();

  const { data: stats } = await supabase
    .from("asset_stat")
    .select()
    .order("asset");

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<Loader target="Settings" />}>
        <SlowThing />
      </Suspense>

      <Suspense fallback={<Loader target="AssetDBStats" />}>
        <AssetDBStats stats={stats!} />
      </Suspense>
    </div>
  );
}
