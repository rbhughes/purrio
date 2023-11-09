"use client";

import React from "react";
import { Database } from "@/lib/sb_types";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

//import ShowRepo from "./show-repo";
type Repo = Database["public"]["Tables"]["repos"]["Row"];

export default function ShowRepoz({ repos }: { repos: Repo[] }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime repos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "repos",
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

  return repos?.map((repo: Repo) => {
    return (
      <div key={repo.id} className="p-4 bg-slate-200 mb-2">
        {/* <ShowRepo repo={repo} /> */}
        {JSON.stringify(repo)}
      </div>
    );
  });
}
