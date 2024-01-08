"use client";

import React from "react";
import { Database } from "@/lib/sb_types";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Repo = Database["public"]["Tables"]["repo"]["Row"];

//import { columns } from "./components/columns";
//import { DataTable } from "./components/data-table";

export default function RepoVis({ repos }: { repos: Repo[] }) {
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
    <div className="border border-amber-500 my-4">
      <div className="bg-amber-100 ">
        <pre>{JSON.stringify(repos, null, 2)}</pre>
      </div>
    </div>
  );
}
