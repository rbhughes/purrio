"use client";

import React from "react";
import { Database } from "@/lib/sb_types";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

type Repo = Database["public"]["Tables"]["repo"]["Row"];

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default function RepoTable({ repos }: { repos: Repo[] }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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

  return <DataTable data={repos} columns={columns} />;
}
