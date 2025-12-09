'use client';

import { FileDown } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '../../button';

/**
 * DataTableExportData - Export Data Component
 *
 * PURPOSE:
 * - Provides a button to export data from a cursor to JSON file
 * - Handles data serialization and file download
 * - Generates meaningful filenames based on current page and filters
 *
 * KEY FEATURES:
 * - Only shows when data is available
 * - Exports complete cursor data including pagination info
 * - Generates descriptive filenames with page and filter context
 * - Handles URL encoding for special characters in filenames
 */

type DataTableExportDataProps = {
  // Data to export
  cursorData?: {
    data: any[];
    [key: string]: any;
  };

  // Optional customization
  disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export function DataTableExportData({
  cursorData,
  disabled = false,
  ...props
}: DataTableExportDataProps) {
  /**
   * EXPORT DATA FUNCTION
   *
   * Creates and downloads a JSON file containing the cursor data.
   * Generates a descriptive filename based on current page and URL parameters.
   */
  const exportData = useCallback(() => {
    if (!cursorData || !cursorData.data || cursorData.data.length === 0) {
      return;
    }

    // Create JSON string with proper encoding
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(cursorData, null, 2)
    )}`;

    // Generate filename based on current page
    const pathname =
      typeof window !== 'undefined' ? window.location.pathname : '';
    const pathSegments = pathname.split('/').filter(Boolean);
    const page =
      pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'data';

    // Get current search parameters for filename context
    const searchParams =
      typeof window !== 'undefined' ? window.location.search : '';
    const filterContext = searchParams ? `_filters${searchParams}` : '';

    // Create filename with timestamp for uniqueness
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `exported_data_${page}_${timestamp}${filterContext}.json`;

    // Create and trigger download
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = filename;
    link.click();
  }, [cursorData]);

  // Don't render if no data available
  if (!cursorData || !cursorData.data || cursorData.data.length === 0) {
    return null;
  }

  return (
    <Button
      variant="outlineDashed"
      size="sm"
      onClick={exportData}
      disabled={disabled}
      {...props}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Export data
    </Button>
  );
}
