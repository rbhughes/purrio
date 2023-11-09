"use client";

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

import { Database } from "@/lib/sb_types";

import { ColumnDef } from "@tanstack/react-table";

//import { Badge } from "@/registry/new-york/ui/badge";
import { Badge } from "@/components/ui/badge";

//import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { Checkbox } from "@/components/ui/checkbox";

//import { Repo } from "../repo-schema";
type Repo = Database["public"]["Tables"]["repos"]["Row"];

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

// export const statuses = [
//   {
//     value: "backlog",
//     label: "Backlog",
//     icon: QuestionMarkCircledIcon,
//   },
//   {
//     value: "todo",
//     label: "Todo",
//     icon: CircleIcon,
//   },
//   {
//     value: "in progress",
//     label: "In Progress",
//     icon: StopwatchIcon,
//   },
//   {
//     value: "done",
//     label: "Done",
//     icon: CheckCircledIcon,
//   },
//   {
//     value: "canceled",
//     label: "Canceled",
//     icon: CrossCircledIcon,
//   },
// ];

// export const priorities = [
//   {
//     label: "Low",
//     value: "low",
//     icon: ArrowDownIcon,
//   },
//   {
//     label: "Medium",
//     value: "medium",
//     icon: ArrowRightIcon,
//   },
//   {
//     label: "High",
//     value: "high",
//     icon: ArrowUpIcon,
//   },
// ];

export const geo_types = [
  {
    label: "GeoGraphix",
    value: "geographix",
    icon: ArrowDownIcon,
  },
  {
    label: "Petra",
    value: "petra",
    icon: ArrowRightIcon,
  },
  {
    label: "Kingdom",
    value: "kingdom",
    icon: ArrowUpIcon,
  },
  {
    label: "LAS",
    value: "las",
    icon: ArrowUpIcon,
  },
];

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
    accessorKey: "geo_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="geo_type" />
    ),
    cell: ({ row }) => {
      const geo_type = geo_types.find(
        (geo_type) => geo_type.value === row.getValue("geo_type")
      );

      if (!geo_type) {
        return null;
      }

      return (
        <div className="flex items-center">
          {geo_type.icon && (
            <geo_type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{geo_type.label}</span>
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
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    //enableSorting: false,
    //enableHiding: false,
  },
  {
    accessorKey: "fs_path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="fs_path" />
    ),
    cell: ({ row }) => {
      const label = labels.find(
        (label) => label.value === row.original.fs_path
      );

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("fs_path")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "human_size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="human_size" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("human_size")}</div>
    ),
  },

  {
    accessorKey: "repo_mod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="repo_mod" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("repo_mod")}</div>
    ),
  },

  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     );

  //     if (!status) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

//export const columns: string = "I AM COLUMNA";
