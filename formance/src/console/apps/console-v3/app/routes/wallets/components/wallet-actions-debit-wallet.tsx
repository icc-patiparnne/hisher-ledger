import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
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
  Switch,
} from '@platform/ui';
import { isValidAccountName, isValidUUID } from '@platform/utils';

import { useAction } from '@platform/remix';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { WALLETS_ACTION_DEBIT_WALLET } from '../constants';

// Ensure validation logic triggers and captures errors
const validateDestination = (
  data: { type?: string; identifier?: string } | undefined
) => {
  if (!data) return true; // If data is undefined, consider it valid

  const { type, identifier } = data;
  if (
    (type === 'WALLET' || type === 'ACCOUNT') &&
    (!identifier || identifier.trim() === '')
  ) {
    return false;
  }
  if (type === 'WALLET' && identifier && !isValidUUID(identifier)) {
    return false;
  }
  if (type === 'ACCOUNT' && identifier && !isValidAccountName(identifier)) {
    return false;
  }

  return true;
};

// Base debit schema
// timestamp cannot be used in conjunction with pending property
export const debitWalletSchema = z
  .object({
    id: z.string(),
    asset: z.string(),
    amount: z.coerce.number().positive(),
    pending: z.boolean(),
    metadata: z.record(z.string()),
    description: z.string().optional(),
    destination: z
      .object({
        type: z.enum(['CURRENT_WALLET', 'WALLET', 'ACCOUNT']).optional(),
        identifier: z.string().optional(),
      })
      .optional()
      .refine((data) => validateDestination(data), {
        message: `Invalid identifier format`,
        path: ['identifier'],
      }),
    selectedBalance: z.string().optional(),
    timestamp: z.coerce.date().optional(),
  })
  .refine(
    (data) =>
      // If pending is true, timestamp must be undefined
      !data.pending || !data.timestamp,
    {
      message: 'timestamp cannot be used when pending is true',
      path: ['timestamp'],
    }
  );

export type DebitWalletFormValues = z.infer<typeof debitWalletSchema>;

type WalletActionsDebitWalletProps = {
  walletId: string;
  walletBalances: GetWalletSummaryResponse['data']['balances'];
  isCreatingHold: boolean;
};

export default function WalletActionsDebitWallet({
  walletId,
  walletBalances,
  isCreatingHold = false,
}: WalletActionsDebitWalletProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallet-actions-debit-wallet',
  });

  const { submit: debitWallet, isSubmitting: isDebitingWallet } =
    useAction<DebitWalletFormValues>({
      formAction: WALLETS_ACTION_DEBIT_WALLET,
      actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
        WALLETS_ACTION_DEBIT_WALLET
      ].to,
      onSuccess: () => {
        setIsOpen(false);
      },
    });

  const [isOpen, setIsOpen] = useState(false);

  // Get available assets from the selected balance
  const getAvailableAssets = (balanceName: string | undefined) => {
    if (!balanceName) return [];

    const selectedBalance = walletBalances.find((b) => b.name === balanceName);

    if (!selectedBalance) return [];

    return Object.keys(selectedBalance.assets || {});
  };

  // Get the available amount for a specific asset in a balance
  const getAvailableAmount = (
    balanceName: string | undefined,
    asset: string
  ) => {
    if (!balanceName || !asset) return 0;

    const selectedBalance = walletBalances.find((b) => b.name === balanceName);
    if (!selectedBalance || !selectedBalance.assets) return 0;

    const amount = selectedBalance.assets[asset];

    return amount ? parseFloat(amount.toString()) : 0;
  };

  // Default to the first balance with assets if available
  const defaultBalance = useMemo(() => {
    const balanceWithAssets = walletBalances.find(
      (b) => b.assets && Object.keys(b.assets).length > 0
    );

    return balanceWithAssets?.name || '';
  }, [walletBalances]);

  // Get default asset from the default balance
  const defaultAsset = useMemo(() => {
    const assets = getAvailableAssets(defaultBalance);

    return assets.length > 0 ? assets[0] : '';
  }, [defaultBalance]);

  const form = useForm<DebitWalletFormValues>({
    defaultValues: {
      id: walletId,
      asset: defaultAsset,
      amount: 1,
      pending: isCreatingHold,
      metadata: {},
      description: 'New description',
      destination: {
        type: 'CURRENT_WALLET',
        identifier: '',
      },
      selectedBalance: defaultBalance,
      timestamp: new Date(),
    },
    resolver: zodResolver(debitWalletSchema),
  });

  const isPending = form.watch('pending');
  const selectedBalance = form.watch('selectedBalance');
  const selectedAsset = form.watch('asset');
  const currentAmount = form.watch('amount');
  const destinationType = form.watch('destination.type');

  // Get available assets based on the selected balance
  const availableAssets = useMemo(
    () => getAvailableAssets(selectedBalance),
    [selectedBalance]
  );

  // Get the current available amount for the selected asset
  const availableAmount = useMemo(
    () => getAvailableAmount(selectedBalance, selectedAsset),
    [selectedBalance, selectedAsset]
  );

  // Check if amount exceeds available balance
  const amountExceedsBalance = currentAmount > availableAmount;

  // Update asset when balance changes
  useEffect(() => {
    if (availableAssets.length > 0) {
      // If current asset is not in the available assets, select the first one
      const currentAsset = form.getValues('asset');
      if (!availableAssets.includes(currentAsset)) {
        form.setValue('asset', availableAssets[0] || '');
      }
    } else {
      // Clear asset if there are no available assets
      form.setValue('asset', '');
    }
  }, [availableAssets, form]);

  // Clear timestamp when pending is true
  useEffect(() => {
    if (isPending) {
      form.setValue('timestamp', undefined);
    } else if (!form.getValues('timestamp')) {
      // Set default date when switching to non-pending
      form.setValue('timestamp', new Date());
    }
  }, [isPending, form]);

  const onCreate = () => {
    // Validate that amount doesn't exceed available balance
    if (amountExceedsBalance) {
      form.setError('amount', {
        type: 'manual',
        message: `Amount cannot exceed available balance of ${availableAmount}`,
      });

      return;
    }

    const values = form.getValues();
    debitWallet(values);
  };

  // Check if there are any balances with assets
  const hasAssetsInAnyBalance = walletBalances.some(
    (b) => b.assets && Object.keys(b.assets).length > 0
  );

  const submitButtonLabel =
    isPending && isDebitingWallet
      ? 'Creating hold..'
      : isPending && !isDebitingWallet
      ? 'Create hold'
      : isPending
      ? 'Creating debit..'
      : 'Create debit';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="primary" disabled={!hasAssetsInAnyBalance}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Debit wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onCreate)}>
            <DialogHeader className="mb-4">
              <DialogTitle className="flex flex-row items-center gap-2">
                Debit Wallet
              </DialogTitle>
              <DialogDescription>Debit a wallet balance.</DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <ScrollArea className="h-[400px]">
              <div className="grid gap-4 p-1">
                <div className="space-y-2">
                  <FormLabel>From wallet with ID</FormLabel>
                  <Chip
                    {...chipVariantFromType['id']}
                    label={walletId}
                    maxWidth="xl"
                    copyMode="click"
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="destination.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a destination type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CURRENT_WALLET">
                              Current wallet
                            </SelectItem>
                            <SelectItem value="WALLET">
                              Another wallet
                            </SelectItem>
                            <SelectItem value="ACCOUNT">
                              Ledger account
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          If you want to debit to another wallet or a ledger
                          account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination.identifier"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>With identifier</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={destinationType === 'CURRENT_WALLET'}
                          />
                        </FormControl>
                        <FormDescription>
                          The specific identifier of the destination (optional).
                        </FormDescription>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="selectedBalance"
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
                          {walletBalances.map((balance) => {
                            const hasAssets =
                              balance.assets &&
                              Object.keys(balance.assets).length > 0;

                            return (
                              <SelectItem
                                key={balance.name}
                                value={balance.name}
                                disabled={!hasAssets}
                              >
                                {balance.name}{' '}
                                {!hasAssets && '(No assets available)'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select which balance to debit from
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={availableAssets.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an asset" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableAssets.map((asset) => (
                              <SelectItem key={asset} value={asset}>
                                {asset}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The asset code to debit
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
                            max={availableAmount}
                            value={Number(field.value)}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseFloat(e.target.value)
                                : 0;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          The amount to debit (available: {availableAmount})
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                        The description of the debit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
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
                />

                {!isPending && (
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
                          The timestamp for the debit. Only available when not
                          creating a pending hold.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                  isDebitingWallet ||
                  availableAssets.length === 0 ||
                  amountExceedsBalance ||
                  !currentAmount ||
                  currentAmount <= 0
                }
              >
                {submitButtonLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
