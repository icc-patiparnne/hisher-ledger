import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { useAction } from '@platform/remix';
import {
  Badge,
  Button,
  Chip,
  chipVariantFromType,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  Separator,
} from '@platform/ui';
import useAbility from '../../../hooks/useAbility';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { ACTIONS_ROUTES } from '../../../utils/actions';
import { ROUTES } from '../../../utils/routes';
import { NormalizedPolicyModel } from '../../../utils/sdk/reconciliation/models';
import { RECONCILIATION_ACTION_DELETE_POLICY } from '../constants';

export const deletePolicySchema = z.object({
  policyId: z.string().min(1),
});

export type DeletePolicyFormValues = z.infer<typeof deletePolicySchema>;

export default function DeletePolicyDialog({
  policy,
  policyId,
}: {
  policy: NormalizedPolicyModel;
  policyId: string;
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'delete-policy',
    requiredParams: ['policyId'],
  });
  const navigate = useNavigate();

  const { submit, isSubmitting } = useAction({
    formAction: RECONCILIATION_ACTION_DELETE_POLICY,
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      RECONCILIATION_ACTION_DELETE_POLICY
    ].to,
    onSuccess: () => {
      navigate(
        ROUTES({ organizationId, stackId, region })[
          'RECONCILIATION_POLICIES_LIST'
        ].to
      );
    },
  });

  const {
    stack: { canWrite },
  } = useAbility();

  const [open, setOpen] = useState(false);

  const {
    formState: { errors },
    ...form
  } = useForm<DeletePolicyFormValues>({
    defaultValues: {
      policyId,
    },
    resolver: zodResolver(deletePolicySchema),
  });

  const onDeletePolicySubmit = async () => {
    const values = form.getValues();
    submit({
      ...values,
      formAction: RECONCILIATION_ACTION_DELETE_POLICY,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon-md">
          <Trash />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl">
        <Form {...form}>
          <div className="space-y-4">
            <DialogHeader className="mb-4">
              <Badge className="mb-1" variant="destructive" size="sm">
                <Trash className="w-3.5 h-3.5" />
                Delete
              </Badge>
              <DialogTitle>
                Are you sure you want to delete this Policy?
              </DialogTitle>
              <DialogDescription>
                This will remove this policy and all its associated data.
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <DescriptionList>
              <DescriptionTerm>Policy ID</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  {...chipVariantFromType['id']}
                  label={policyId}
                  maxWidth="lg"
                  copyMode="click"
                />
              </DescriptionDetails>

              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  {...chipVariantFromType['name']}
                  label={policy.name}
                  maxWidth="lg"
                  copyMode="click"
                />
              </DescriptionDetails>
            </DescriptionList>

            <div className="my-2">
              {Object.keys(errors).length > 0 && (
                <div className="mt-2 text-red-500">
                  {Object.values(errors).map((error) => (
                    <div key={error.message}>{error.message}</div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                type="submit"
                disabled={!canWrite || isSubmitting}
                loading={isSubmitting}
                onClick={form.handleSubmit(onDeletePolicySubmit)}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
