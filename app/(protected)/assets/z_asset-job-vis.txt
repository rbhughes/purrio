"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

export default function AssetJobVis({ assetJobs }: { assetJobs: AssetJob[] }) {
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime asset-job")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asset_job",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <Card>
      <CardContent>
        <div className="bg-amber-100 ">
          <pre>{JSON.stringify(assetJobs, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
