'use client';

import React, { CSSProperties, useEffect, useMemo, useState } from 'react';

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnResizeMode,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  RowModel,
  SortingState,
  TableOptions,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

import {
  DataTablePagination,
  DatatablePaginationHandler,
} from './data-table-pagination';
import { DataTableToolbar, DataTableToolbarProps } from './data-table-toolbar';

const getColumnWidthFromId = (column: Column<any>) => {
  switch (column.id) {
    case 'bookmark':
      return `47px`;
    case 'see':
      return `47px`;
    case 'see-and-actions':
      return `70px`;
    default:
      return column.getSize();
  }
};

const isActionColumn = (columnId: string) =>
  ['see', 'see-and-actions', 'bookmark'].includes(columnId);

const getCommonPinningStyles = <TData,>(
  column: Column<TData>,
  isLastRow?: boolean,
  isHeader?: boolean,
  hasLeftPinnedColumns?: boolean
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');
  const isFirstColumn = column.getIsFirstColumn();
  const isLastColumn = column.getIsLastColumn();

  return {
    borderRight:
      isLastLeftPinnedColumn && !isLastColumn
        ? `1px solid hsl(var(--border))`
        : isFirstRightPinnedColumn && !isLastColumn
        ? `1px solid hsl(var(--border))`
        : undefined,
    borderLeft: isFirstRightPinnedColumn
      ? `1px solid hsl(var(--border))`
      : !isFirstColumn &&
        isHeader &&
        !(
          hasLeftPinnedColumns &&
          !isPinned &&
          column.getIsFirstColumn('center')
        )
      ? `1px solid hsl(var(--border))`
      : undefined,
    borderBottom: !isLastRow ? `1px solid hsl(var(--border))` : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: getColumnWidthFromId(column),
    zIndex: isPinned ? 1 : 0,
    backgroundColor: isPinned ? 'hsl(var(--background))' : undefined,
  };
};

export type TDataTableToolbarProps = {
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
};

export type DatatableCursor<T> = {
  pageSize: number;
  hasMore: boolean;
  previous?: string;
  next?: string;
  data: T[];
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | DatatableCursor<TData> | undefined;
  initialState?: InitialTableState;
  displayPagination?: boolean;
  serverSide?: boolean;
  columnResizeMode?: ColumnResizeMode;
  onRowsSelection?: (selectedRows: RowModel<TData>) => any;
  emptyState?: React.ReactNode;
} & Pick<DataTableToolbarProps<TData>, 'searchConfig' | 'filtersConfig'> &
  Omit<DatatablePaginationHandler<TData>, 'cursor'> &
  TDataTableToolbarProps;

export function DataTable<TData, TValue>({
  columns,
  data,
  searchConfig,
  filtersConfig,
  initialState,
  displayPagination = true,
  serverSide = false,
  columnResizeMode = 'onChange',
  toolbarRight,
  toolbarLeft,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
  onRowsSelection,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility || {}
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    initialState?.columnPinning || {}
  );
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    initialState?.columnSizing || {}
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  // Auto-enable pinning for columns specified in initialState
  const enhancedColumns = useMemo(() => {
    const pinnedColumns = [
      ...(initialState?.columnPinning?.left || []),
      ...(initialState?.columnPinning?.right || []),
    ];

    if (pinnedColumns.length === 0) return columns;

    return columns.map((column) => {
      const columnId = column.id || String((column as any).accessorKey || '');
      if (pinnedColumns.includes(columnId)) {
        return { ...column, enablePinning: true };
      }

      return column;
    });
  }, [columns, initialState?.columnPinning]);

  const tableServerSideConfig: TableOptions<TData> = {
    data: (data as DatatableCursor<TData>).data || [],
    columns: enhancedColumns,
    initialState,
    state: {
      columnPinning,
      columnSizing,
    },
    pageCount: -1,
    manualPagination: true,
    columnResizeMode,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
  };

  const tableConfig: TableOptions<TData> = {
    data: (data as TData[]) || [],
    columns: enhancedColumns,
    initialState,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      columnPinning,
      columnSizing,
    },
    enableRowSelection: true,
    columnResizeMode,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  };

  const table = useReactTable(serverSide ? tableServerSideConfig : tableConfig);

  // Check if there are any left-pinned columns
  const hasLeftPinnedColumns = useMemo(
    () => (initialState?.columnPinning?.left?.length || 0) > 0,
    [initialState?.columnPinning?.left]
  );

  useEffect(() => {
    if (onRowsSelection) {
      onRowsSelection(table.getFilteredSelectedRowModel());
    }
  }, [table.getFilteredSelectedRowModel()]);

  const hasData = useMemo(() => {
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as DatatableCursor<TData>).data.length > 0;
    }

    return (data as TData[])?.length > 0;
  }, [data]);

  return (
    <div className="space-y-4 w-full">
      <DataTableToolbar
        table={table}
        filtersConfig={filtersConfig}
        searchConfig={searchConfig}
        toolbarRight={toolbarRight}
        toolbarLeft={toolbarLeft}
      />

      {hasData ? (
        <div className="rounded-md border border-border">
          <Table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="whitespace-nowrap relative"
                      style={{
                        ...getCommonPinningStyles(
                          header.column,
                          false,
                          true,
                          hasLeftPinnedColumns
                        ),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${
                            header.column.getIsResizing() ? 'isResizing' : ''
                          }`}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            height: '100%',
                            width: '5px',
                            cursor: 'col-resize',
                            userSelect: 'none',
                            touchAction: 'none',
                            backgroundColor: header.column.getIsResizing()
                              ? 'hsl(var(--primary))'
                              : 'transparent',
                            opacity: header.column.getIsResizing() ? 1 : 0,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.5';
                          }}
                          onMouseLeave={(e) => {
                            if (!header.column.getIsResizing()) {
                              e.currentTarget.style.opacity = '0';
                            }
                          }}
                        />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => {
                  const isLastRow =
                    rowIndex === table.getRowModel().rows.length - 1;

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={
                            isActionColumn(cell.column.id) ? 'px-2' : undefined
                          }
                          style={{
                            ...getCommonPinningStyles(
                              cell.column,
                              isLastRow,
                              false,
                              hasLeftPinnedColumns
                            ),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
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
      ) : emptyState ? (
        emptyState
      ) : (
        <div className="rounded-md border border-border">
          <Table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="whitespace-nowrap relative"
                      style={{
                        ...getCommonPinningStyles(
                          header.column,
                          false,
                          true,
                          hasLeftPinnedColumns
                        ),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {displayPagination && (
        <>
          {serverSide ? (
            <DataTablePagination
              table={table}
              serverSide
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
              onPageSizeChange={onPageSizeChange}
              cursor={data as DatatableCursor<TData>}
              pageSize={Number(initialState?.pagination?.pageSize)}
            />
          ) : (
            <DataTablePagination table={table} />
          )}
        </>
      )}
    </div>
  );
}
