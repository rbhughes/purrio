"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/dt/data-table-column-header";
//import { DataTableRowActions } from "./data-table-row-actions";
import { SuiteUI } from "@/lib/purr_ui";
import { Database } from "@/lib/sb_types";
import { simplifyDateString } from "@/lib/purr_utils";

type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

import { AssetJobRowActions } from "./asset-job-row-actions";

export const columns: ColumnDef<AssetJob>[] = [
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
      return (
        <div className="flex items-center gap-1 w-[120px]">
          {SuiteUI[gt].icon}
          {SuiteUI[gt].label}
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
    accessorKey: "repo_fs_path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="repo_fs_path" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <pre>
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("repo_fs_path")}
            </span>
          </pre>
        </div>
      );
    },
  },

  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "tag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="tag" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("tag")}</div>,
  },

  {
    accessorKey: "cron",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="cron" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("cron")}</div>,
  },

  {
    accessorKey: "recency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="recency" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("recency")}</div>
    ),
  },
  {
    accessorKey: "chunk",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="chunk" />
    ),
    cell: ({ row }) => <div>{JSON.stringify(row.getValue("chunk"))}</div>,
  },

  {
    accessorKey: "filter",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="filter" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("filter")}</div>,
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="created_at" />
    ),
    cell: ({ row }) => (
      <div>{simplifyDateString(row.getValue("created_at"))}</div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="updated_at" />
    ),
    cell: ({ row }) => (
      <div>{simplifyDateString(row.getValue("updated_at"))}</div>
    ),
  },
  {
    accessorKey: "touched_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="touched_at" />
    ),
    cell: ({ row }) => (
      <div>{simplifyDateString(row.getValue("touched_at"))}</div>
    ),
  },

  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="active" />
    ),
    cell: ({ row }) => <div>{JSON.stringify(row.getValue("active"))}</div>,
  },

  // this button-based handler replaces the default DataTableRowActions
  {
    id: "actions",
    cell: ({ row }) => (
      <AssetJobRowActions assetJob={row.original as AssetJob} />
    ),
  },
];
