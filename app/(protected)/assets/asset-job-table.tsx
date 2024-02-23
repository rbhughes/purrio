"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { liveTable } from "@openartmarket/supabase-live-table";

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

  // To recover realtime after timeouts or other web-socket disruption
  // https://github.com/openartmarket/supabase-live-table
  React.useEffect(() => {
    const initChannel = () => {
      const channel = liveTable<AssetJob>(supabase, {
        table: "asset_job",
        filterColumn: "active",
        filterValue: true,
        callback: (err, things) => {
          if (err) {
            console.error(err);
            channel.unsubscribe().then(() => initChannel());
            location.reload();
            return;
          }
          router.refresh();
        },
      });
      return channel;
    };
    const chan = initChannel();

    return () => {
      supabase.removeChannel(chan);
    };
  }, [supabase, router]);

  // (original, pre-liveTable)
  //
  // React.useEffect(() => {
  //   const channel = supabase
  //     .channel("realtime asset job")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "asset_job",
  //       },
  //       () => {
  //         router.refresh();
  //       }
  //     )
  //     .subscribe((status) => console.log(status));

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase, router]);

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
