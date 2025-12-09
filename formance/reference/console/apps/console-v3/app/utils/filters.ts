/**
 * Checks if any URL parameters start with the specified table ID.
 * This helps differentiate between "no data because setup needed" vs "no data because of applied filters".
 * Can be used across any datatable component (payments, ledgers, accounts, etc.).
 *
 * @param searchParams - The URL search parameters
 * @param tableId - The table identifier (e.g., 'payments', 'ledgers-list', etc.)
 * @returns true if any parameters start with the table ID
 */
export function hasActiveTableFilters(
  searchParams: URLSearchParams,
  tableId: string
): boolean {
  // Check if any parameters start with the table ID
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith(tableId) && value !== null && value !== '') {
      return true;
    }
  }

  return false;
}
