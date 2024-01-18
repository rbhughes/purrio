"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { addRepoReconTask, deleteRepo, pickWorker } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

import { RepoSchema } from "../repo-schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

interface Fake {
  ggx_host: string;
}

//----------
const handleRepoRefresh = async (repo: Repo) => {
  // NOTE: pickWorker may not yield the same worker first used by repo recon
  // TS example: const repoConnAux: Repo["conn_aux"] = { ggx_host: "scarab" };

  const worker = await pickWorker();

  let formData = {
    recon_root: repo.fs_path!, // equivalent to a refresh
    geo_type: repo.geo_type!,
    worker: worker,
    ggx_host: "",
    kingdom_server: "",
    kingdom_username: "",
    kingdom_password: "",
  };

  if (repo.geo_type === "geographix") {
    formData.ggx_host = (repo.conn_aux as any).ggx_host || "localhost";
  } else if (repo.geo_type === "kingdom") {
    formData.kingdom_server = (repo.conn_aux as any).kingdom_server || "";
    formData.kingdom_username = (repo.conn_aux as any).kingdom_username || "";
    formData.kingdom_password = (repo.conn_aux as any).kingdom_password || "";
  }
  const result = await addRepoReconTask(formData);
  // console.log("addRepoReconTask", result);
};

//----------
const handleRepoForget = async (repo: Repo) => {
  const result = await deleteRepo(repo.id);
};

//----------
const handleRepoDetail = async (repo: Repo) => {
  console.log("pop up a dialog");
};

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const repo = RepoSchema.parse(row.original); //it's a zod thing

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
        <DropdownMenuItem
          onClick={() => {
            handleRepoRefresh(row.original as Repo);
          }}
        >
          Refresh...
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            handleRepoForget(row.original as Repo);
          }}
        >
          Forget...
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            //e.preventDefault();
            handleRepoDetail(row.original as Repo);
          }}
        >
          Detail View...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
