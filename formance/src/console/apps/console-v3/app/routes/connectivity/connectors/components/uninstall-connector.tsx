import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
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
import { useSubmit } from 'react-router';
import { chipVariantFromConsoleType } from '../../../../components/chip';
import useAbility from '../../../../hooks/useAbility';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { NormalizedConnectorDataModel } from '../../../../utils/sdk/payments/models';
import { NormalizedUninstallConnectorRequest } from '../../../../utils/sdk/payments/requests';
import { CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR } from '../../constants';
import { ACTIONS_ROUTES } from '../../../../utils/actions';

export const uninstallConnectorSchema = z.object({
  connector: z.string(),
  connectorId: z.string(),
});

export type UninstallConnectorFormValues = z.infer<
  typeof uninstallConnectorSchema
>;

export default function UninstallConnectorDialog({
  connector,
  connectorId,
  provider,
}: {
  connector: NormalizedConnectorDataModel;
  connectorId: NormalizedUninstallConnectorRequest['connectorID'];
  provider: NormalizedUninstallConnectorRequest['connector'];
}) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'uninstall-connector',
  });
  const submit = useSubmit();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    stack: { canWrite },
  } = useAbility();

  const [open, setOpen] = useState(false);

  const {
    formState: { errors },
    ...form
  } = useForm<UninstallConnectorFormValues>({
    defaultValues: {
      connectorId: connectorId,
      connector: provider,
    },
    resolver: zodResolver(uninstallConnectorSchema),
  });

  const onDeleteConnectorSubmit = async () => {
    setIsSubmitting(true);
    const values = form.getValues();
    const formData = new FormData();
    formData.append('connector', values.connector);
    formData.append('connectorId', values.connectorId);
    formData.append('formAction', CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR);
    submit(formData, {
      method: 'post',
      action: ACTIONS_ROUTES({ organizationId, stackId, region })[
        CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR
      ].to,
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
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onDeleteConnectorSubmit)}
          >
            <DialogHeader className="mb-4">
              <Badge className="mb-1" variant="destructive" size="sm">
                <Trash className="w-3.5 h-3.5" />
                Uninstall
              </Badge>
              <DialogTitle>
                Are you sure you want to delete this Connector?
              </DialogTitle>
              <DialogDescription>
                This will remove this connector instance and all its associated
                payments data.
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
                  maxWidth="lg"
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
                      maxWidth="lg"
                      label={connector.apiKey}
                      copyMode="click"
                    />
                  </DescriptionDetails>
                </>
              )}
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
              >
                {isSubmitting ? 'Uninstalling...' : 'Uninstall'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
