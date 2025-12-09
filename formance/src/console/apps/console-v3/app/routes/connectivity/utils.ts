type ProviderEntity = {
  provider?: string | any;
  metadata?: { [k: string]: string } | null | undefined;
};

/**
 * Determines the effective provider for a payment account or payment.
 * If the provider is "generic" and has a "spec.formance.com/generic_provider" metadata key,
 * returns the value of that metadata key. Otherwise, returns the original provider.
 */
export function getEffectiveProvider(
  entity: ProviderEntity
): string | undefined {
  const { provider, metadata } = entity;

  // Convert provider to string for comparison
  const providerString =
    typeof provider === 'string' ? provider : provider?.toString();

  // Check if provider is "generic" and metadata contains the specific key
  if (
    providerString === 'generic' &&
    metadata &&
    'spec.formance.com/generic_provider' in metadata
  ) {
    const genericProvider = metadata['spec.formance.com/generic_provider'];

    return genericProvider || providerString;
  }

  return providerString;
}
