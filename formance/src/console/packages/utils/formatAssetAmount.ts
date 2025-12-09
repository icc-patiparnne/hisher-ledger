import Decimal from 'decimal.js';
import { formatNumber } from './format';

// Non‑fiat asset registry for assets that require custom configuration.
interface AssetConfig {
  decimals?: number;
}

const NON_FIAT_ASSET_REGISTRY: Record<string, AssetConfig> = {
  BTC: { decimals: 8 },
  ETH: { decimals: 2 },
};

const DEFAULT_MAX_DECIMALS = 0;
const SCIENTIFIC_THRESHOLD = new Decimal('1e-6'); // For tiny numbers
const LARGE_NUMBER_THRESHOLD = new Decimal('1e18'); // Used only for non‑fiat

export type TFormatAssetAmountParams = {
  asset?: string | null;
  amount?: number | bigint | string | null;
  shouldFormat: boolean;
  showAssetCode?: boolean;
  maxDecimals?: number;
  locale?: string;
};

/**
 * Checks whether a currency code is valid for fiat formatting.
 *
 * @param currency - The currency code to validate.
 * @param locale - The locale to use (default is 'en-US').
 * @returns True if the currency is valid, false otherwise.
 */
function isValidFiatCurrency(
  currency: string,
  locale: string = 'en-US'
): boolean {
  try {
    new Intl.NumberFormat(locale, { style: 'currency', currency });

    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts the currency symbol for a given fiat currency.
 *
 * @param currency - The fiat currency code.
 * @param locale - The locale to use (default is 'en-US').
 * @returns The currency symbol (e.g. "$" for USD).
 */
function getCurrencySymbol(currency: string, locale: string = 'en-US'): string {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0);

  // Remove any digits and whitespace (assumes symbol is the remaining part)
  return formatted.replace(/\d/g, '').trim();
}

/**
 * Determines the grouping and decimal separators for a locale.
 *
 * @param locale - The locale to use (default is 'en-US').
 * @returns An object with the grouping and decimal separator.
 */
function getSeparators(locale: string = 'en-US'): {
  group: string;
  decimal: string;
} {
  const formattedNumber = new Intl.NumberFormat(locale).format(1000);
  // Remove all digits to obtain the group separator (e.g. "," for en-US)
  const group = formattedNumber.replace(/\d/g, '');
  const formattedDecimal = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(1.1);
  // Remove all digits to get the decimal separator (e.g. "." for en-US)
  const decimal = formattedDecimal.replace(/\d/g, '');

  return { group, decimal };
}

/**
 * Inserts grouping separators into a numeric string.
 *
 * @param numberString - The number as a string (e.g. "1234567.89").
 * @param locale - The locale used to determine the separators.
 * @returns The formatted string with grouping (e.g. "1,234,567.89").
 */
function addGroupingSeparators(
  numberString: string,
  locale: string = 'en-US'
): string {
  const { group, decimal } = getSeparators(locale);
  const [integerPart, fractionalPart] = numberString.split('.');
  // Insert grouping separators into the integer part.
  const groupedInteger =
    integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, group) || '';

  return fractionalPart
    ? groupedInteger + decimal + fractionalPart
    : groupedInteger;
}

/**
 * Formats an asset amount based on the provided configuration.
 *
 * For fiat currencies (detected via Intl.NumberFormat), this function either uses Intl.NumberFormat
 * (for numbers within JS safe integer range) or a custom formatter that preserves full precision.
 *
 * Decimal places are determined in the following order:
 * 1. Asset notation: "USD/4" -> exactly 4 decimals
 * 2. Non-fiat registry: "BTC" -> 8 decimals (from registry)
 * 3. Default: 2 decimals
 *
 * Examples:
 * - "USD/4" with amount 990 -> "0.0990 USD" (from notation)
 * - "BTC" with amount 100000000 -> "1.00000000 BTC" (from registry)
 * - "USD" with amount 990 -> "990.00 USD" (default)
 *
 * @param params - The parameters for formatting the asset amount.
 * @returns A formatted asset amount string.
 */
export function formatAssetAmount({
  asset,
  amount,
  shouldFormat,
  showAssetCode = false,
  maxDecimals,
  locale = 'en-US',
}: TFormatAssetAmountParams): string {
  if (amount === null || amount === undefined) return '0';

  // Convert the input amount using Decimal.js for precise arithmetic.
  let numericAmount = new Decimal(amount.toString());

  // Extract asset code and any fraction details (e.g. "USD/2").
  let normalizedAssetCode = '';
  let explicitFractionDigits: number | undefined;
  if (asset) {
    const [assetCodePart, fractionStr] = asset.split('/');
    normalizedAssetCode = assetCodePart?.toUpperCase() || '';
    // Parse fraction digits from asset notation, if present
    if (fractionStr) {
      const parsed = parseInt(fractionStr, 10);
      explicitFractionDigits = !isNaN(parsed) ? parsed : undefined;
    }
  }

  // If no formatting is requested, return the raw number with optional asset code
  if (!shouldFormat) {
    return `${
      showAssetCode && normalizedAssetCode ? normalizedAssetCode + ' ' : ''
    }${formatNumber(amount)}`;
  }

  // Determine if the asset is a fiat currency
  const isFiat = normalizedAssetCode
    ? isValidFiatCurrency(normalizedAssetCode, locale)
    : false;

  // For non‑fiat assets, check the registry for custom decimal places
  const assetConfig = NON_FIAT_ASSET_REGISTRY[normalizedAssetCode];

  // Determine the number of decimal places to use
  const decimalsToUse =
    // 1. Use explicit decimal notation if present (e.g., USD/4)
    explicitFractionDigits !== undefined
      ? explicitFractionDigits
      : // 2. Use maxDecimals if specified
      maxDecimals !== undefined
      ? maxDecimals
      : // 3. Use asset-specific config if available
      assetConfig?.decimals !== undefined
      ? assetConfig.decimals
      : // 4. Fall back to default
        DEFAULT_MAX_DECIMALS;

  // If a fraction was provided (e.g. "USD/2"), adjust the numeric value
  // This handles cases like 99900 USD/2 -> 999.00 USD
  if (explicitFractionDigits !== undefined && explicitFractionDigits > 0) {
    numericAmount = numericAmount.dividedBy(
      Decimal.pow(10, explicitFractionDigits)
    );
  }

  // Special handling for zero to avoid scientific notation
  if (numericAmount.eq(0)) {
    if (isFiat) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: normalizedAssetCode,
        minimumFractionDigits: decimalsToUse,
        maximumFractionDigits: decimalsToUse,
        useGrouping: true,
      }).format(0);
    }

    return normalizedAssetCode
      ? `${numericAmount.toFixed(decimalsToUse)} ${normalizedAssetCode}`
      : numericAmount.toFixed(decimalsToUse);
  }

  // Handle fiat currencies
  if (isFiat) {
    // For large numbers that exceed JS safe integer range
    if (numericAmount.abs().gt(new Decimal(Number.MAX_SAFE_INTEGER))) {
      const formattedString = numericAmount.toFixed(decimalsToUse);
      const groupedNumber = addGroupingSeparators(formattedString, locale);
      const currencySymbol = getCurrencySymbol(normalizedAssetCode, locale);

      return `${currencySymbol}${groupedNumber}`;
    }

    // For regular numbers, use Intl.NumberFormat
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedAssetCode,
      minimumFractionDigits: decimalsToUse,
      maximumFractionDigits: decimalsToUse,
      useGrouping: true,
    }).format(numericAmount.toNumber());
  }

  // Handle non-fiat assets
  const absAmount = numericAmount.abs();
  // Use scientific notation for very small or large numbers
  if (
    absAmount.lt(SCIENTIFIC_THRESHOLD) ||
    absAmount.gte(LARGE_NUMBER_THRESHOLD)
  ) {
    const sciNotation = numericAmount.toExponential(decimalsToUse);

    return normalizedAssetCode
      ? `${sciNotation} ${normalizedAssetCode}`
      : sciNotation;
  }

  // For regular numbers, use the determined number of decimal places
  const formattedNumber = numericAmount.toFixed(decimalsToUse);

  return normalizedAssetCode
    ? `${formattedNumber} ${normalizedAssetCode}`
    : formattedNumber;
}
