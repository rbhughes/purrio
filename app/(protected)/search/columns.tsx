"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/dt/data-table-column-header";
import { SuiteUI } from "@/lib/purr_ui";
import { Database } from "@/lib/sb_types";
import { getExcerptsFromJSON } from "@/lib/purr_utils";

//type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];
type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];

//import { AssetJobRowActions } from "./asset-job-row-actions";

export const columns: ColumnDef<SearchResult>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "suite",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="suite" />
    ),
    cell: ({ row }) => {
      const gt: string = row.getValue("suite");
      if (!gt) {
        return "(empty)";
      }
      return (
        <div className="flex items-center gap-1 w-[120px]">
          {SuiteUI[gt].icon}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "repo_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="repo_name" />
    ),
    cell: ({ row }) => <div>{row.getValue("repo_name")}</div>,
    enableResizing: true,
    //minSize does not work, only the direct assignment seems to work
    //size: 1600,
    //enableSorting: false,
    //enableHiding: false,
  },

  {
    accessorKey: "asset",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="asset" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("asset")}</div>,
  },

  {
    accessorKey: "tag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="tag" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("tag")}</div>,
  },

  {
    accessorKey: "well_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="well_id" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("well_id")}</div>
    ),
  },

  {
    accessorKey: "doc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="doc" />
    ),
    cell: ({ row }) => {
      let terms: string[] = [];
      try {
        const sb = row.getValue("search_body") as any;
        let termString = sb.terms;
        if (termString) {
          terms = termString.split(" ");
        }
      } catch (error) {
        console.log(error);
      }

      let excerpts = getExcerptsFromJSON(row.getValue("doc"), terms);
      return excerpts.map((e, i) => {
        let x = (
          <div key={row.original.id + i}>
            <span>{e.left}</span>
            <span className="bg-yellow-300">{e.match}</span>
            <span>{e.right}</span>
          </div>
        );
        return x;
      });
    },
  },

  {
    accessorKey: "search_body",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="search_body" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {JSON.stringify(row.getValue("search_body"))}
      </div>
    ),
  },
];
