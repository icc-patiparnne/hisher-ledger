import { zodResolver } from '@hookform/resolvers/zod';
import { RefreshCcw } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import { useAction } from '@platform/remix';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { CONNECTIVITY_ACTION_RESET_CONNECTOR } from '../../../../routes/connectivity/constants';
import { ACTIONS_ROUTES } from '../../../../utils/actions';
import { NormalizedConnectorDataModel } from '../../../../utils/sdk/payments/models';
import { NormalizedUninstallConnectorRequest } from '../../../../utils/sdk/payments/requests';

export const resetConnectorSchema = z.object({
  connector: z.string(),
  connectorId: z.string(),
});

export type ResetConnectorFormValues = z.infer<typeof resetConnectorSchema>;

export default function ResetConnector({
  connector,
  connectorId,
  provider,
}: {
  connector: NormalizedConnectorDataModel;
  connectorId: NormalizedUninstallConnectorRequest['connectorID'];
  provider: NormalizedUninstallConnectorRequest['connector'];
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'reset-connector',
  });

  const { submit, isSubmitting } = useAction({
    actionUrl: ACTIONS_ROUTES({ organizationId, stackId, region })[
      CONNECTIVITY_ACTION_RESET_CONNECTOR
    ].to,
    formAction: CONNECTIVITY_ACTION_RESET_CONNECTOR,
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const [open, setOpen] = useState(false);

  const form = useForm<ResetConnectorFormValues>({
    defaultValues: {
      connectorId: connectorId,
      connector: provider,
    },
    resolver: zodResolver(resetConnectorSchema),
  });

  const onResetConnectorSubmit = async () => {
    const values = form.getValues();
    await submit(values);
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
        <Button variant="zinc" size="icon-md">
          <RefreshCcw />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-max">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onResetConnectorSubmit)}
          >
            <DialogHeader className="mb-4">
              <Badge className="mb-1" variant="slate" size="sm">
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset
              </Badge>
              <DialogTitle>
                Are you sure you want to reset this Connector?
              </DialogTitle>
              <DialogDescription>
                This will delete all the historical payments data for this
                connector and restart synchronization from scratch.
                <br />
                This action could take a few minutes to complete depending on
                the amount of payments data to delete.
              </DialogDescription>
            </DialogHeader>

            <Separator className="mb-4" />

            <DescriptionList>
              <DescriptionTerm>Connector ID</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  {...chipVariantFromType['id']}
                  label={connectorId}
                  maxWidth="xl"
                  copyMode="click"
                />
              </DescriptionDetails>

              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>
                <Chip
                  {...chipVariantFromType['name']}
                  label={connector.name}
                  copyMode="click"
                />
              </DescriptionDetails>

              {connector.apiKey && (
                <>
                  <DescriptionTerm>API Key</DescriptionTerm>
                  <DescriptionDetails>
                    <Chip
                      {...chipVariantFromConsoleType['apiKey']}
                      label={connector.apiKey}
                      maxWidth="xl"
                      copyMode="click"
                    />
                  </DescriptionDetails>
                </>
              )}
            </DescriptionList>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
