"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AssetJobSchema } from "./asset-job-schema";
import { enqueueAssetJobTask, deleteAssetJob } from "@/lib/actions";
import { Database } from "@/lib/sb_types";
import { toast } from "sonner";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

//TODO: better toasty error handling
const handleAssetJobDelete = async (assetJob: AssetJob) => {
  const { data, error } = await deleteAssetJob(assetJob.id);
  if (error) {
    toast.error(data);
  } else {
    toast.info(data);
  }
};

//TODO: better toasty error handling
const handleAssetJobEnqueue = async (assetJob: AssetJob) => {
  const { data, error } = await enqueueAssetJobTask(assetJob);
  if (error) {
    toast.error(data);
  } else {
    toast.info(data);
  }
};

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  //const assetJob = AssetJobSchema.parse(row.original); // zod thing

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* ---------- */}

        <DropdownMenuItem
          onClick={async () => {
            const assetJob = row.original as AssetJob;
            await handleAssetJobEnqueue(assetJob);
          }}
        >
          Enqueue...
        </DropdownMenuItem>

        {/* ---------- */}

        <DropdownMenuItem
          onClick={async () => {
            const assetJob = row.original as AssetJob;
            await handleAssetJobDelete(assetJob);
          }}
        >
          Delete...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
