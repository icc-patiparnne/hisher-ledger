import {
  Button,
  DateWithHour,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@platform/ui';
import { ArrowUpRight, Copy, MoreHorizontal } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useAbility from '../../../hooks/useAbility';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { copyToClipboardToast } from '../../../utils/common';
import { ROUTES } from '../../../utils/routes';
import { NormalizedPolicyModel } from '../../../utils/sdk/reconciliation/models';

type TReconciliationPolicyActionProps = {
  policy: NormalizedPolicyModel;
  submit: (values: any) => void;
  isSubmitting: boolean;
};

export const runReconciliationSchema = z.object({
  policyID: z.string().min(1),
  reconciledAtLedger: z.date(),
  reconciledAtPayments: z.date(),
});

export type RunReconciliationFormValues = z.infer<
  typeof runReconciliationSchema
>;

export default function ReconciliationPolicyActions({
  policy,
  submit,
  isSubmitting,
}: TReconciliationPolicyActionProps) {
  const navigate = useNavigate();

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reconciliation-policy-actions',
  });

  const {
    stack: { canWrite },
  } = useAbility();
  const [open, setOpen] = React.useState(false);

  const runReconciliation = async () => {
    if (canWrite) {
      const values = form.getValues();
      submit(values);
    }
  };

  const form = useForm<RunReconciliationFormValues>({
    defaultValues: {
      policyID: policy.id,
      reconciledAtLedger: new Date(),
      reconciledAtPayments: new Date(),
    },
    resolver: zodResolver(runReconciliationSchema),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-md">
          <span className="sr-only">Open policy actions</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Copy className="mr-2 h-4 w-4" />
            <span className="mr-2 inline-block">Copy to Clipboard</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  copyToClipboardToast(
                    policy.id,
                    'Policy ID copied to clipboard'
                  );
                }}
              >
                Policy ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  copyToClipboardToast(
                    policy.ledgerName,
                    'Ledger name copied to clipboard'
                  );
                }}
              >
                Ledger Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  copyToClipboardToast(
                    policy.paymentsPoolID,
                    'Payment Pool ID copied to clipboard'
                  );
                }}
              >
                Payment Pool ID
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            <span className="mr-2 inline-block">Go to</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      ledgerName: policy.ledgerName,
                    })['LEDGER_DETAIL'].to
                  );
                }}
              >
                Ledger
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      paymentCashPoolId: policy.paymentsPoolID,
                    })['CONNECTIVITY_CASH_POOL_DETAIL'].to
                  );
                }}
              >
                Payment Cash Pool
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Dialog
                open={open}
                onOpenChange={() => {
                  setOpen(!open);
                  form.reset();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className=""
                    variant="primary"
                    disabled={!canWrite}
                    size="sm"
                  >
                    Run Reconciliation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit(runReconciliation)}
                    >
                      <DialogHeader className="mb-4">
                        <DialogTitle>Run Reconciliation</DialogTitle>
                      </DialogHeader>

                      <FormField
                        control={form.control}
                        name="policyID"
                        disabled={!canWrite}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Policy ID</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reconciledAtLedger"
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
                              The date and time of the ledger the reconciliation
                              should take.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reconciledAtPayments"
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
                              The date and time of the payment the
                              reconciliation should take.
                            </FormDescription>
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
                          variant="primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal></DropdownMenuPortal>
          </DropdownMenuSub>
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
