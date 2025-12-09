'use client';

import {
  AlertCircle,
  AlertTriangle,
  Check,
  HelpCircle,
  Info,
  MoveVertical,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@platform/ui/components/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@platform/ui/components/command';
import { Kbd } from '@platform/ui/components/kbd';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@platform/ui/components/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@platform/ui/components/tooltip';
import { cn } from '@platform/ui/lib/utils';
import { useHotkeys } from '../hooks';

type Item = {
  value: string;
  label: string;
  icon: React.ElementType;
};

export interface ComboboxHotkeyProps {
  items?: Item[];
  defaultItems?: Item[];
  placeholder?: string;
  tooltipText?: string;
  defaultValue?: string;
  label?: string;
  hotkey?: string;
  onChange?: (value: string) => void;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
}

// Default icons using Lucide components
const DEFAULT_ICONS = {
  NoPriorityIcon: HelpCircle,
  UrgentIcon: AlertCircle,
  HighIcon: AlertTriangle,
  MediumIcon: Info,
  LowIcon: MoveVertical,
};

export function ComboboxHotkey({
  items,
  defaultItems = [
    {
      value: 'no-priority',
      label: 'No priority',
      icon: DEFAULT_ICONS.NoPriorityIcon,
    },
    { value: 'urgent', label: 'Urgent', icon: DEFAULT_ICONS.UrgentIcon },
    { value: 'high', label: 'High', icon: DEFAULT_ICONS.HighIcon },
    { value: 'medium', label: 'Medium', icon: DEFAULT_ICONS.MediumIcon },
    { value: 'low', label: 'Low', icon: DEFAULT_ICONS.LowIcon },
  ],
  placeholder = 'Select item...',
  tooltipText = 'Change priority',
  defaultValue = '',
  label = 'Set priority',
  hotkey = 'p',
  onChange,
  triggerClassName,
  align = 'start',
  disabled = false,
}: ComboboxHotkeyProps) {
  const [openPopover, setOpenPopover] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(() => {
    if (defaultValue) {
      const list = items || defaultItems;

      return list.find((item) => item.value === defaultValue) || null;
    }

    return null;
  });
  const [searchValue, setSearchValue] = React.useState('');

  const isSearching = searchValue.length > 0;
  const itemsList = items || defaultItems;

  // Use the useHotkeys hook to activate the dropdown when the hotkey is pressed
  useHotkeys([
    [
      hotkey,
      () => {
        setOpenTooltip(false);
        setOpenPopover(true);
      },
    ],
  ]);

  const handleSelect = (value: string) => {
    try {
      const selectedValue =
        itemsList.find((item) => item.value === value) || null;
      setSelectedItem(selectedValue);
      setOpenTooltip(false);
      setOpenPopover(false);
      setSearchValue('');

      if (onChange) {
        onChange(value);
      }
    } catch (error) {
      console.error('Error selecting item:', error);
    }
  };

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <Tooltip
        delayDuration={500}
        open={openTooltip}
        onOpenChange={setOpenTooltip}
      >
        <TooltipTrigger asChild>
          <PopoverTrigger size="sm" asChild>
            <Button
              aria-label={label}
              variant="outline"
              size="sm"
              className={cn('w-fit flex items-center gap-2', triggerClassName)}
              disabled={disabled}
            >
              {selectedItem && selectedItem.value !== 'no-priority' ? (
                <>
                  <selectedItem.icon className="size-4" aria-hidden="true" />
                  {selectedItem.label}
                </>
              ) : (
                <>
                  <DEFAULT_ICONS.NoPriorityIcon
                    className="size-4"
                    aria-hidden="true"
                  />
                  {label}
                </>
              )}

              <Kbd>{hotkey}</Kbd>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent
          hideWhenDetached
          side="bottom"
          align="start"
          sideOffset={6}
          className="flex items-center gap-2 bg-background border text-xs px-2 h-8"
        >
          <span className="text-primary">{tooltipText}</span>
          <Kbd>{hotkey}</Kbd>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-[206px] p-0 rounded-lg"
        align={align}
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={6}
      >
        <Command className="rounded-lg">
          <div className="relative">
            <CommandInput
              value={searchValue}
              onValueChange={(value) => {
                // If the user types a number, select the item by index
                if (
                  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(
                    Number.parseInt(value)
                  )
                ) {
                  const index = Number.parseInt(value);
                  const item = itemsList[index];
                  if (item) {
                    setSelectedItem(item);
                    setOpenTooltip(false);
                    setOpenPopover(false);
                    setSearchValue('');

                    if (onChange) {
                      onChange(item.value);
                    }

                    return;
                  }
                }
                setSearchValue(value);
              }}
              placeholder={placeholder}
            />
            {!isSearching && (
              <div className="absolute right-2 top-[6px]">
                <Kbd>{hotkey}</Kbd>
              </div>
            )}
          </div>
          <CommandList>
            <CommandGroup>
              {itemsList.map((item, index) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                  className="group rounded-md flex justify-between items-center w-full"
                >
                  <div className="flex items-center">
                    <item.icon className="mr-2 size-4" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedItem?.value === item.value && (
                      <Check className="mr-3 size-4" />
                    )}
                    {!isSearching && <span className="text-xs">{index}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
