# Data Table Filters

A comprehensive filtering system for data tables with support for multiple filter types and unified pagination.

## Features

- ✅ Support for all filter types: text, select, multiSelect, date, number, boolean
- ✅ Backend-compatible operators: `$match`, `$lt`, `$gt`, `$exists`, `$not`, etc.
- ✅ TypeScript support throughout
- ✅ Unified with `getPaginatedAndFilteredList` from `@platform/remix`

## Filter Types

### Text Filter

```tsx
{
  id: 'search',
  label: 'Search',
  type: 'text',
  placeholder: 'Search...'
}
```

### Select Filter

```tsx
{
  id: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ]
}
```

### Multi-Select Filter

```tsx
{
  id: 'categories',
  label: 'Categories',
  type: 'multiSelect',
  options: [
    { label: 'Category 1', value: 'cat1' },
    { label: 'Category 2', value: 'cat2' }
  ]
}
```

### Date Filter

```tsx
{
  id: 'createdAt',
  label: 'Created Date',
  type: 'date'
}
```

### Date Range Filter

```tsx
{
  id: 'dateRange',
  label: 'Date Range',
  type: 'dateRange'
}
```

### Number Filter

```tsx
{
  id: 'amount',
  label: 'Amount',
  type: 'number'
}
```

### Boolean Filter

```tsx
{
  id: 'isActive',
  label: 'Active',
  type: 'boolean'
}
```

### Range Filter

```tsx
{
  id: 'priceRange',
  label: 'Price Range',
  type: 'range'
}
```

## Usage with Data Tables

### Basic Implementation

```tsx
import { DataTableFilterList } from '@platform/ui';
import { getPaginatedAndFilteredList } from '@platform/remix';

// In your loader
export const loader = async ({ request }: { request: Request }) => {
  const data = await getPaginatedAndFilteredList(
    (config) => api.listItems(config),
    request,
    'items'
  );
  return { data };
};

// In your component
export default function ItemsList() {
  return (
    <div>
      <DataTableFilterList filters={filterConfig} tableId="items" />
      {/* Your data table component */}
    </div>
  );
}
```

### With Individual Query Parameters

```tsx
// For APIs that expect individual parameters
const data = await getPaginatedAndFilteredList(
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
  ['stackId', 'action', 'userId'] // Explicit filter parameter names
);
```

## 📝 Best Practices

### Constants Files

Define filter parameter names in a constants file:

```typescript
// constants.ts
export const LOGS_STACK_FILTER = 'stackId';
export const LOGS_ACTION_FILTER = 'action';
export const LOGS_USER_ID_FILTER = 'userId';
export const LOGS_LIST_ID = 'logs';
```

**Benefits:**

- ✅ Type safety and prevents typos
- ✅ Easy refactoring across codebase
- ✅ Better IDE support and autocomplete

### Filter Configuration

```typescript
// filters.ts
export const filterConfig = [
  {
    id: LOGS_STACK_FILTER,
    label: 'Stack',
    type: 'select',
    options: stackOptions,
  },
  {
    id: LOGS_ACTION_FILTER,
    label: 'Action',
    type: 'select',
    options: actionOptions,
  },
];
```

## Components

- `DataTableFilterList` - Main filter component
- `DataTableFavoriteFilter` - Toggle favorites
- `DataTableExportData` - Export functionality
- `SaveFilterForm` - Save filter configurations
- `SaveFilterSelector` - Load saved filters
