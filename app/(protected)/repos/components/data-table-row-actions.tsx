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

//import { Database } from "@/lib/sb_types";
//type Repo = Database["public"]["Tables"]["repo"]["Row"];

//import { RepoSchema, Repo } from "../repo-schema";
import { RepoSchema, Repo } from "../repo-schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

//----------
const handleRepoRefresh = async (repo: Repo) => {
  // NOTE: pickWorker may not yield the same worker used by repo recon
  const worker = await pickWorker();

  let refreshOpts = {
    geo_type: repo.geo_type,
    recon_root: repo.fs_path, // equivalent to a refresh
    worker: worker,
    ggx_host: "",
  };

  if (repo.geo_type === "geographix") {
    refreshOpts.ggx_host = repo.conn_aux?.ggx_host || "localhost"; //kosher?
  } else if (repo.geo_type === "kingdom") {
    // TODO: fill this in for kingdom
  }

  const result = await addRepoReconTask(refreshOpts);
  console.log("addRepoReconTask", result);
};

//----------
const handleRepoForget = async (repo: Repo) => {
  const result = await deleteRepo(repo.id);
  console.log(result);
};

//----------
const handleRepoDetail = async (repo: Repo) => {
  console.log("pop up a dialog");
};

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const repo = RepoSchema.parse(row.original);

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
          onClick={(e) => {
            //e.preventDefault();
            handleRepoRefresh(row.original as Repo);
          }}
        >
          Refresh...
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            //e.preventDefault();
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
