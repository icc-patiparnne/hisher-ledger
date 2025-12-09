import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDown } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { GetWalletSummaryResponse } from '@platform/sdks/formance/src/models/components';
import {
  Button,
  Chip,
  chipVariantFromType,
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
} from '@platform/ui';

import { useAction } from '@platform/remix';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { WALLETS_ACTION_CREDIT_WALLET } from '../constants';

// Credit schema
export const creditWalletSchema = z.object({
  id: z.string(),
  asset: z.string(),
  amount: z.coerce.number().positive(),
  metadata: z.record(z.string()),
  description: z.string().optional(),
  reference: z.string().optional(),
  balance: z.string().optional(),
  timestamp: z.coerce.date().optional(),
  source: z
    .object({
      type: z.enum(['WALLET', 'ACCOUNT']).optional(),
      identifier: z.string().optional(),
    })
    .optional(),
});

export type CreditWalletFormValues = z.infer<typeof creditWalletSchema>;

type WalletActionsCreditWalletProps = {
  walletId: string;
  walletBalances: GetWalletSummaryResponse['data']['balances'];
};

export default function WalletActionsCreditWallet({
  walletId,
  walletBalances,
}: WalletActionsCreditWalletProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallet-actions-credit-wallet',
  });

  const { submit: creditWallet, isSubmitting: isCreditingWallet } =
    useAction<CreditWalletFormValues>({
      formAction: WALLETS_ACTION_CREDIT_WALLET,
      actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
        WALLETS_ACTION_CREDIT_WALLET
      ].to,
      onSuccess: () => {
        setIsOpen(false);
      },
    });

  const [isOpen, setIsOpen] = useState(false);

  // Default to the first balance if available
  const defaultBalance =
    walletBalances.length > 0 ? walletBalances[0]?.name : '';

  const form = useForm<CreditWalletFormValues>({
    defaultValues: {
      id: walletId,
      asset: 'COIN',
      amount: 10,
      metadata: {},
      reference: '',
      balance: defaultBalance,
      timestamp: new Date(),
      source: {
        type: 'ACCOUNT',
        identifier: 'world',
      },
    },
    resolver: zodResolver(creditWalletSchema),
  });

  const sourceType = form.watch('source.type');

  const onCreate = () => {
    const values = form.getValues();
    creditWallet(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <ArrowDown className="mr-2 h-4 w-4" />
          Credit wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onCreate)}>
            <DialogHeader className="mb-4">
              <DialogTitle className="flex flex-row items-center gap-2">
                Credit Wallet
                <Chip
                  {...chipVariantFromType['id']}
                  label={walletId}
                  maxWidth="xl"
                  copyMode="click"
                />
              </DialogTitle>
              <DialogDescription>Credit a wallet balance.</DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <ScrollArea className="h-[400px]">
              <div className="grid gap-4 p-1">
                {/* Balance selector */}
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Balance *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a balance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {walletBalances.map((balance) => (
                            <SelectItem key={balance.name} value={balance.name}>
                              {balance.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select which balance to credit to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="asset"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Asset *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ETH, USD, etc." />
                        </FormControl>
                        <FormDescription>
                          The asset code to credit
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            min={1}
                            value={Number(field.value)}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseFloat(e.target.value)
                                : 0;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>The amount to credit</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Optional reference ID" />
                      </FormControl>
                      <FormDescription>
                        An optional reference ID for the transaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="source.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source (optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a source type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="WALLET">
                              Another wallet
                            </SelectItem>
                            <SelectItem value="ACCOUNT">
                              Ledger account
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Optional source of the funds
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source.identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source identifier</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!sourceType} />
                        </FormControl>
                        <FormDescription>
                          The specific identifier of the source.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="timestamp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timestamp *</FormLabel>
                      <FormControl>
                        <DateWithHour
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                        />
                      </FormControl>
                      <FormDescription>
                        The timestamp for the credit.
                      </FormDescription>
                      <FormMessage />
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
              <Button
                type="submit"
                disabled={
                  isCreditingWallet ||
                  !form.getValues().asset ||
                  !form.getValues().amount ||
                  form.getValues().amount <= 0
                }
              >
                {isCreditingWallet ? 'Crediting...' : 'Credit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
