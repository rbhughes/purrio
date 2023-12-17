"use client";

import React from "react";
import { Database } from "@/lib/sb_types";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

import AssetJobCard from "./asset-job-card";

type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

export default function AssetJobs({ assetJobs }: { assetJobs: AssetJob[] }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime asset-job")
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
    <ul>
      {assetJobs?.map((aj: AssetJob) => (
        <li key={aj.id}>
          <AssetJobCard assetJob={aj} />
        </li>
      ))}
    </ul>
  );
}
