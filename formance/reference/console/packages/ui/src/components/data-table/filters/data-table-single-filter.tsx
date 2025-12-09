'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../command';
import { Input } from '../../input';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select';

import { cn } from '../../../lib/utils';
import { Button } from '../../button';

/**
 * DataTableSingleFilter - Standalone Filter Component
 *
 * PURPOSE:
 * - Provides a single, independent filter component
 * - Handles its own URL parameter synchronization
 * - Reusable for various filter types (select, input, etc.)
 * - Self-contained without complex filter list management
 *
 * FEATURES:
 * - Automatic URL parameter reading/writing
 * - Support for select, input variants
 * - Clean, simple API
 * - No dependencies on complex filter systems
 */

interface FilterOption {
  label: string;
  value: string;
}

interface DataTableSingleFilterProps {
  /** The variant of the filter (select, input, etc.) */
  variant: 'select' | 'input';

  /** The ID used for URL parameter (e.g., 'ledger_selected') */
  id: string;

  /** Display label for the filter */
  label: string;

  /** Placeholder text */
  placeholder?: string;

  /** Options for select variant */
  options?: FilterOption[];

  /** Default value to use when no URL parameter exists */
  defaultValue?: string;

  /** Callback when value changes */
  onValueChange?: (value: string) => void;

  /** Additional CSS classes */
  className?: string;
}

export function DataTableSingleFilter({
  variant,
  id,
  label,
  placeholder,
  options = [],
  defaultValue,
  onValueChange,
  className,
}: DataTableSingleFilterProps) {
  // State for the current filter value
  const [value, setValue] = useState<string>('');

  // State for popover open/closed (select variant)
  const [open, setOpen] = useState(false);

  // SSR safety flag
  const [isClient, setIsClient] = useState(false);

  // Ref to avoid dependency on onValueChange callback
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // Initialize client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Read initial value from URL parameter or use default
  useEffect(() => {
    if (!isClient) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(id);

    if (paramValue) {
      setValue(paramValue);
    } else if (defaultValue) {
      setValue(defaultValue);

      // Update URL with default value
      const url = new URL(window.location.href);
      url.searchParams.set(id, defaultValue);
      window.history.pushState({}, '', url.toString());

      // Notify parent component
      onValueChangeRef.current?.(defaultValue);
    }
  }, [isClient, id, defaultValue]);

  // Handle value changes and URL updates
  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);

      // Update URL parameter
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);

        if (newValue) {
          url.searchParams.set(id, newValue);
        } else {
          url.searchParams.delete(id);
        }

        // Update URL without page reload
        window.history.pushState({}, '', url.toString());
      }

      // Call external callback
      onValueChange?.(newValue);
    },
    [id, onValueChange]
  );

  // Render different variants
  const renderFilter = () => {
    switch (variant) {
      case 'select': {
        // For select with many options, use Command (searchable)
        if (options.length > 10) {
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger size="sm" asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    'w-[200px] justify-between',
                    !value && 'text-muted-foreground'
                  )}
                >
                  {value
                    ? options.find((option) => option.value === value)?.label
                    : placeholder || `Select ${label.toLowerCase()}...`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                  />
                  <CommandList>
                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            handleValueChange(
                              currentValue === value ? '' : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === option.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }

        // For select with few options, use regular Select
        return (
          <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[200px]" size="sm">
              <SelectValue
                placeholder={placeholder || `Select ${label.toLowerCase()}...`}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case 'input':
        return (
          <Input
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            className="w-[200px]"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('flex items-center', className)}>{renderFilter()}</div>
  );
}
