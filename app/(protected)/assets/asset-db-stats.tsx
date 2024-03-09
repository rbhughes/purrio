"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Database } from "@/lib/sb_types";
type Stat = Database["public"]["Tables"]["asset_stat"]["Row"];

export default function AssetDBStats({ stats }: { stats: Stat[] }) {
  const supabase = createClient();
  const router = useRouter();

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
      .subscribe((status) => console.log(status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <div className="flex justify-center">
      <Card className="mt-8 p-2 w-11/12">
        {/* <CardDescription>
          Local AssetDB: days elapsed since last update.
        </CardDescription> */}
        <Table className="text-xs text-center">
          <TableHeader>
            <TableRow>
              <TableCell colSpan={2}></TableCell>
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
              {/* <TableHead className="text-right">Amount</TableHead> */}
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

                {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
        </Table>
      </Card>
    </div>
  );
}
