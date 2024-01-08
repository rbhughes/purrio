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

//import { Database as DatabaseIcon } from "lucide-react";
import { Cylinder } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
//import { Progress } from "@/components/ui/progress";

import { Checkbox } from "@/components/ui/checkbox";

type Repo = Database["public"]["Tables"]["repo"]["Row"];

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { humanFileSize } from "@/lib/utils";

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

// interface JsonObject {
//   [key: string]: number;
// }

// function getValueByKey(jsonArray: string, searchKey: string): number | null {
//   const parsedArray: JsonObject[] = JSON.parse(jsonArray);

//   const resultObject = parsedArray.find((item) => searchKey in item);

//   if (resultObject) {
//     return resultObject[searchKey];
//   }

//   return null; // or any default value if the key is not found
// }

// const expandInventoryToColumns = (inventory: JsonObject[]) => {
//   inventory.forEach((i) => {
//     for (const [key, val] of Object.entries(i)) {
//       console.log(key, "--------", val);
//     }
//   });
// };

//TODO: move to util
export const geo_types = [
  {
    label: "GeoGraphix",
    value: "geographix",
    //icon: <DatabaseIcon color="#ff0000" />,
    /* <Cylinder color="blue" size={20} strokeWidth={3} /> */
    icon: () => (
      <Cylinder color="lime" className="mx-1" size={20} strokeWidth={3} />
    ),
  },
  {
    label: "Petra",
    value: "petra",
    //icon: ArrowRightIcon,
    icon: () => (
      <Cylinder color="turquoise" className="mx-1" size={20} strokeWidth={3} />
    ),
  },
  {
    label: "Kingdom",
    value: "kingdom",
    //icon: ArrowUpIcon,
    icon: () => (
      <Cylinder color="red" className="mx-1" size={20} strokeWidth={3} />
    ),
  },
  {
    label: "LAS",
    value: "las",
    //icon: ArrowUpIcon,
    icon: () => (
      <Cylinder color="grey" className="mx-1" size={20} strokeWidth={3} />
    ),
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
        <div className="flex items-center w-[120px]">
          {geo_type.icon()}
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
    //cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableResizing: true,
    //minSize does not work, only the direct assignment seems to work
    //size: 1600,
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
          <pre>
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("fs_path")}
            </span>
          </pre>
        </div>
      );
    },
  },
  ///////////////////

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
      <div>{row.getValue("repo_mod")}</div>
    ),
  },
  {
    accessorKey: "row_changed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="row_changed" />
    ),
    cell: ({ row }) => <div>{row.getValue("row_changed")}</div>,
  },
  {
    accessorKey: "row_created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="row_created" />
    ),
    cell: ({ row }) => <div>{row.getValue("row_created")}</div>,
  },
  {
    accessorKey: "row_touched",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="row_touched" />
    ),
    cell: ({ row }) => <div>{row.getValue("row_touched")}</div>,
  },

  ///////
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

  // {
  //   accessorKey: "asset_progress",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="asset_progress" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="w-[80px]">
  //       <Progress value={row.getValue("asset_progress")} />
  //     </div>
  //   ),
  // },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
