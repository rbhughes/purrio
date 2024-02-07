"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { GeoTypeUI } from "@/lib/purr_ui";
import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

//import { Progress } from "@/components/ui/progress";

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

  // {
  //   id: "expander",
  //   header: () => null,
  //   cell: ({ row }) => {
  //     return row.getCanExpand() ? (
  //       <button
  //         {...{
  //           onClick: row.getToggleExpandedHandler(),
  //           style: { cursor: "pointer" },
  //         }}
  //       >
  //         {row.getIsExpanded() ? "👇" : "👉"}
  //       </button>
  //     ) : (
  //       "🔵"
  //     );
  //   },
  // },

  {
    accessorKey: "geo_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="geo_type" />
    ),
    cell: ({ row }) => {
      // const geo_type = GeoTypeUI.find(
      //   (geo_type) => geo_type.value === row.getValue("geo_type")
      // );
      const gt: string = row.getValue("geo_type");

      // if (!geo_type) {
      //   return null;
      // }

      return (
        <div className="flex  w-[120px]">
          {GeoTypeUI[gt].icon}
          {GeoTypeUI[gt].label}
          {/* {geo_type.icon()}
          {geo_type.label} */}
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
    accessorKey: "filter",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="filter" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("filter")}</div>,
  },

  {
    accessorKey: "row_created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="row_created" />
    ),
    cell: ({ row }) => <div>{row.getValue("row_created")}</div>,
  },

  ///
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="active" />
    ),
    cell: ({ row }) => <div>{JSON.stringify(row.getValue("active"))}</div>,
  },
  ///

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
