'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const FormSchemaDatePicker = z.object({
  dob: z.date().min(new Date('1900-01-01')).max(new Date()),
});

import { cn } from '../../../lib/utils';
import { Button } from '../../button';
import { Calendar } from '../../calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../form';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';

export function DatePickerForm() {
  const form = useForm<z.infer<typeof FormSchemaDatePicker>>({
    resolver: zodResolver(FormSchemaDatePicker),
  });

  function onSubmit(data: z.infer<typeof FormSchemaDatePicker>) {
    toast.success('You submitted the following values:', {
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        dayjs(field.value).format('MMMM D, YYYY')
                      ) : (
                        <span>Choose a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
