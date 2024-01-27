"use client";

import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "../components/data-table-pagination";
import { DataTableToolbar } from "../components/data-table-toolbar";

import AssetJobForm from "../components/asset-job-form";

import { ASSETS, GEOTYPES } from "@/lib/purr_utils";

import { Database } from "@/lib/sb_types";
type AssetJob = Database["public"]["Tables"]["asset_job"]["Row"];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  //renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement;
  //getRowCanExpand: (row: Row<TData>) => boolean;
  setValue: any;
}

// sets which rows are selected by default
//let rowsSelected: RowSelectionState = { "1": true };
let rowsSelected: RowSelectionState = {};

// set visible columns (commmented out means "always on")
let colsVisible: VisibilityState = {
  active: false,
  //asset: false,
  chunk: false,
  cron: false,
  //filter: false,
  id: false,
  last_invoked: false,
  //repo_fs_path: true,
  //repo_geo_type: true,
  repo_id: false,
  //repo_name: false,
  row_created: false,
};

///
const setFormFromTable = async (setValue: any, row: any) => {
  let assetJob = row.original as AssetJob;
  setValue("geo_type", assetJob.geo_type);
  setTimeout(() => {
    setValue("id", assetJob.id || null);
    setValue("repo_id", assetJob.repo_id || "");
    setValue("active", assetJob.active || true);
    setValue("asset", assetJob.asset || ASSETS[0]);
    setValue("chunk", assetJob.chunk || 100);
    setValue("cron", assetJob.cron || "");
    setValue("filter", assetJob.filter || "");
    //setValue("id", aj.filter);
    setValue("repo_fs_path", assetJob.repo_fs_path || null);
    setValue("repo_name", assetJob.repo_name || null);
  }, 300);
};
///

export function DataTable<TData, TValue>({
  columns,
  data,
  //renderSubComponent,
  //getRowCanExpand,
  setValue,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState(rowsSelected);
  const [columnVisibility, setColumnVisibility] = React.useState(colsVisible);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    //getRowCanExpand,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              ///
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onDoubleClick={() => setFormFromTable(setValue, row)}
                    // onDoubleClick={() => {
                    //   let aj = row.original as AssetJob;
                    //   setValue("active", aj.active);
                    //   setValue("asset", aj.asset);
                    //   setValue("chunk", aj.chunk);
                    //   setValue("cron", aj.cron);
                    //   setValue("filter", aj.filter);
                    //   //setValue("id", aj.filter);
                    //   setValue("repo_fs_path", aj.repo_fs_path);
                    //   setValue("repo_geo_type", aj.repo_geo_type);
                    //   setValue("repo_id", aj.repo_id);
                    //   setValue("repo_name", aj.repo_name);
                    //   //console.log(row);
                    // }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* {row.getIsExpanded() && (
                    <TableRow key={`${row.id}_aj`}>
                      <td colSpan={row.getVisibleCells().length}>
                        {renderSubComponent({ row })}
                      </td>
                    </TableRow>
                  )} */}
                </React.Fragment>
              ))
            ) : (
              ///
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
