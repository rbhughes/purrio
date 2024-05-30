//import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import { fetchWorkers } from "@/lib/actions";
import { createClient } from "@/utils/supabase/server";

import AssetDBStats from "./asset-db-stats";
import SlowThing from "./test";
import { Workers } from "./workers";

export default async function Settings() {
  const supabase = createClient();

  const workers = await fetchWorkers();

  const { data: stats } = await supabase
    .from("asset_stat")
    .select()
    .order("asset");

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<Loader target="Settings" />}>
        <SlowThing />
      </Suspense>

      <Workers workers={workers} />

      <Suspense fallback={<Loader target="AssetDBStats" />}>
        <AssetDBStats stats={stats!} />
      </Suspense>
    </div>
  );
}
