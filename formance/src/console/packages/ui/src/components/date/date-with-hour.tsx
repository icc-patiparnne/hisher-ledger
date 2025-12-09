'use client';

import { cva, VariantProps } from 'class-variance-authority';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Calendar } from '../calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { ScrollArea, ScrollBar } from '../scroll-area';

const dateWithHourVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'h-8 text-xs',
      md: 'h-9 text-sm',
      lg: 'h-10 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface DateWithHourProps extends VariantProps<typeof dateWithHourVariants> {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const ampm = ['AM', 'PM'];

export function DateWithHour({
  value,
  onChange,
  size,
  className,
}: DateWithHourProps) {
  const [date, setDate] = useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);
  // Track the month to display in the calendar
  const [month, setMonth] = useState<Date | undefined>(
    value ? new Date(value) : new Date()
  );

  // Update internal state when external value changes
  useEffect(() => {
    if (value) {
      setDate(value);
      setMonth(new Date(value)); // Update month when value changes
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Create a new date at the start of the selected day in UTC
      const newDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          date ? date.getHours() : 0,
          date ? date.getMinutes() : 0
        )
      );

      setDate(newDate);
      setMonth(newDate);
      if (onChange) onChange(newDate);
    }
  };

  const handleTimeChange = (
    type: 'hour' | 'minute' | 'ampm',
    value: string
  ) => {
    if (date) {
      // Create a new date (in local time)
      const newDate = new Date(date.getTime());
      if (type === 'hour') {
        const hour =
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0);
        newDate.setHours(hour);
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
      } else if (type === 'ampm') {
        const currentHours = newDate.getHours();
        const newHours =
          value === 'PM' ? (currentHours % 12) + 12 : currentHours % 12;
        newDate.setHours(newHours);
      }
      setDate(newDate);
      if (onChange) onChange(newDate);
    }
  };

  // Customize button sizes based on the size prop
  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'icon-sm';
      case 'lg':
        return 'icon-lg';
      default:
        return 'icon-md';
    }
  };

  return (
    <div className={cn(dateWithHourVariants({ size, className }))}>
      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-8 justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              dayjs(date).format('MM/DD/YYYY hh:mm A')
            ) : (
              <span>MM/DD/YYYY hh:mm A</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          style={
            {
              '--radix-popper-available-height': '300px',
            } as React.CSSProperties
          }
        >
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              month={month}
              onMonthChange={setMonth}
              initialFocus
            />
            <div
              className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x"
              style={{
                height: '280px',
              }}
            >
              <ScrollArea className="sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.reverse().map((hour) => (
                    <Button
                      key={hour}
                      size={getButtonSize()}
                      variant={
                        date && date.getHours() % 12 === hour % 12
                          ? 'primary'
                          : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange('hour', hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {minutes.reverse().map((minute) => (
                    <Button
                      key={minute}
                      size={getButtonSize()}
                      variant={
                        date && date.getMinutes() === minute
                          ? 'primary'
                          : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange('minute', minute.toString())
                      }
                    >
                      {minute}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>

              <ScrollArea className="">
                <div className="flex sm:flex-col p-2">
                  {ampm.map((ampm) => (
                    <Button
                      key={ampm}
                      size={getButtonSize()}
                      variant={
                        date &&
                        ((ampm === 'AM' && date.getHours() < 12) ||
                          (ampm === 'PM' && date.getHours() >= 12))
                          ? 'primary'
                          : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange('ampm', ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
