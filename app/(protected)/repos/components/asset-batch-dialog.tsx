"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import { CopyIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/lib/sb_types";
//type Batch = Database["public"]["Tables"]["batch"]["Row"];
type Batch = Database["public"]["Tables"]["asset_job"]["Row"];

export const dynamic = "force-dynamic";

//TODO: match styling of DialogTrigger to dropdownMenu (width)
export function AssetBatchDialog({ repo_id }: { repo_id: string }) {
  //TODO: this is a singleton, move to lib?
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  const [batches, setBatches] = React.useState<Batch[]>([]);

  // React.useEffect(() => {
  //   const fetchBatches = async () => {
  //     const { data, error } = await supabase.from("batch").select();
  //     if (error) {
  //       console.error(error);
  //       setBatches([]);
  //     } else {
  //       setBatches(data as Batch[]);
  //     }
  //   };
  //   fetchBatches();
  // }, []);

  React.useEffect(() => {
    const channel = supabase
      .channel("realtime batch")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "batch",
        },
        async (payload: any) => {
          //const batch: Batch = payload.new;

          setBatches((payload) => {
            console.log("eeeeeeeeeeee", payload);
            return [];
          });

          //router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // const { data: repos } = await supabase
  //   .from("repo")
  //   .select()
  //   .order("row_created", { ascending: false });

  console.log("bbbbbbbbbbbbbbbbbbbbb", batches!.length);

  return (
    <>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8  p-2 data-[state=open]:bg-muted"
        >
          Batches
        </Button>
      </DialogTrigger>

      {/* <DialogContent className="sm:max-w-md"> */}
      {/* <DialogContent className="max-w-2xl"> */}
      <DialogContent className="min-w-full">
        <DialogHeader>
          <DialogTitle>Share link MY repo_id {repo_id}</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          {JSON.stringify(batches, null, 2)}
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
