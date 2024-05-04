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
  useRepoTableStore,
  RepoColumnVisibility,
  //repoColumnVisibilityStateToVisibilityState,
} from "@/store/use-repo-table-store";
//import { RepoColumnVisibility } from "@/store/use-repo-settings";

///

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
  ///
  const [hydrated, setHydrated] = React.useState<boolean>(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  ///

  const [rowSelection, setRowSelection] = React.useState(rowsSelected);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  ///---zzz

  // const zustandRepoCols = useRepoSettings(
  //   (state) => state.columnVisibility as VisibilityState
  // );

  const setZustandColumnVisibility = useRepoTableStore(
    (state) => state.setColumnVis
  );
  const fetchPersisted = useRepoTableStore((state) => state.fetchPersisted);

  const regular = useRepoTableStore(
    //(state) => state.columnVis as VisibilityState
    (state) => state.columnVis
  );

  const [columnVisibility, setColumnVisibility] = React.useState(
    regular as VisibilityState
  );

  React.useEffect(() => {
    // hydrated or not...
    let persisted = fetchPersisted();
    setColumnVisibility(persisted);
  }, []);

  React.useEffect(() => {
    if (hydrated) {
      setZustandColumnVisibility(columnVisibility as RepoColumnVisibility);
      //console.log(`(H20), regular.conn is ${JSON.stringify(regular.conn)}`);
    } else {
      //console.log(`(DRY), regular.conn is ${JSON.stringify(regular.conn)}`);
    }

    // if (hydrated) {
    //   let v = columnVisibility as RepoColumnVisibility;
    //   let vv = { ...columnVisibility, ...{ conn: columnVisibility.conn } };
    //   console.log("HYDRATED    conn=", JSON.stringify(vv.conn, null, 2));
    //   // let v = columnVisibility as RepoColumnVisibility;
    //   setZustandColumnVisibility(v); //sets zustand
    //   setColumnVisibility(v); //sets the table live
    // } else {
    //   let v = columnVisibility as RepoColumnVisibility;
    //   console.log("NOT HYDRATED v  conn=", JSON.stringify(v.conn, null, 2));
    //   console.log(
    //     "NOT HYDRATED r  conn=",
    //     JSON.stringify(regular.conn, null, 2)
    //   );
    // }
    // if (hydrated) {
    //   console.log("inside", JSON.stringify(columnVisibility.conn));
    // }
    // let c = "magenta";
    // setColor(c);
    // setMyStateColor(c);
    // console.log("color=", color);
  }, [columnVisibility]);

  ///---zzz

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
    //onColumnVisibilityChange: replacement,
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
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div className="rounded-md border">
        {hydrated ? (
          <div className="bg-blue-300">
            columnVisibility.conn ={JSON.stringify(columnVisibility.conn)} |
          </div>
        ) : (
          <div className="bg-yellow-300">
            columnVisibility.conn ={JSON.stringify(columnVisibility.conn)} |
          </div>
        )}
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
  );
}
