"use client";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  //AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

import { ASSETS } from "@/lib/purr_utils";
import { toast } from "sonner";
import {
  enqueueAssetJobTask,
  deleteAssetJob,
  ServerActionCRUD,
} from "@/lib/actions";

import React from "react";

const handleAssetJobDelete = async (assetJob: AssetJob) => {
  const { data, error } = await deleteAssetJob(assetJob.id);
  if (error) {
    toast.error(data);
  } else {
    toast.info(data);
  }
};

const handleAssetJobEnqueue = async (assetJob: AssetJob) => {
  if (assetJob.asset === "ALL_ASSETS") {
    const bunch: Promise<ServerActionCRUD>[] = [];

    ASSETS.forEach((asset) => {
      let clone = { ...assetJob };
      clone.asset = asset;
      bunch.push(enqueueAssetJobTask(clone));
    });

    Promise.all(bunch)
      .then((data: any) => {
        let msg = data.map((m: any) => m.data);
        toast.info(<pre>{msg.join("\n")}</pre>);
      })
      .catch((error) => {
        toast.error(JSON.stringify(error));
      });
  } else {
    const { data, error } = await enqueueAssetJobTask(assetJob);
    if (error) {
      toast.error(data);
    } else {
      toast.info(data);
    }
  }
};

export function AssetJobRowActions({ assetJob }: { assetJob: AssetJob }) {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const title = "Delete AssetJob";
  const message = "Are you sure you want to delete this Asset Job?";

  return (
    <>
      <AlertDialog
        onOpenChange={setAlertVisible}
        open={alertVisible}
        defaultOpen={alertVisible}
      >
        {/* <AlertDialogTrigger>huh</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => console.log("cancelled")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => await handleAssetJobDelete(assetJob)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="w-[75px] bg-green-500 active:scale-95"
          onClick={async () => {
            await handleAssetJobEnqueue(assetJob);
          }}
        >
          enqueue
        </Button>
        <Button
          size="sm"
          className="w-[75px] bg-red-500 active:scale-95"
          onClick={async () => {
            setAlertVisible(true); //just triggers the AlertDialog
          }}
        >
          delete
        </Button>
      </div>
    </>
  );
}
