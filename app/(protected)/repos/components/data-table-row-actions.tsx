"use client";

import { CopyIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { addRepoReconTask, deleteRepo, pickWorker } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RepoSchema, Repo } from "../repo-schema";

//import { createClient } from "@/utils/supabase/client";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const handleRepoRefresh = async (repo: Repo) => {
  // NOTE: may not be the same worker used by repo recon
  const worker = await pickWorker();

  let refreshOpts = {
    geo_type: repo.geo_type,
    recon_root: repo.fs_path, // equivalent to a refresh
    hostname: worker,
    ggx_host: "",
  };

  if (repo.geo_type === "geographix") {
    refreshOpts.ggx_host = repo.conn_aux?.ggx_host || "localhost"; //kosher?
  } else if (repo.geo_type === "kingdom") {
  }

  const result = await addRepoReconTask(refreshOpts);
};

const handleRepoForget = async (repo: Repo) => {
  const result = await deleteRepo(repo.id);
  console.log(result);
};

const doThing = (x: any, r: any) => {
  console.log("I should be doing a thing:", x);
  console.log(r);
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
        {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}

        {/* what's up with asChild?:
           https://www.radix-ui.com/primitives/docs/guides/composition*/}
        {/* <DropdownMenuItem asChild> */}
        {/* // but another, simpler solution is to just remove DropDownMenuItem
          https://github.com/shadcn-ui/ui/issues/1128 */}

        {/* // */}
        {/* <AssetBatchDialog repo_id={"a repo id"} /> */}
        {/* // */}

        {/* ================================ */}
        <DropdownMenuItem
          onClick={(e) => {
            //e.preventDefault();
            handleRepoRefresh(row.original as Repo);
          }}
        >
          Refresh
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            //e.preventDefault();
            handleRepoForget(row.original as Repo);
          }}
        >
          Forget
        </DropdownMenuItem>
        {/* ================================ */}
        {/* <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={repo.geo_type}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
