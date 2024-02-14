"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import { Database } from "@/lib/sb_types";
import RepoVis, { VisCard } from "./repo-vis";

type Repo = Database["public"]["Tables"]["repo"]["Row"];

const renderSubComponent = ({ row }: { row: any }) => {
  return (
    // <pre style={{ fontSize: "10px" }}>
    //   <code>{JSON.stringify(row.original, null, 2)}</code>
    // </pre>
    <div className="flex justify-center  bg-slate-100">
      <VisCard repo={row.original as Repo} />
    </div>
  );
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

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime repo")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repo",
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
        data={repos}
        columns={columns}
        renderSubComponent={renderSubComponent}
        getRowCanExpand={() => true}
        setValue={setValue}
      />
    </Card>
  );
}
