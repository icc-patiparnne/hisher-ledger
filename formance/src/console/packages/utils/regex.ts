// UUID regex pattern
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Account name regex pattern matching [a-zA-Z0-9_-]+ with optional :segments
export const ACCOUNT_NAME_REGEX = /^[a-zA-Z0-9_-]+(?::[a-zA-Z0-9_-]+)*$/;

export const isValidUUID = (value: string) => UUID_REGEX.test(value);
export const isValidAccountName = (value: string) =>
  ACCOUNT_NAME_REGEX.test(value);
