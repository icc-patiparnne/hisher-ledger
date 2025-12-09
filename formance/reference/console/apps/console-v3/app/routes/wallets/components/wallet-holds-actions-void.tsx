import { Ban } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from '@platform/remix';
import {
  Button,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@platform/ui';

import useAbility from '../../../hooks/useAbility';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { NormalizedWalletExpandedHoldModel } from '../../../utils/sdk/wallets/models';
import { WALLETS_ACTION_VOID_HOLD } from '../constants';

type TWalletHoldsVoidActionProps = {
  hold: NormalizedWalletExpandedHoldModel;
};

export const voidHoldSchema = z.object({
  holdId: z.string().min(1),
});

export type VoidHoldFormValues = z.infer<typeof voidHoldSchema>;

export default function WalletHoldsVoidAction({
  hold,
}: TWalletHoldsVoidActionProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallet-holds-actions-void',
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const hasRemaining = Number(hold.remaining) > 0;

  const [openVoidHold, setOpenVoidHold] = useState(false);
  const { submit: voidHold, isSubmitting: isVoidingHold } = useAction<{
    holdId: string;
  }>({
    formAction: WALLETS_ACTION_VOID_HOLD,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      WALLETS_ACTION_VOID_HOLD
    ].to,
    onSuccess: () => {
      setOpenVoidHold(false);
    },
  });

  const formVoidHold = useForm<VoidHoldFormValues>({
    defaultValues: {
      holdId: hold.id,
    },
    resolver: zodResolver(voidHoldSchema),
  });

  const onVoidHoldSubmit = async (values: VoidHoldFormValues) => {
    if (canWrite) {
      await voidHold(values);
    }
  };

  return (
    <Dialog
      open={openVoidHold}
      onOpenChange={(open) => {
        setOpenVoidHold(open);
        if (!open) {
          formVoidHold.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={!canWrite || !hasRemaining}
        >
          <Ban className="mr-2 h-4 w-4" />
          Cancel Hold
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...formVoidHold}>
          <form
            className="space-y-4"
            onSubmit={formVoidHold.handleSubmit(onVoidHoldSubmit)}
          >
            <DialogHeader className="mb-4">
              <DialogTitle>Cancel Hold</DialogTitle>
              <DialogDescription>
                The hold will be cancelled and the funds will be released. Are
                you sure you want to cancel this hold?
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={formVoidHold.control}
              name="holdId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hold ID</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
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
                variant="destructive"
                disabled={isVoidingHold}
              >
                {isVoidingHold ? 'Cancelling hold...' : 'Cancel Hold'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
