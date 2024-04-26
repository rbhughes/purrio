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

import { enqueueRepoReconTask, deleteRepo, pickWorker } from "@/lib/actions";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

//import { ASSETS } from "@/lib/purr_utils";
import { toast } from "sonner";
import {
  enqueueAssetJobTask,
  deleteAssetJob,
  ActionWithSummary,
} from "@/lib/actions";

import React from "react";

// const handleAssetJobDelete = async (assetJob: AssetJob) => {
//   const { data, error } = await deleteAssetJob(assetJob.id);
//   if (error) {
//     toast.error(data);
//   } else {
//     toast.info(data);
//   }
// };

// const handleAssetJobEnqueue = async (assetJob: AssetJob) => {
//   if (assetJob.asset === "ALL_ASSETS") {
//     const bunch: Promise<ActionWithSummary>[] = [];

//     ASSETS.forEach((asset) => {
//       let clone = { ...assetJob };
//       clone.asset = asset;
//       bunch.push(enqueueAssetJobTask(clone));
//     });

//     Promise.all(bunch)
//       .then((data: any) => {
//         let msg = data.map((m: any) => m.data);
//         toast.info(<pre>{msg.join("\n")}</pre>);
//       })
//       .catch((error) => {
//         toast.error(JSON.stringify(error));
//       });
//   } else {
//     const { data, error } = await enqueueAssetJobTask(assetJob);
//     if (error) {
//       toast.error(data);
//     } else {
//       toast.info(data);
//     }
//   }
// };

const handleRepoDelete = async (repo: Repo) => {
  const { data, error } = await deleteRepo(repo.id);
  if (error) {
    toast.error(error);
  } else {
    toast.info(data);
  }
};

const handleRepoRefresh = async (repo: Repo) => {
  // NOTE: pickWorker may not yield the same worker first used by repo recon
  // TS example: const repoConnAux: Repo["conn_aux"] = { ggx_host: "scarab" };

  const worker = await pickWorker();

  let formData = {
    recon_root: repo.fs_path!, // repo.fs_path ~ equivalent to a refresh
    suite: repo.suite!,
    //worker: worker,
    ggx_host: undefined,
    kingdom_server: undefined,
    kingdom_username: undefined,
    kingdom_password: undefined,
  };

  if (repo.suite === "geographix") {
    formData.ggx_host = (repo.conn_aux as any).ggx_host || "localhost";
    formData.kingdom_server = undefined;
    formData.kingdom_username = undefined;
    formData.kingdom_password = undefined;
  } else if (repo.suite === "kingdom") {
    formData.ggx_host = undefined;
    formData.kingdom_server = (repo.conn_aux as any).kingdom_server || "";
    formData.kingdom_username = (repo.conn_aux as any).kingdom_username || "";
    formData.kingdom_password = (repo.conn_aux as any).kingdom_password || "";
  }
  const { data, error } = await enqueueRepoReconTask(formData);
  if (error) {
    toast.error(error);
  } else {
    toast.info(data);
  }
};

export function RepoRowActions({ repo }: { repo: Repo }) {
  const [alertVisible, setAlertVisible] = React.useState(false);
  const title = "Forget Repo?";
  const message = "Are you sure you want to forget this Repo?";

  return (
    <div className="flex justify-end w-fit">
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
              onClick={async () => await handleRepoDelete(repo)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="purr-datatable-button bg-green-500 hover:bg-green-700"
          onClick={async () => {
            await handleRepoRefresh(repo);
            //await handleAssetJobEnqueue(assetJob);
          }}
        >
          refesh
        </Button>
        <Button
          size="sm"
          className="purr-datatable-button bg-red-500 hover:bg-red-700"
          onClick={async () => {
            setAlertVisible(true); //just triggers the AlertDialog
          }}
        >
          delete
        </Button>
      </div>
    </div>
  );
}
