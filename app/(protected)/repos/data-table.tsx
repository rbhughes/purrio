"use client";

import { createPortal } from "react-dom";

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
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

import { DataTablePagination } from "@/components/dt/data-table-pagination";
import { DataTableToolbar } from "@/components/dt/data-table-toolbar";

import {
  useDataTableStore,
  RepoColumnVisibility,
} from "@/store/use-data-table-store";

import { fetchPersistedState } from "@/store/use-data-table-store";

import { GeneralSwitch } from "@/components/general-switch";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  //renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement;
  renderSubComponent: any;
  //getRowCanExpand: (row: Row<TData>) => boolean;
  getRowCanExpand: any;
  //setValue: any;
}

//let rowsSelected: RowSelectionState = { "1": true };
let rowsSelected: RowSelectionState = {};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  renderSubComponent,
  getRowCanExpand,
}: DataTableProps<TData, TValue>) {
  // Ensure that Next.js is truly in "use-client" mode. See details in
  // use-repo-settings (ignore some state if we're in SSR)
  // "hydrated" doesn't mean hydrated in the zustand sense--more like "rendered"
  const [hydrated, setHydrated] = React.useState<boolean>(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const [rowSelection, setRowSelection] = React.useState(rowsSelected);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expanded, setExpanded] = React.useState<ExpandedState>(true);
  const [rowExpansionPortal, setRowExpansionPortal] =
    React.useState<HTMLElement | null>(null);

  /////
  const setRepoColumnVisibility = useDataTableStore(
    (state) => state.setRepoColumnVisibility
  );

  const repoColumnVisibility = useDataTableStore(
    (state) => state.repoColumnVisibility
  );

  const repoRowsExpanded = useDataTableStore((state) => state.repoRowsExpanded);
  const setRepoRowsExpanded = useDataTableStore(
    (state) => state.setRepoRowsExpanded
  );

  const [columnVisibility, setColumnVisibility] = React.useState(
    repoColumnVisibility as VisibilityState
  );

  // set initial state, hydrated or not; see use-data-table-store.
  React.useEffect(() => {
    let persisted = fetchPersistedState();
    setColumnVisibility(persisted.state.repoColumnVisibility);
    setExpanded(persisted.state.repoRowsExpanded);
  }, []);

  // Ensure that localStorage (zustand) stays in sync with columnVisibility
  React.useEffect(() => {
    if (hydrated) {
      setRepoColumnVisibility(columnVisibility as RepoColumnVisibility);
      setRepoRowsExpanded(expanded as ExpandedState);
    }
  }, [columnVisibility, expanded]);

  // beastly way to set the row-expansion Switch in the right place...
  React.useEffect(() => {
    const rowExpansionSwitchDiv: HTMLElement =
      document.getElementById("row-expansion")!;
    setRowExpansionPortal(rowExpansionSwitchDiv);
  }, [hydrated]);

  /////

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
  });

  return (
    hydrated && (
      <div className="space-y-4">
        <DataTableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        {rowExpansionPortal &&
          createPortal(
            <GeneralSwitch
              label="row expansion"
              checked={expanded as boolean}
              onChange={setExpanded}
            />,
            rowExpansionPortal
          )}

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
                            cell.getContext()
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
        <DataTablePagination table={table} defaultFileName="repos" />
      </div>
    )
  );
}
