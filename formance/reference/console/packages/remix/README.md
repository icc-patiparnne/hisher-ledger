# @platform/remix

A collection of reusable Remix components and utilities for the Formance Platform.

## 🚀 Data Table Pagination

### `getPaginatedAndFilteredList`

A unified function for handling paginated and filtered data in server-side loaders. This function automatically determines whether to use individual query parameters or consolidated queries based on the filter parameters provided.

#### API

```typescript
export async function getPaginatedAndFilteredList<T, K>(
  getList: (config: K) => Promise<T> | undefined,
  request: Request,
  tableId: string,
  filterParams?: string[]
): Promise<T>;
```

#### Parameters

- `getList`: Your API function that receives a config object
- `request`: The incoming request object
- `tableId`: Unique identifier for this table (used for URL parameter names)
- `filterParams`: Optional array of filter parameter names to extract from URL

#### Behavior

- **With `filterParams`**: Uses individual query parameters (`?stackId=123&action=CREATE`)
- **Without `filterParams`**: Uses consolidated query (`$match={"stackId":"123","action":"CREATE"}`)

## 📖 Usage Examples

### Individual Query Parameters (Portal Logs)

For APIs that expect individual query parameters:

```typescript
import { getPaginatedAndFilteredList } from '@platform/remix';

export const loader: LoaderFunction = async ({ request }) => {
  const logsCursor = await getPaginatedAndFilteredList(
    async (config: any) => {
      const response = await api.listLogs(
        organizationId,
        config.stackId,
        config.cursor,
        config.pageSize,
        config.action,
        config.userId
      );
      return get(response, 'data.data', {
        data: [],
        pageSize: config.pageSize || 10,
        hasMore: false,
      });
    },
    request,
    'logs',
    ['stackId', 'action', 'userId'] // Explicit filter parameter names
  );

  return { logsCursor };
};
```

**URL Format**: `/logs?logs_cursor=abc123&stackId=123&action=CREATE&userId=user123`

### Consolidated Query (Console Components)

For APIs that expect consolidated query objects:

```typescript
import { getPaginatedAndFilteredList } from '@platform/remix';

export const v1Loader = async (api: NormalizedSDK, request: Request) => {
  const ledgerAccounts = await getPaginatedAndFilteredList(
    (config: ListAccountsRequest) =>
      api.ledger.listAccounts({
        ...config,
        ...(selectedLedger && { ledger: selectedLedger }),
      }),
    request,
    'ledger_accounts'
  );

  return { ledgerAccounts };
};
```

**URL Format**: `/ledger?ledger_accounts_cursor=abc123&ledger_accounts={"filters":"values"}`

## 🎯 Key Benefits

1. **🧠 Smart Detection**: Automatically determines parameter handling based on filter parameters
2. **🔧 Single Function**: Replaces both `getPaginatedAndFilteredListBodyQuery` and `getPaginatedAndFilteredListQueryParams`
3. **📖 Explicit API**: Clear array of filter parameter names makes intent obvious
4. **🔄 Backward Compatible**: Existing code continues to work
5. **✨ Clean Logic**: v1 loaders use individual params, v2 loaders use consolidated queries

## 🔧 Migration Guide

### From `getPaginatedAndFilteredListQueryParams`

```typescript
// Old approach
const result = await getPaginatedAndFilteredListQueryParams(
  (config) =>
    api.listLogs(
      orgId,
      config.stackId,
      config.cursor,
      config.pageSize,
      config.action,
      config.userId
    ),
  request,
  'logs',
  ['stackId', 'action', 'userId']
);

// New approach
const result = await getPaginatedAndFilteredList(
  (config) =>
    api.listLogs(
      orgId,
      config.stackId,
      config.cursor,
      config.pageSize,
      config.action,
      config.userId
    ),
  request,
  'logs',
  ['stackId', 'action', 'userId']
);
```

### From `getPaginatedAndFilteredListBodyQuery`

```typescript
// Old approach
const result = await getPaginatedAndFilteredListBodyQuery(
  (config) => api.listLogs(config.query, config.cursor, config.pageSize),
  request,
  'logs'
);

// New approach
const result = await getPaginatedAndFilteredList(
  (config) => api.listLogs(config.query, config.cursor, config.pageSize),
  request,
  'logs'
);
```

## 🎨 URL Parameter Format

### Individual Query Parameters

When `filterParams` are provided, the function extracts individual parameters from the URL:

```
/logs?logs_cursor=abc123&logs_pageSize=20&stackId=123&action=CREATE&userId=user123
```

### Consolidated Query

When no `filterParams` are provided, the function uses consolidated query:

```
/logs?logs_cursor=abc123&logs_pageSize=20&logs={"stackId":"123","action":"CREATE","userId":"user123"}
```

## 🚀 Best Practices

1. **Use explicit filter parameter names** for individual query parameters
2. **Omit filter parameters** for consolidated queries
3. **Keep parameter names consistent** with your API expectations
4. **Use descriptive table IDs** for better URL readability

## 📚 Related Components

- `DatatableServerSide`: Server-side data table component
- `useDataTableQuery`: Hook for data table query management
- `DataTableFilterList`: Filter list component for data tables
