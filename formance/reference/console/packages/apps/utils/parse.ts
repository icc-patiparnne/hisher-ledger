import yaml from 'js-yaml';

export interface FileItem {
  name: string;
  content: string;
  type: 'file' | 'directory';
}

/**
 * Finds and parses a YAML manifest file from an array of files
 * @param files Array of file objects
 * @param fileName Optional specific filename to look for (defaults to 'manifest.yaml' or 'manifest.yml')
 * @returns Promise that resolves to parsed JSON object from the YAML content
 * @throws Error if manifest file is not found or cannot be parsed
 */
export async function parseManifestYaml(
  files: FileItem[],
  fileName?: string
): Promise<any> {
  // Find the manifest file
  const manifestFile = files.find((file) => {
    if (fileName) {
      return file.name === fileName;
    }
    return file.name === 'manifest.yaml' || file.name === 'manifest.yml';
  });

  if (!manifestFile) {
    const expectedName = fileName || 'manifest.yaml/manifest.yml';
    throw new Error(`${expectedName} file not found in the provided files`);
  }

  try {
    // Parse YAML content to JSON
    const manifestJson = yaml.load(manifestFile.content);
    return manifestJson;
  } catch (error: any) {
    throw new Error(
      `Failed to parse ${manifestFile.name}: ${
        error?.message || 'Unknown error'
      }`
    );
  }
}

/**
 * Validates that all variables defined in the manifest YAML have corresponding secrets in the .secrets file
 * @param files Array of file objects that should include both manifest.yaml and .secrets files
 * @returns Object containing validation results and details
 * @throws Error if validation fails or required files are missing
 */
export async function validateManifestSecrets(files: FileItem[]): Promise<{
  isValid: boolean;
  missingSecrets: string[];
  foundSecrets: string[];
  manifestVariables: string[];
}> {
  // Find the manifest file
  const manifestFile = files.find(
    (file) => file.name === 'manifest.yaml' || file.name === 'manifest.yml'
  );

  if (!manifestFile) {
    throw new Error('manifest.yaml file not found in the provided files');
  }

  // Find the secrets file
  const secretsFile = files.find((file) => file.name === '.secrets');

  if (!secretsFile) {
    throw new Error('.secrets file not found in the provided files');
  }

  // Extract variables from manifest using ${VARIABLE} pattern
  const manifestVariables = extractVariablesFromManifest(manifestFile.content);

  // Parse secrets from .secrets file
  const availableSecrets = parseSecretsFile(secretsFile.content);

  // Validate that each manifest variable has a corresponding secret
  const missingSecrets = manifestVariables.filter(
    (variable) => !availableSecrets.includes(variable)
  );

  const foundSecrets = manifestVariables.filter((variable) =>
    availableSecrets.includes(variable)
  );

  const isValid = missingSecrets.length === 0;

  if (!isValid) {
    throw new Error(
      `Missing secrets for the following variables: ${missingSecrets.join(
        ', '
      )}. ` + `Please add these secrets to your .secrets file.`
    );
  }

  return {
    isValid,
    missingSecrets,
    foundSecrets,
    manifestVariables,
  };
}

/**
 * Extract variables in ${VARIABLE} format from manifest content
 * @param manifestContent The YAML manifest content as string
 * @returns Array of unique variable names
 */
function extractVariablesFromManifest(manifestContent: string): string[] {
  const variableRegex = /\$\{([^}]+)\}/g;
  const variables = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = variableRegex.exec(manifestContent)) !== null) {
    if (match[1]) {
      variables.add(match[1]);
    }
  }

  return Array.from(variables).sort();
}

/**
 * Parse secrets from .secrets file content in KEY=VALUE format
 * @param secretsContent The .secrets file content as string
 * @returns Array of secret keys (variable names)
 */
function parseSecretsFile(secretsContent: string): string[] {
  const secrets = new Set<string>();
  const lines = secretsContent.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Parse KEY=VALUE format
    const equalIndex = trimmedLine.indexOf('=');
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex).trim();
      if (key) {
        secrets.add(key);
      }
    }
  }

  return Array.from(secrets).sort();
}

import { CONNECTORS_NAMES, TConnectorName } from '@platform/utils/connectors';
import { getModuleNameFromGateway, TModuleName } from '@platform/utils/modules';

/**
 * Parse modules from manifest content
 * Extracts module information from manifest content
 * Supports two formats:
 * 1. stack.modules with boolean values (e.g., "ledger: true")
 * 2. Top-level section detection (e.g., "ledgers:", "payments:")
 */
export function parseModulesFromManifest(
  manifestContent: string
): TModuleName[] {
  const modules: TModuleName[] = [];

  // First, try to find stack.modules section with boolean values
  const stackModulesMatch = manifestContent.match(
    /stack:\s*[\s\S]*?modules:\s*([\s\S]*?)(?=\n\w|\n\n|$)/
  );

  if (stackModulesMatch && stackModulesMatch[1]) {
    const moduleLines = stackModulesMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.includes(':'));

    for (const line of moduleLines) {
      const match = line.match(/^(\w+):\s*(true|false)/);
      if (match && match[1] && match[2] === 'true') {
        const moduleName = getModuleNameFromGateway(match[1]);
        if (moduleName && !modules.includes(moduleName)) {
          modules.push(moduleName);
        }
      }
    }
  }

  // Second, detect modules from top-level sections
  // ledgers -> LEDGER, payments -> CONNECTIVITY, reconciliation -> RECONCILIATION
  if (/^ledgers:/m.test(manifestContent)) {
    const ledgerModule = getModuleNameFromGateway('ledger');
    if (ledgerModule && !modules.includes(ledgerModule)) {
      modules.push(ledgerModule);
    }
  }

  if (/^payments:/m.test(manifestContent)) {
    const paymentsModule = getModuleNameFromGateway('payments');
    if (paymentsModule && !modules.includes(paymentsModule)) {
      modules.push(paymentsModule);
    }
  }

  if (/^reconciliation:/m.test(manifestContent)) {
    const reconciliationModule = getModuleNameFromGateway('reconciliation');
    if (reconciliationModule && !modules.includes(reconciliationModule)) {
      modules.push(reconciliationModule);
    }
  }

  if (
    /^workflows:/m.test(manifestContent) ||
    /^worklflows:/m.test(manifestContent)
  ) {
    const orchestrationModule = getModuleNameFromGateway('orchestration');
    if (orchestrationModule && !modules.includes(orchestrationModule)) {
      modules.push(orchestrationModule);
    }
  }

  if (/^webhooks:/m.test(manifestContent)) {
    const webhooksModule = getModuleNameFromGateway('webhooks');
    if (webhooksModule && !modules.includes(webhooksModule)) {
      modules.push(webhooksModule);
    }
  }

  return modules;
}

/**
 * Parse connectors from manifest content
 * Extracts connector information from YAML-like manifest
 * Looks for "provider:" fields under "connectors:" sections
 * Supports both payments.connectors and network.connectors
 */
export function parseConnectorsFromManifest(content: string): TConnectorName[] {
  const connectors: TConnectorName[] = [];

  // Find all provider fields that appear after a connectors: section
  // This regex looks for "provider:" followed by the connector name
  const providerMatches = content.matchAll(/provider:\s*(\w+)/gi);

  for (const match of providerMatches) {
    if (match[1]) {
      const providerName = match[1].toUpperCase();

      // Try to find a matching connector name
      // The provider name might need formatting (e.g., "modulr" -> "MODULR")
      const connectorNames = Object.values(CONNECTORS_NAMES);

      // Direct match
      if (connectorNames.includes(providerName as TConnectorName)) {
        if (!connectors.includes(providerName as TConnectorName)) {
          connectors.push(providerName as TConnectorName);
        }
      } else {
        // Try with dashes (e.g., "currencycloud" -> "CURRENCY-CLOUD")
        // Check by display name comparison (case-insensitive)
        const matchingConnector = Object.entries(CONNECTORS_NAMES).find(
          ([, value]) =>
            value.toLowerCase().replace(/-/g, '') === providerName.toLowerCase()
        );

        if (matchingConnector) {
          const connectorName = matchingConnector[1];
          if (!connectors.includes(connectorName)) {
            connectors.push(connectorName);
          }
        }
      }
    }
  }

  return connectors;
}

/**
 * Extract title from README content
 * Looks for the first h1 heading in markdown
 */
export function extractTitleFromReadme(content: string): string {
  const titleMatch = content.match(/^#\s+(.+)$/m);

  return titleMatch && titleMatch[1] ? titleMatch[1] : '';
}

/**
 * Extract description from README content
 * Gets the content after the title and before any subheadings
 */
export function extractDescriptionFromReadme(content: string): string {
  // Remove title and get content until next heading or end
  const withoutTitle = content.replace(/^#\s+.+$/m, '').trim();
  const descMatch = withoutTitle.match(/^(.+?)(?=\n##|$)/s);

  return descMatch && descMatch[1] ? descMatch[1].trim() : '';
}

/**
 * Detect secrets from manifest content
 * Looks for secret placeholders in the format: ${MY_SECRET_KEY}
 * Returns an array of unique secret names found in the manifest
 */
export function detectSecretsFromFile(content: string): string[] {
  const secrets = new Set<string>();

  // Match ${UPPERCASE_VAR} pattern - typically secrets
  const secretPattern = /\$\{([A-Z][A-Z0-9_]*)\}/g;

  const matches = content.matchAll(secretPattern);
  for (const match of matches) {
    if (match[1]) {
      const fullMatch = match[0];

      // Exclude manifest internal references (contain a dot)
      if (!fullMatch.includes('.')) {
        secrets.add(match[1]);
      }
    }
  }

  return Array.from(secrets).sort();
}
