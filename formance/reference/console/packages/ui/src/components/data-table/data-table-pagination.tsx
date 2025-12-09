import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { DatatableCursor } from './data-table';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  serverSide?: boolean;
} & DatatablePaginationHandler<TData>;

export type DatatablePaginationHandler<TData> = {
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onPageSizeChange?: (value: string) => void;
  cursor?: DatatableCursor<TData>;
  pageSize?: number;
};

export function DataTablePagination<TData>({
  table,
  serverSide = false,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
  cursor,
  pageSize = 15,
}: DataTablePaginationProps<TData>) {
  const tablePageSize = serverSide
    ? pageSize
    : table.getState().pagination.pageSize;
  const onSelectPageChange = (value: string) => {
    if (serverSide && onPageSizeChange) {
      onPageSizeChange(value);
    } else {
      table.setPageSize(Number(value));
    }
  };

  const onNextPageChange = () => {
    if (serverSide && onNextPage) {
      onNextPage();
    } else {
      table.nextPage();
    }
  };
  const onPreviousPageChange = () => {
    if (serverSide && onPreviousPage) {
      onPreviousPage();
    } else {
      table.previousPage();
    }
  };

  const canGoOnNextPage = (): boolean => {
    if (serverSide && cursor) {
      return !cursor.hasMore;
    }

    return !table.getCanNextPage();
  };

  const canGoOnPreviousPage = (): boolean => {
    if (serverSide && cursor) {
      return !cursor.previous;
    }

    return !table.getCanPreviousPage();
  };

  const disabledRowsPerPage = !!(serverSide && cursor && cursor.previous);

  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2 mr-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            disabled={disabledRowsPerPage}
            value={`${tablePageSize}`}
            onValueChange={(value) => {
              onSelectPageChange(value);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={tablePageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[2, 5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!serverSide && (
          <div className="flex items-center justify-center text-sm font-medium mr-2">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 mr-2"
            onClick={() => onPreviousPageChange()}
            disabled={canGoOnPreviousPage()}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            type="button"
            className="h-8 w-8 p-0"
            onClick={() => onNextPageChange()}
            disabled={canGoOnNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
