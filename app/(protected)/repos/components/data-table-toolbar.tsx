"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

//import { Button } from "@/registry/new-york/ui/button";
import { Button } from "@/components/ui/button";
//import { Input } from "@/registry/new-york/ui/input";
import { Input } from "@/components/ui/input";
//import { DataTableViewOptions } from "@/app/examples/tasks/components/data-table-view-options";
import { DataTableViewOptions } from "./data-table-view-options";

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

//import { priorities, statuses } from "../data/data";

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

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

import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 bg-purple-200">
        <Input
          placeholder="Filter..."
          value={(table.getColumn("fs_path")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("fs_path")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )} */}
        {table.getColumn("geo_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("geo_type")}
            title="geo_type"
            options={geo_types}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
