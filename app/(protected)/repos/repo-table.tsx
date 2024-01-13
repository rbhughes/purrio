"use client";

import React from "react";
import { Database } from "@/lib/sb_types";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";

type Repo = Database["public"]["Tables"]["repo"]["Row"];

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function RepoTable({ repos }: { repos: Repo[] }) {
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
      <DataTable data={repos} columns={columns} />
    </Card>
  );
}
