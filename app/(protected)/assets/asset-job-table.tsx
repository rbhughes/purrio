"use client";

import React from "react";
import { Database } from "@/lib/sb_types";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";

type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function AssetJobTable({
  assetJobs,
}: {
  assetJobs: AssetJob[];
}) {
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime asset job")
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
      <DataTable data={assetJobs} columns={columns} />
    </Card>
  );
}
