'use client';

import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';

import { cn } from '../../../lib/utils';
import { Button } from '../../button';
import { Calendar } from '../../calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: dayjs(new Date(2023, 0, 20)).add(20, 'day').toDate(),
  });

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {dayjs(date.from).format('MMM DD, YYYY')} -{' '}
                  {dayjs(date.to).format('MMM DD, YYYY')}
                </>
              ) : (
                dayjs(date.from).format('MMM DD, YYYY')
              )
            ) : (
              <span>Choose a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
