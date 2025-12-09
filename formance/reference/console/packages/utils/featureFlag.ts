export const featureFlag = (
  feature: string,
  features: string[],
  next = false
): boolean => {
  if (!features) return true;
  if (features && features.includes(feature)) {
    return next;
  }

  return true;
};

export const formatFeatureFlagFromEnv = (features?: string) =>
  features?.split(',') || [];

export const useFeatureFlagServerSide = (feature: string, features: string[]) =>
  featureFlag(feature, features);
