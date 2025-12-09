'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { toast } from 'sonner';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../form';

export function CheckboxDemoWithFormDemo() {
  const FormSchemaCheckbox = z.object({
    mobile: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchemaCheckbox>>({
    resolver: zodResolver(FormSchemaCheckbox),
    defaultValues: {
      mobile: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchemaCheckbox>) {
    toast.success('You submitted the following values:', {
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the
                  {/* <Link to='#'>mobile settings</Link>  */}
                  <a href="#">mobile settings</a>
                  page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
