'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { uniqueId } from 'lodash-es';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../../../button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../form';
import { Input } from '../../../input';
import { Popover, PopoverContent, PopoverTrigger } from '../../../popover';

export interface SaveFiltersHook {
  listSavedFiltersByTableId: (tableId: string) => SavedFilterModel[];
  getSavedFilterByName: (name: string) => SavedFilterModel | undefined;
  isSavedFilterNameExist: (name: string) => boolean;
  saveFilter: (name: string, searchParams: string, tableId: string) => void;
}

export type SavedFilterModel = {
  name: string;
  searchParams: string;
  tableId: string;
};

type SaveFilterFormProps = {
  tableId: string;
  disabled?: boolean;
  onFilterSaved?: (filterName: string) => void;
  getCurrentSearchParams: () => string;
  hook?: SaveFiltersHook;
};

const createSaveFilterSchema = (
  isSavedFilterNameExist: (name: string) => boolean
) =>
  z.object({
    name: z
      .string()
      .min(1)
      .refine((val) => !isSavedFilterNameExist(val), {
        message: 'Filter name already taken.',
      }),
  });

type SaveFilterFormValues = z.infer<ReturnType<typeof createSaveFilterSchema>>;

export function SaveFilterForm({
  tableId,
  disabled,
  onFilterSaved,
  getCurrentSearchParams,
  hook,
}: SaveFilterFormProps) {
  const [saveFilterOpen, setSaveFilterOpen] = useState(false);

  // If no hook provided, create no-op functions
  const isSavedFilterNameExist = hook?.isSavedFilterNameExist || (() => false);
  const saveFilter = hook?.saveFilter || (() => {});

  const saveFilterSchema = createSaveFilterSchema(isSavedFilterNameExist);

  const form = useForm<SaveFilterFormValues>({
    defaultValues: {
      name: `my_filter_${uniqueId()}`,
    },
    resolver: zodResolver(saveFilterSchema),
  });

  const hasActiveFilters = () => {
    const searchParams = getCurrentSearchParams();
    const params = new URLSearchParams(searchParams);
    const entries = Array.from(params.entries());

    // Return true if there are parameters other than 'region'
    return entries.some(([key]) => key !== 'region');
  };

  const onSaveFilter = async () => {
    const values = form.getValues();
    const searchParams = getCurrentSearchParams();

    saveFilter(values.name, searchParams, tableId);
    setSaveFilterOpen(false);
    form.reset({
      name: `my_filter_${uniqueId()}`,
    });

    onFilterSaved?.(values.name);
  };

  const isDisabled = disabled || !hasActiveFilters() || !hook;

  return (
    <Popover open={saveFilterOpen} onOpenChange={setSaveFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon-md" disabled={isDisabled}>
          <Save />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSaveFilter)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter filter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isDisabled}
            >
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
