import { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { escape } from '@platform/utils';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const stackId = escape(form.get('stackId'));
  const organizationId = escape(form.get('organizationId'));

  return redirect(
    `${process.env.PORTAL_UI!}/${organizationId}/stacks/${stackId}`
  );
}
