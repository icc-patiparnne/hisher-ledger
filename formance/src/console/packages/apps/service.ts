import { SDK as TFE_SDK } from '@platform/sdks/terraform-hcp-proxy/src';
import {
  Application$inboundSchema,
  AppResponse,
} from '@platform/sdks/terraform-hcp-proxy/src/models/components';
import {
  appListSchema,
  baseVerificationSchema,
  deleteAppSchema,
  deployAppSchema,
  readAppSchema,
  TAppCreateFormValues,
  TBaseVerificationValues,
  TDeleteAppRequestValues,
  TDeployAppRequestValues,
  TGetAppRequestValues,
  TGetAppResponseValues,
  TListAppsRequestValues,
  TUpdateAppRequestValues,
  updateAppSchema,
} from './types';
import { parseManifestYaml, validateManifestSecrets } from './utils';

export class AppService {
  private sdk: TFE_SDK;

  constructor(sdk: TFE_SDK) {
    this.sdk = sdk;
  }

  async create(request: TAppCreateFormValues) {
    try {
      const { files, organizationId, secrets, manifest } = await this._verify(
        request
      );

      const createdApp = await this.sdk.createApp({
        organizationId,
      });
      const createdAppId = (createdApp as AppResponse)?.data?.id;

      if (!createdAppId) {
        throw new Error('Failed to create app: No app ID returned from server');
      }

      const deployedApp = await this.deployAndRun({
        id: createdAppId,
        files,
        organizationId,
      });

      return {
        id: createdAppId,
        createdApp,
        deployedApp,
        secrets,
        manifest,
      };
    } catch (error: any) {
      // Re-throw with more context if it's not already a user-friendly message
      if (error?.message?.includes('Missing secrets for')) {
        throw error; // Secrets validation error - already user-friendly
      }
      if (error?.message?.includes('Failed to parse')) {
        throw error; // YAML parsing error - already user-friendly
      }
      if (error?.message?.includes('not found in the provided files')) {
        throw error; // File missing error - already user-friendly
      }

      throw new Error(
        `Failed to create app: ${error?.message || 'Unknown error'}`
      );
    }
  }

  async deployAndRun(request: TDeployAppRequestValues) {
    try {
      const { id } = deployAppSchema.parse(request);

      // Use shared verification method for all validation
      const { manifestJson, secrets } = await this._verify(request);

      const deployedApp = await this.sdk.deployAppConfigurationJson({
        id,
        application: manifestJson,
      });

      return {
        deployedApp,
        secrets,
      };
    } catch (error: any) {
      // Re-throw user-friendly validation errors as-is
      if (
        error?.message?.includes('Missing secrets for') ||
        error?.message?.includes('Failed to parse') ||
        error?.message?.includes('Invalid manifest schema') ||
        error?.message?.includes('Invalid request data') ||
        error?.message?.includes('not found in the provided files')
      ) {
        throw error;
      }

      // Handle SDK/API errors
      throw new Error(
        `Failed to deploy app: ${error?.message || 'Unknown deployment error'}`
      );
    }
  }

  async get(request: TGetAppRequestValues): Promise<TGetAppResponseValues> {
    const values = readAppSchema.parse(request);

    const app = await this.sdk.readApp(values);
    // const appManifest = await this.sdk.readAppManifest(values)
    const appManifest = {
      info: {
        name: 'my-connectivity-stack',
        version: 'v3.0',
      },
      payments: [
        {
          connectors: [
            {
              configuration: {
                api_key: '${MONEYCORP_API_KEY}',
              },
              name: 'loans-debits-main',
              provider: 'moneycorp',
            },
          ],
        },
      ],
    };

    console.log('app', app);
    console.log('appManifest', appManifest);

    return {
      app: app as AppResponse,
      appManifest: appManifest as any,
    };
  }

  async update(request: TUpdateAppRequestValues) {
    const values = updateAppSchema.parse(request);

    const app = await this.sdk.updateApp(values);

    return app;
  }

  async delete(request: TDeleteAppRequestValues) {
    const values = deleteAppSchema.parse(request);

    const app = await this.sdk.deleteApp(values);

    return app;
  }

  async list(request: TListAppsRequestValues) {
    const values = appListSchema.parse(request);

    const apps = await this.sdk.listApps({
      organizationId: values.organizationId,
    });

    return apps;
  }

  private async _verify(request: TBaseVerificationValues) {
    try {
      // Validate request structure
      const parseResult = baseVerificationSchema.safeParse(request);
      if (!parseResult.success) {
        const errorMessages = parseResult.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Invalid request data: ${errorMessages}`);
      }

      const { files, organizationId } = parseResult.data;

      const manifestJson = await parseManifestYaml(files);

      // Validate schema structure
      const schemaValidation =
        Application$inboundSchema.safeParse(manifestJson);
      if (!schemaValidation.success) {
        const errorMessages = schemaValidation.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Invalid manifest schema: ${errorMessages}`);
      }

      const manifest = schemaValidation.data;

      // Validate secrets
      const secretsValidation = await validateManifestSecrets(files);

      return {
        manifest,
        manifestJson,
        secrets: secretsValidation,
        organizationId,
        files,
      };
    } catch (error: any) {
      console.error('Verification failed:', error);

      // Re-throw user-friendly errors as-is
      if (
        error?.message?.includes('Missing secrets for') ||
        error?.message?.includes('Failed to parse') ||
        error?.message?.includes('Invalid manifest schema') ||
        error?.message?.includes('Invalid request data') ||
        error?.message?.includes('not found in the provided files')
      ) {
        throw error;
      }

      // Handle unknown errors
      throw new Error(
        `App verification failed: ${
          error?.message || 'Unknown validation error'
        }`
      );
    }
  }
}
