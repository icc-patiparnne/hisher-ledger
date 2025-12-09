export type Cursor<T> = {
  pageSize: number;
  hasMore: boolean;
  previous?: string;
  next?: string;
  data: T[];
};

export const hasCursorData = (cursor: { data?: any[] } | undefined | null): boolean =>
  Boolean(cursor?.data && Array.isArray(cursor.data) && cursor.data.length > 0);
