"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { simplifyDateString } from "@/lib/purr_utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { enqueueAssetStats } from "@/lib/actions";

import { Database } from "@/lib/sb_types";
type Stat = Database["public"]["Tables"]["asset_stat"]["Row"];

export default function AssetDBStats({ stats }: { stats: Stat[] }) {
  const supabase = createClient();
  const router = useRouter();

  const getLatestUpdate = (stats: Stat[]) => {
    let mostRecent = "";
    for (const asset of stats) {
      if (asset.updated_at > mostRecent) {
        mostRecent = asset.updated_at;
      }
    }
    return simplifyDateString(mostRecent);
  };

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime asset_stat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asset_stat",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();
    //.subscribe((status) => console.log(status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const handleUpdateAssetStats: any = async () => {
    const { data, error } = await enqueueAssetStats();
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="mt-8 p-2 w-11/12">
        <Table className="text-xs text-center">
          <TableHeader>
            <TableRow>
              <TableCell>
                <Button
                  size="sm"
                  className="purr-form-button"
                  variant="secondary"
                  onClick={handleUpdateAssetStats}
                >
                  update
                </Button>
              </TableCell>
              <TableCell className="bg-slate-100">
                <div>updated:</div>{" "}
                <div className="italic">{getLatestUpdate(stats)}</div>
              </TableCell>
              <TableCell colSpan={4} className="bg-slate-100 text-center">
                <span className="font-bold">Statistics</span>: based on days
                elapsed since present
              </TableCell>

              <TableCell></TableCell>

              <TableCell colSpan={4} className="bg-slate-100 text-center">
                <span className="font-bold">Recency</span>: rows updated since
                present
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-center">asset</TableHead>
              <TableHead className="text-center">total records</TableHead>
              <TableHead className="text-center">average</TableHead>
              <TableHead className="text-center">standard dev</TableHead>
              <TableHead className="text-center">minimum</TableHead>
              <TableHead className="text-center">maximum</TableHead>

              <TableHead></TableHead>

              <TableHead className="text-center">3 months</TableHead>
              <TableHead className="text-center">6 months</TableHead>
              <TableHead className="text-center">9 months</TableHead>
              <TableHead className="text-center">12 months</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.asset}>
                <TableCell className="text-right font-bold">
                  {stat.asset}
                </TableCell>
                <TableCell>
                  {Number(stat.total_records).toLocaleString("en", {
                    useGrouping: true,
                  })}
                </TableCell>

                <TableCell className="bg-slate-100">
                  {stat.avg_elapsed_days}
                </TableCell>
                <TableCell className="bg-slate-100">
                  {stat.stddev_elapsed_days}
                </TableCell>
                <TableCell className="bg-slate-100">
                  {stat.min_elapsed_days}
                </TableCell>
                <TableCell className="bg-slate-100">
                  {stat.max_elapsed_days}
                </TableCell>

                <TableCell></TableCell>

                <TableCell className="bg-slate-100">
                  {stat.pct_updated_last_3_month}%
                </TableCell>
                <TableCell className="bg-slate-100">
                  {stat.pct_updated_last_6_month}%
                </TableCell>
                <TableCell className="bg-slate-100">
                  {stat.pct_updated_last_9_month}%
                </TableCell>
                <TableCell className="bg-slate-100">
                  {stat.pct_updated_last_12_month}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
