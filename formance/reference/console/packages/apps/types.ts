import { z } from 'zod';
import {
  ReadAppManifestResponse,
  ReadAppResponse,
} from '@platform/sdks/terraform-hcp-proxy/src/models/operations';

export const organizationIdSchema = z.object({
  organizationId: z.string().min(1),
});

const fileSchema = z.object({
  name: z.string(),
  content: z.string(),
  type: z.enum(['file', 'directory']),
});

// Base schema for verification (shared between create and deploy)
export const baseVerificationSchema = z
  .object({
    files: z.array(fileSchema),
  })
  .merge(organizationIdSchema);

export type TBaseVerificationValues = z.infer<typeof baseVerificationSchema>;

export const appCreateSchema = baseVerificationSchema;

export type TAppCreateFormValues = z.infer<typeof appCreateSchema>;

export const appListSchema = organizationIdSchema;

export type TListAppsRequestValues = z.infer<typeof appListSchema>;

export const readAppSchema = z.object({
  id: z.string(),
});

export type TReadAppRequestValues = z.infer<typeof readAppSchema>;

export const deployAppSchema = z
  .object({
    id: z.string(),
    organizationId: z.string(),
    files: z.array(fileSchema),
  })
  .merge(organizationIdSchema);

export type TDeployAppRequestValues = z.infer<typeof deployAppSchema>;

export const updateAppSchema = z
  .object({
    id: z.string(),
    updateAppRequest: z.object({}),
  })
  .merge(organizationIdSchema);

export type TUpdateAppRequestValues = z.infer<typeof updateAppSchema>;

export const getAppSchema = z
  .object({
    id: z.string(),
  })
  .merge(organizationIdSchema);

export type TGetAppResponseValues = {
  app: ReadAppResponse;
  appManifest: ReadAppManifestResponse;
};

export type TGetAppRequestValues = z.infer<typeof getAppSchema>;

export const deleteAppSchema = z
  .object({
    id: z.string(),
  })
  .merge(organizationIdSchema);

export type TDeleteAppRequestValues = z.infer<typeof deleteAppSchema>;
