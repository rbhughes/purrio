"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

import AssetJobForm from "./components/asset-job-form";

import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

import {
  renderSubComponent,
  //renderAssetJobForm,
} from "./components/asset-job-form";

//const renderSubComponent = ({ row }: { row: any<AssetJob> }) => {
// const renderSubComponent = ({ row }: { row: any }) => {
//   //return <AssetJobForm repos={[row]} />;
//   return (
//     <pre style={{ fontSize: "10px" }}>
//       <code>{JSON.stringify(row.original, null, 2)}</code>
//     </pre>
//   );
// };

export function AssetJobTable({
  assetJobs,
  setValue,
}: {
  assetJobs: AssetJob[];
  setValue: any;
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
        //renderSubComponent={renderSubComponent}
        //getRowCanExpand={() => true}
        setValue={setValue}
      />
    </Card>
  );
}
