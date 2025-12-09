import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TransferInitiationRequestType } from '@platform/sdks/formance/src/models/components';
import {
  Button,
  DateWithHour,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from '@platform/ui';
import { lowerCaseAllWordsExceptFirstLetter } from '@platform/utils';

import { useAction } from '@platform/remix';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { TRANSFER_INITIATION_TYPE } from '../../../../utils/sdk/payments/constants';
import {
  CONNECTIVITY_ACTION_CREATE_TRANSFER,
  TRANSFER_INITIATION_TYPE_TO_COLOR,
  TRANSFER_INITIATION_TYPE_TO_ICON,
} from '../../constants';

// Base transfer schema
const createTransferInitiationSchema = z.object({
  reference: z.string(),
  scheduledAt: z.date(),
  description: z.string(),
  sourceAccountID: z.string().refine((value) => value.length > 5, {
    message: 'Source account ID must be greater than 5 characters long',
  }),
  destinationAccountID: z.string().refine((value) => value.length > 5, {
    message: 'Destination account ID must be greater than 5 characters long',
  }),
  connectorID: z.string().refine((value) => value.length > 5, {
    message: 'Connector ID must be greater than 5 characters long',
  }),
  type: z.nativeEnum(TRANSFER_INITIATION_TYPE),
  amount: z.number(),
  asset: z.string(),
  validated: z.boolean(),
  metadata: z.nullable(z.record(z.string())).optional(),
});

export type CreateTransferInitiationFormValues = z.infer<
  typeof createTransferInitiationSchema
>;

export default function TransferActionsCreate() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'transfer-actions-create',
  });

  const { submit: createTransfer, isSubmitting: isCreatingTransfer } =
    useAction<CreateTransferInitiationFormValues>({
      formAction: CONNECTIVITY_ACTION_CREATE_TRANSFER,
      actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
        CONNECTIVITY_ACTION_CREATE_TRANSFER
      ].to,
      onSuccess: () => {
        setIsOpen(false);
      },
    });

  const [isOpen, setIsOpen] = useState(false);

  const onCreate = () => {
    const values = form.getValues();
    createTransfer(values);
  };

  const form = useForm<CreateTransferInitiationFormValues>({
    defaultValues: {
      reference: '17',
      scheduledAt: new Date(),
      description: 'New transfer description',
      sourceAccountID: '',
      destinationAccountID: '',
      type: TRANSFER_INITIATION_TYPE.Transfer,
      amount: 5,
      asset: 'EUR/2',
      validated: false,
      connectorID: '',
    },
    resolver: zodResolver(createTransferInitiationSchema),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onCreate)}>
            <DialogHeader className="mb-4">
              <DialogTitle>Create Transfer</DialogTitle>
              <DialogDescription>
                Create a new transfer to move funds between accounts.
              </DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <ScrollArea className="h-[400px]">
              <div className="grid gap-4 p-1">
                <div className="flex flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Reference *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Type *</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value}
                            {...field}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>

                            <SelectContent>
                              {Object.values(TransferInitiationRequestType).map(
                                (type) => {
                                  const IconComponent =
                                    TRANSFER_INITIATION_TYPE_TO_ICON[type];

                                  return (
                                    <SelectItem value={type} key={type}>
                                      <span className="flex items-center gap-2">
                                        <IconComponent
                                          className={`h-4 w-4 ${TRANSFER_INITIATION_TYPE_TO_COLOR[type]}`}
                                        />
                                        {lowerCaseAllWordsExceptFirstLetter(
                                          type
                                        )}
                                      </span>
                                    </SelectItem>
                                  );
                                }
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled At *</FormLabel>
                      <FormControl>
                        <DateWithHour
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                        />
                      </FormControl>
                      <FormDescription>
                        The date and time the transfer will be processed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The description of the transfer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceAccountID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Account ID *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The source account ID is the account that will send the
                        funds.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationAccountID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Account ID *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The destination account ID is the account that will
                        receive the funds.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="connectorID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connector ID *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The connector ID is the connector that will be used to
                        process the transfer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Amount *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            step="1"
                            pattern="[0-9]+"
                            onChange={(e) => {
                              field.onChange({
                                ...e,
                                target: {
                                  ...e.target,
                                  value: parseInt(e.target.value),
                                },
                              });
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          The amount to transfer.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="asset"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Asset *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The asset to transfer.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* <FormField
                  control={form.control}
                  name="pending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Pending</FormLabel>
                        <FormDescription>
                          {field.value
                            ? "If checked, it will create a hold on the wallet's balance (timestamp cannot be used)"
                            : 'If unchecked, it will debit the wallet immediately (requires timestamp)'}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="validated"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 mt-2">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Validated</FormLabel>
                        <FormDescription>
                          If the transfer is validated, it will be processed
                          automatically
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isCreatingTransfer}>
                {isCreatingTransfer ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
