"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/dt/data-table-column-header";
import { humanFileSize } from "@/lib/purr_utils";
import { SuiteUI } from "@/lib/purr_ui";
import { simplifyDateString } from "@/lib/purr_utils";
import { RepoRowActions } from "./repo-row-actions";

import { Database } from "@/lib/sb_types";
type Repo = Database["public"]["Tables"]["repo"]["Row"];

export const columns: ColumnDef<Repo>[] = [
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
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableResizing: true,
  },

  {
    accessorKey: "fs_path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="fs_path" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <pre>
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("fs_path")}
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
    accessorKey: "files",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="files" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("files")}</div>,
  },

  {
    accessorKey: "directories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="directories" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("directories")}</div>
    ),
  },

  {
    accessorKey: "bytes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="size" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{humanFileSize(row.getValue("bytes"))}</div>
    ),
  },
  {
    accessorKey: "conn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="conn" />
    ),
    cell: ({ row }) => (
      <div>
        <pre>{JSON.stringify(row.getValue("conn"), null, 2)}</pre>
      </div>
    ),
  },
  {
    accessorKey: "conn_aux",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="conn_aux" />
    ),
    cell: ({ row }) => (
      <div>
        <pre>{JSON.stringify(row.getValue("conn_aux"), null, 2)}</pre>
      </div>
    ),
  },

  {
    accessorKey: "storage_epsg",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="storage_epsg" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("storage_epsg")}</div>
    ),
  },

  {
    accessorKey: "storage_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="storage_name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("storage_name")}</div>
    ),
  },

  {
    accessorKey: "display_epsg",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="display_epsg" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("display_epsg")}</div>
    ),
  },

  {
    accessorKey: "display_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="display_name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("display_name")}</div>
    ),
  },

  {
    accessorKey: "repo_mod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="repo_mod" />
    ),
    cell: ({ row }) => (
      // <div className="w-[80px]">{row.getValue("repo_mod")}</div>
      <div>{simplifyDateString(row.getValue("repo_mod"))}</div>
    ),
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
    accessorKey: "well_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="well_count" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("well_count")}</div>
    ),
  },
  {
    accessorKey: "wells_with_completion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_completion" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_completion")}</div>
    ),
  },
  {
    accessorKey: "wells_with_core",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_core" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_core")}</div>
    ),
  },
  {
    accessorKey: "wells_with_dst",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_dst" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_dst")}</div>
    ),
  },
  {
    accessorKey: "wells_with_formation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_formation" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_formation")}</div>
    ),
  },
  {
    accessorKey: "wells_with_ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_ip" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_ip")}</div>
    ),
  },
  {
    accessorKey: "wells_with_perforation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_perforation" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_perforation")}</div>
    ),
  },
  {
    accessorKey: "wells_with_production",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_production" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_production")}</div>
    ),
  },
  {
    accessorKey: "wells_with_raster_log",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_raster_log" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_raster_log")}</div>
    ),
  },
  {
    accessorKey: "wells_with_survey",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_survey" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_survey")}</div>
    ),
  },
  {
    accessorKey: "wells_with_vector_log",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_vector_log" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_vector_log")}</div>
    ),
  },
  {
    accessorKey: "wells_with_zone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="wells_with_zone" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("wells_with_zone")}</div>
    ),
  },

  // this button-based handler replaces the default DataTableRowActions
  {
    id: "actions",
    cell: ({ row }) => <RepoRowActions repo={row.original as Repo} />,
  },
];
