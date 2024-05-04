"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { liveTable } from "@openartmarket/supabase-live-table";
import RepoVis from "./repo-vis";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

//import Hydration from "@/store/hydration";

const renderSubComponent = ({ row }: { row: any }) => {
  return <RepoVis repo={row.original as Repo} />;
};

export function RepoTable({
  repos,
  setValue,
}: {
  repos: Repo[];
  setValue: any;
}) {
  const supabase = createClient();
  const router = useRouter();

  // channel name is "repo-active-true"
  React.useEffect(() => {
    const initChannel = () => {
      const chan = liveTable<Repo>(supabase, {
        table: "repo",
        filterColumn: "active",
        filterValue: true,
        callback: (err) => {
          if (err) {
            console.error(err);
            chan.unsubscribe().then(() => initChannel());
            location.reload();
            return;
          }
          router.refresh();
        },
      });
      return chan;
    };
    const channel = initChannel();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  // React.useEffect(() => {
  //   const channel = supabase
  //     .channel("realtime repo")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "repo",
  //       },
  //       () => {
  //         router.refresh();
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [supabase, router]);

  return (
    <Card className="border-8 border-double">
      {/* <Hydration /> */}
      <DataTable
        data={repos}
        columns={columns}
        renderSubComponent={renderSubComponent}
        getRowCanExpand={() => true}
        //setValue={setValue}
      />
    </Card>
  );
}
