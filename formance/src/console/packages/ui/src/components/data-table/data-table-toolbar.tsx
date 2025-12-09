import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '../button';
import { Input } from '../input';
import { DataTableViewOptions } from './data-table-view-options';

import { cn } from '../../lib/utils';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

export type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchConfig?: {
    placeholder: string;
    columnKey: string;
    size?: 'sm' | 'md' | 'lg';
  }[];
  filtersConfig?: {
    title: string;
    column: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  toolbarLeft?: React.ReactNode;
  toolbarRight?: React.ReactNode;
};

export function DataTableToolbar<TData>({
  table,
  searchConfig,
  filtersConfig,
  toolbarLeft,
  toolbarRight,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center gap-2 justify-between">
      <div
        className="flex items-center gap-2"
        data-testid="datatable-toolbar-left"
      >
        {toolbarLeft}
        {searchConfig &&
          searchConfig.map((search, index) => (
            <Input
              key={index}
              size="sm"
              placeholder={search.placeholder}
              data-testid={`datatable-search-${index}`}
              value={
                (table
                  .getColumn(search.columnKey)
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table
                  .getColumn(search.columnKey)
                  ?.setFilterValue(event.target.value)
              }
              className={cn('', {
                'w-28': search.size === 'sm',
                'w-40 lg:w-52': search.size === 'md' || !search.size,
                'w-56': search.size === 'lg',
              })}
            />
          ))}
        {filtersConfig &&
          filtersConfig.map((filter, index) => {
            if (table.getColumn(filter.column)) {
              return (
                <DataTableFacetedFilter
                  key={index}
                  column={table.getColumn(filter.column)}
                  title={filter.title}
                  options={filter.options}
                />
              );
            }
          })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 ml-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div
        className="flex items-center gap-2"
        data-testid="datatable-toolbar-right"
      >
        {toolbarRight}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
