"use client";

import { Table } from "@tanstack/react-table";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { GeoTypeUI, facetOptions } from "@/lib/purr_ui";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter..."
          value={(table.getColumn("fs_path")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("fs_path")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("geo_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("geo_type")}
            title="geo_type"
            options={facetOptions}
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
