'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '../../../../lib/utils';
import { Button } from '../../../button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../command';
import { Popover, PopoverContent, PopoverTrigger } from '../../../popover';
import { SaveFiltersHook } from './save-filter-form';

type SaveFilterSelectorProps = {
  tableId: string;
  onFilterSelect?: (filterName: string) => void;
  selectedFilter?: string;
  onSelect?: () => void;
  getCurrentSearchParams: () => string;
  onApplySearchParams: (searchParams: string) => void;
  hook?: SaveFiltersHook;
};

export function SaveFilterSelector({
  tableId,
  onFilterSelect,
  selectedFilter: externalSelectedFilter,
  onSelect,
  getCurrentSearchParams,
  onApplySearchParams,
  hook,
}: SaveFilterSelectorProps) {
  const [open, setOpen] = useState(false);
  const [internalSelectedFilter, setInternalSelectedFilter] =
    useState<string>();

  // If no hook provided, create no-op functions and empty data
  const listSavedFiltersByTableId =
    hook?.listSavedFiltersByTableId || (() => []);
  const getSavedFilterByName = hook?.getSavedFilterByName || (() => undefined);

  const data = listSavedFiltersByTableId(tableId).map((savedFilter) => ({
    label: savedFilter.name,
    value: savedFilter.searchParams,
    id: savedFilter.name,
  }));

  const hasActiveFilters = () => {
    const searchParams = getCurrentSearchParams();
    const params = new URLSearchParams(searchParams);
    const entries = Array.from(params.entries());
    // Return true if there are parameters other than 'region'

    return entries.some(([key]) => key !== 'region');
  };

  // Find if current URL params match any saved filter
  useEffect(() => {
    // Only try to match if there are active filters and no external selection
    if (!hasActiveFilters() || externalSelectedFilter !== undefined || !hook) {
      return;
    }

    const currentParams = new URLSearchParams(getCurrentSearchParams());
    const sortedCurrentParams = new URLSearchParams(
      [...currentParams.entries()].sort()
    );

    const matchingFilter = data.find((filter) => {
      const filterParams = new URLSearchParams(filter.value);
      const sortedFilterParams = new URLSearchParams(
        [...filterParams.entries()].sort()
      );

      return sortedFilterParams.toString() === sortedCurrentParams.toString();
    });

    if (matchingFilter) {
      setInternalSelectedFilter(matchingFilter.id);
    } else {
      setInternalSelectedFilter(undefined);
    }
  }, [getCurrentSearchParams(), data, externalSelectedFilter, hook]);

  // Update internal state when external selection changes
  useEffect(() => {
    if (externalSelectedFilter !== undefined) {
      setInternalSelectedFilter(externalSelectedFilter);
    }
  }, [externalSelectedFilter]);

  const onChange = (value: string) => {
    const savedFilter = getSavedFilterByName(value);
    if (savedFilter) {
      onApplySearchParams(savedFilter.searchParams);
      onFilterSelect?.(value);
      setInternalSelectedFilter(value);
      onSelect?.();
      setOpen(false);
    }
  };

  const canSaveView = data.length > 0 && hook;
  const currentValue = internalSelectedFilter || '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          size="sm"
          disabled={!canSaveView}
        >
          {currentValue
            ? data.find((item) => item.id === currentValue)?.label
            : canSaveView
            ? 'Select saved filter'
            : 'No filter saved'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search filters..." />
          <CommandList>
            <CommandEmpty>No saved filters found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => onChange(item.id)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentValue === item.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
