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
  ExpandedState,
  //getExpandedRowModel, ///
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  // Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  //renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement;
  renderSubComponent: any;
  //getRowCanExpand: (row: Row<TData>) => boolean;
  getRowCanExpand: any;
  //setValue: any;
}

// sets which rows are selected by default
//let rowsSelected: RowSelectionState = { "1": true };
let rowsSelected: RowSelectionState = {};

// set visible columns (commmented out means "always on")
let colsVisible: VisibilityState = {
  //bytes: false,
  conn: false,
  conn_aux: false,
  directories: false,
  display_epsg: false,
  display_name: false,
  files: false,
  //fs_path: false,
  //suite: false,
  id: false,
  //name: false,
  //repo_mod: false,
  //created_at: false,
  touched_at: false,
  updated_at: false,
  storage_epsg: false,
  storage_name: false,
  //well_count: false,
  wells_with_completion: false,
  wells_with_core: false,
  wells_with_dst: false,
  wells_with_formation: false,
  wells_with_ip: false,
  wells_with_perforation: false,
  wells_with_production: false,
  wells_with_raster_log: false,
  wells_with_survey: false,
  wells_with_vector_log: false,
  wells_with_zone: false,
};

//const setFormFromTable = async (setValue: any, row: any) => {};

export function DataTable<TData, TValue>({
  columns,
  data,
  renderSubComponent,
  getRowCanExpand,
  //setValue,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState(rowsSelected);
  const [columnVisibility, setColumnVisibility] = React.useState(colsVisible);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
    },
    onExpandedChange: setExpanded,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: getRowCanExpand,
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onDoubleClick={() => {
                      row.toggleExpanded();
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && (
                    <TableRow key={`${row.id + "_viz"}`}>
                      <td colSpan={row.getVisibleCells().length}>
                        {renderSubComponent({ row })}
                      </td>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
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
