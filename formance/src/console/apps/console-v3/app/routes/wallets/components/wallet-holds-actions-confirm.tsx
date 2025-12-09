import { Check } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from '@platform/remix';
import {
  Button,
  Chip,
  ChipAccount,
  chipVariantFromType,
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
  Switch,
} from '@platform/ui';

import { chipVariantFromConsoleType } from '../../../components/chip';
import useAbility from '../../../hooks/useAbility';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { NormalizedWalletExpandedHoldModel } from '../../../utils/sdk/wallets/models';
import { WALLETS_ACTION_CONFIRM_HOLD } from '../constants';

type TWalletHoldsConfirmActionProps = {
  hold: NormalizedWalletExpandedHoldModel;
};

export const confirmHoldSchema = z.object({
  holdId: z.string().min(1),
  amount: z.coerce.number().min(1).optional(),
  final: z.boolean().default(false),
});

export type ConfirmHoldFormValues = z.infer<typeof confirmHoldSchema>;

export default function WalletHoldsConfirmAction({
  hold,
}: TWalletHoldsConfirmActionProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallet-holds-actions-confirm',
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const hasRemaining = Number(hold.remaining) > 0;
  const isWalletDestination = hold.destination?.type === 'WALLET';

  const [openConfirmHold, setOpenConfirmHold] = useState(false);
  const { submit: confirmHold, isSubmitting: isConfirmingHold } = useAction<{
    holdId: string;
    amount?: number;
    final: boolean;
  }>({
    formAction: WALLETS_ACTION_CONFIRM_HOLD,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      WALLETS_ACTION_CONFIRM_HOLD
    ].to,
    onSuccess: () => {
      setOpenConfirmHold(false);
    },
  });

  const formConfirmHold = useForm<ConfirmHoldFormValues>({
    defaultValues: {
      holdId: hold.id,
      final: false,
    },
    resolver: zodResolver(confirmHoldSchema),
  });

  const onConfirmHoldSubmit = async (values: ConfirmHoldFormValues) => {
    if (canWrite) {
      await confirmHold(values);
    }
  };

  return (
    <Dialog open={openConfirmHold} onOpenChange={setOpenConfirmHold}>
      <DialogTrigger asChild>
        <Button variant="valid" disabled={!canWrite || !hasRemaining} size="sm">
          <Check className="mr-2 h-4 w-4" />
          Confirm Hold
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...formConfirmHold}>
          <form
            className="space-y-4"
            onSubmit={formConfirmHold.handleSubmit(onConfirmHoldSubmit)}
          >
            <DialogHeader className="mb-4">
              <DialogTitle className="flex flex-row items-center gap-2">
                Confirm Hold
              </DialogTitle>
              <DialogDescription>
                Confirm this hold by specifying the amount to confirm.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2">
              <div className="space-y-2">
                <FormLabel>Hold ID</FormLabel>
                <Chip
                  {...chipVariantFromType['id']}
                  label={hold.id}
                  maxWidth="xl"
                  copyMode="click"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {hold.destination && (
                <div className="flex-1 space-y-2">
                  <FormLabel>Destination Type</FormLabel>
                  <Chip
                    {...chipVariantFromConsoleType[
                      isWalletDestination ? 'wallet' : 'ledger'
                    ]}
                    label={`${
                      isWalletDestination ? 'Wallet' : 'Ledger Account'
                    }`}
                  />
                </div>
              )}

              {hold.destination && (
                <div className="flex-1 space-y-2">
                  <FormLabel>Destination Identifier</FormLabel>
                  <ChipAccount
                    address={hold.destination?.identifier}
                    maxWidth="xl"
                    copyMode="click"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={formConfirmHold.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            className="flex-1"
                            type="number"
                            placeholder="Amount to confirm"
                            max={Number(hold.remaining)}
                            size="sm"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />

                          <div>
                            <Chip
                              {...chipVariantFromType['asset']}
                              label={hold.asset}
                              maxWidth="xl"
                              copyMode="click"
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        The amount available to confirm is{' '}
                        {String(hold.remaining)}. Leave empty to confirm full
                        amount.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={formConfirmHold.control}
              name="final"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Return remaining funds
                    </FormLabel>
                    <FormDescription>
                      If enabled, remaining funds will be returned to origin
                      balance
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

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="primary"
                disabled={isConfirmingHold}
              >
                {isConfirmingHold ? 'Confirming...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
