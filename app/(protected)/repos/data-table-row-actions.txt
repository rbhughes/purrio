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

//import { RepoSchema } from "../repo-schema";
import { toast } from "sonner";
import { enqueueRepoReconTask, deleteRepo, pickWorker } from "@/lib/actions";
import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

//TODO: better toasty error handling
const handleRepoRefresh = async (repo: Repo) => {
  // NOTE: pickWorker may not yield the same worker first used by repo recon
  // TS example: const repoConnAux: Repo["conn_aux"] = { ggx_host: "scarab" };

  const worker = await pickWorker();

  let formData = {
    recon_root: repo.fs_path!, // repo.fs_path ~ equivalent to a refresh
    suite: repo.suite!,
    worker: worker,
    ggx_host: "",
    kingdom_server: "",
    kingdom_username: "",
    kingdom_password: "",
  };

  if (repo.suite === "geographix") {
    formData.ggx_host = (repo.conn_aux as any).ggx_host || "localhost";
  } else if (repo.suite === "kingdom") {
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

//TODO: better toasty error handling
const handleRepoForget = async (repo: Repo) => {
  const { data, error } = await deleteRepo(repo.id);
  if (error) {
    toast.error(error);
  } else {
    toast.info(data);
  }
};

//TODO: better toasty error handling
const handleRepoDetail = async (repo: Repo) => {
  console.log("pop up a dialog or something");
};

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  //const repo = RepoSchema.parse(row.original); // it's a zod thing

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
            await handleRepoRefresh(row.original as Repo);
          }}
        >
          Refresh...
        </DropdownMenuItem>

        {/* ---------- */}

        <DropdownMenuItem
          onClick={async () => {
            await handleRepoForget(row.original as Repo);
          }}
        >
          Forget...
        </DropdownMenuItem>

        {/* ---------- */}

        {/* <DropdownMenuItem
          onClick={async () => {
            await handleRepoDetail(row.original as Repo);
          }}
        >
          Detail View...
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
