import { readDirectory } from '@platform/utils/directory';
import { TFileSystemItem } from '@platform/utils/directoryUtils';
import {
  APPS,
  EXCLUDED_FILES,
  TAppLoaderData,
  TAppManifestInfo,
} from './constants';
import {
  detectSecretsFromFile,
  extractDescriptionFromReadme,
  extractTitleFromReadme,
  parseConnectorsFromManifest,
  parseModulesFromManifest,
} from './utils';

export async function loadAppData(appSlug?: string): Promise<TAppLoaderData> {
  if (!appSlug) {
    return {
      appFiles: [],
      appInfo: undefined,
      appManifestInfo: undefined,
      appReadmeContent: undefined,
      detectedSecrets: [],
      initialSecretValues: {},
    };
  }

  try {
    const relativePath = `packages/apps/library/${appSlug}`;
    const allFiles = await readDirectory(relativePath);
    const appInfo = Object.values(APPS).find((app) => app.slug === appSlug);

    // Single pass to extract all needed content from all files
    let manifestContent: string | undefined;
    let readmeContent: string | undefined;

    const extractContent = (files: TFileSystemItem[]) => {
      for (const file of files) {
        if (file.type === 'file' && file.content) {
          if (file.name === 'manifest.yaml' || file.name === 'manifest.yml') {
            manifestContent = file.content;
          } else if (file.name.toLowerCase() === 'readme.md') {
            readmeContent = file.content;
          }
        }
        if (file.children) {
          extractContent(file.children);
        }
      }
    };

    extractContent(allFiles);

    // Extract manifest info and detect secrets if manifest file exists
    let appManifestInfo: TAppManifestInfo | undefined;
    let detectedSecrets: string[] = [];
    let initialSecretValues: Record<string, string> = {};

    if (manifestContent) {
      const title = extractTitleFromReadme(readmeContent || '');
      const description = extractDescriptionFromReadme(readmeContent || '');

      appManifestInfo = {
        title,
        description,
        connectors: parseConnectorsFromManifest(manifestContent),
        modules: parseModulesFromManifest(manifestContent),
      };

      // Detect secrets from manifest content and initialize empty values
      detectedSecrets = detectSecretsFromFile(manifestContent);
      initialSecretValues = detectedSecrets.reduce((acc, secret) => {
        acc[secret] = '';
        return acc;
      }, {} as Record<string, string>);
    }

    // Filter out excluded files and mark protected files in a single pass
    const processFiles = (files: TFileSystemItem[]): TFileSystemItem[] =>
      files
        .filter((file) => {
          if (file.type === 'file') {
            return !EXCLUDED_FILES.includes(
              file.name as (typeof EXCLUDED_FILES)[number]
            );
          }

          return true;
        })
        .map((file) => {
          // Mark manifest files as protected (cannot be deleted or renamed)
          if (
            file.type === 'file' &&
            (file.name === 'manifest.yaml' || file.name === 'manifest.yml')
          ) {
            return {
              ...file,
              canDelete: false,
              canRename: false,
            };
          }

          if (file.type === 'folder' && file.children) {
            return {
              ...file,
              children: processFiles(file.children),
            };
          }

          return file;
        });

    const appFiles = processFiles(allFiles);

    return {
      appFiles,
      appInfo,
      appManifestInfo,
      appReadmeContent: readmeContent,
      detectedSecrets,
      initialSecretValues,
    };
  } catch (error) {
    // LINT_EXCEPTION_REASON: Error logging for debugging app data loading
    // eslint-disable-next-line no-console
    console.error(`Error loading app data for ${appSlug}:`, error);

    return {
      appFiles: [],
      appInfo: undefined,
      appManifestInfo: undefined,
      appReadmeContent: undefined,
      detectedSecrets: [],
      initialSecretValues: {},
    };
  }
}
