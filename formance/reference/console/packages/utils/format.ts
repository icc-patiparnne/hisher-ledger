import dayjs from 'dayjs';

import { escape as _escape } from 'lodash-es';
import { validate } from 'uuid';

export const lowerCaseAllWordsExceptFirstLetter = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;

export const formatUppercaseWithHyphens = (str: string): string =>
  str.replace(/-/g, ' ');

export const formatDate = (
  timestamp: Date,
  format = 'MMM DD, YYYY - hh:mm A'
): string => {
  try {
    return dayjs(timestamp).format(format);
  } catch {
    return 'unknown';
  }
};

export const copyToClipboard = async (value: string): Promise<void> =>
  await navigator.clipboard.writeText(value);

export const padNumber = (num: string | number, length: number = 4): string => {
  const numStr = num.toString();

  return numStr.length >= length ? numStr : numStr.padStart(length, '0');
};

export function formatNumber(number: number | string | bigint): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function serializeBigInt<T>(json: unknown | undefined): T | undefined {
  return json
    ? (JSON.parse(
        JSON.stringify(
          json,
          (_: unknown, value: unknown) =>
            typeof value === 'bigint' ? value.toString() : value // return everything else unchanged
        )
      ) as T)
    : undefined;
}

export const escape = (
  item: null | string | FormDataEntryValue
): undefined | string => {
  if (typeof item === 'string') {
    return _escape(item);
  }

  return undefined;
};

export const removeNullAndUndefinedValueFromObject = (obj: {
  [k: string]: any;
}) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
  );

export function formatAddress(str: string) {
  const MAX_SEGMENT_THRESHOLD = 8; // Threshold for a segment length before truncating
  const TAIL_LENGTH = 6; // Length of the tail or head to keep for segments that are too long
  // const TRUNCATE_DIRECTION = 'tail'; // Options: 'head' or 'tail'

  const segments = str.split(':');

  // Process each segment: keep first and last segments fully, truncate others if needed
  const truncatedSegments = segments.map((segment, index) => {
    // Keep the first and last segments in full
    if (index === 0 || index === segments.length - 1) {
      return segment;
    }

    if (validate(segment)) {
      return segment.slice(24);
    }

    // Truncate middle segments if they exceed the MAX_SEGMENT_THRESHOLD
    if (segment.length > MAX_SEGMENT_THRESHOLD) {
      // return TRUNCATE_DIRECTION === 'head'
      //   ? segment.slice(0, TAIL_LENGTH) // Keep only the head if direction is 'head'
      //   :
      return segment.slice(-TAIL_LENGTH); // Keep only the tail if direction is 'tail'
    }

    // Keep the segment as is if it does not exceed the threshold
    return segment;
  });

  // Join the segments back with colons and return
  return truncatedSegments.join(':');
}
