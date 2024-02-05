"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

export function AssetJobTable({
  assetJobs,
  setValue,
  setShowForm,
  setShowAdvancedForm,
}: {
  assetJobs: AssetJob[];
  setValue: any;
  setShowForm: any;
  setShowAdvancedForm: any;
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
      <DataTable
        data={assetJobs}
        columns={columns}
        setValue={setValue}
        setShowForm={setShowForm}
        setShowAdvancedForm={setShowAdvancedForm}
      />
    </Card>
  );
}
