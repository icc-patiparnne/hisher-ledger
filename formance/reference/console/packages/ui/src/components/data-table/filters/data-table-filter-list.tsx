'use client';

import {
  BookOpen,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Code,
  Filter,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PreviewJson } from '../../app/preview-json';
import { Badge } from '../../badge';
import { Button } from '../../button';
import { Calendar } from '../../calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../command';
import { DateRangePicker, type DateRange } from '../../date/date-range-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../dialog';
import { Input } from '../../input';
import { Label } from '../../label';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select';
import { Separator } from '../../separator';
import { Slider } from '../../slider';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '../../sortable';
import { Switch } from '../../switch';
import {
  SaveFilterForm,
  SaveFiltersHook,
} from './save-filters/save-filter-form';
import { SaveFilterSelector } from './save-filters/save-filter-selector';

import { EXTERNAL_LINKS } from '@platform/utils';
import { cn } from '../../../lib/utils';
import {
  formatDate,
  generateId,
  getDefaultFilterOperatorV2,
  getFilterOperatorsV2,
  getValidConfigurableFilters,
} from './lib';
import {
  convertConfigurableFiltersToPlatformQuery,
  extractUrlParameters,
  separateFilters,
} from './query-builder';
import {
  dataTableV2Config,
  MetadataFilterValue,
  type ConfigurableColumnFilter,
  type FilterConfig,
  type FilterOperatorV2,
  type JoinOperatorV2,
} from './types';
import { parseQueryToConfigurableFilters } from './v2-to-v1-transformer';

/**
 * DataTableFilterListV2 - Advanced Filter Management Component
 *
 * PURPOSE:
 * - Provides a rich UI for creating, editing, and managing data table filters
 * - Consolidates multiple filters into a single JSON query parameter
 * - Supports saved filters, favorites toggle, and complex filter operations
 * - Uses a clean generator function API for filter configuration
 *
 * KEY FEATURES:
 * - Internal memoization prevents filter resets during typing
 * - URL synchronization for browser navigation and deep linking
 * - Drag-and-drop filter reordering
 * - Multiple filter variants: text, number, boolean, date, select, metadata, balanceByAsset
 * - Save/load filter configurations
 * - Favorites integration with URL parameter management
 *
 * ARCHITECTURE:
 * - Parent provides filter config via generator function
 * - Component manages internal filter state and UI interactions
 * - Emits consolidated queries via onQueryChange callback
 * - Parent handles actual URL updates and data fetching
 */

const OPEN_MENU_SHORTCUT = 'f';
const REMOVE_FILTER_SHORTCUTS = ['backspace', 'delete'];

// Simple interface for what we need from columns
interface FilterableColumn {
  id: string;
}

// Type for filter config generator function
type FilterConfigGenerator = () => FilterConfig;

interface DataTableFilterListProps {
  // Filter config generator function (required)
  getFilterConfig: FilterConfigGenerator;

  tableId: string; // Unique identifier for this table's query
  onQueryChange?: (query: { [key: string]: string }) => void;
  onResetFilters?: (resetParams?: Record<string, string>) => void; // Generic reset handler
  initialUrlQuery?: string; // Pre-existing query from URL for pre-filling filters
  saveFiltersHook?: SaveFiltersHook; // Hook for managing saved filters with org-stack scoping
}

export function DataTableFilterList({
  // FILTER CONFIG API
  getFilterConfig, // Generator function (required)

  // CORE PROPS
  tableId, // Unique ID for this table's filters
  onQueryChange, // Callback when consolidated query changes
  onResetFilters, // Callback when filters are reset
  initialUrlQuery, // Pre-existing query from URL (optional)

  // SAVED FILTERS INTEGRATION
  saveFiltersHook, // Hook for save/load functionality

  ...props
}: DataTableFilterListProps) {
  // ============================================================================
  // ACCESSIBILITY & UI IDENTIFIERS
  // ============================================================================
  const id = `${tableId}-filter`;
  const labelId = `${tableId}-filter-label`;
  const descriptionId = `${tableId}-filter-description`;

  // ============================================================================
  // COMPONENT STATE MANAGEMENT
  // ============================================================================

  // UI State: Controls whether the filter popover is open
  const [open, setOpen] = useState(false);

  // References for focus management when adding/removing filters
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // SSR/Hydration safety: Only render full UI after client-side hydration
  const [isClient, setIsClient] = useState(false);

  // Change detection: Prevents unnecessary query emissions
  const lastAppliedQueryRef = useRef<string | undefined>(undefined);

  // ============================================================================
  // FILTER CONFIGURATION PROCESSING
  // ============================================================================

  /**
   * FILTER CONFIG MEMOIZATION
   *
   * Calls the generator function with memoization to prevent unnecessary re-renders.
   * The generator function should return a stable FilterConfig object.
   *
   * WHY MEMOIZATION MATTERS:
   * Without this, every render would create a new config object, causing
   * filter resets and poor performance.
   */
  const filterConfig = useMemo(() => getFilterConfig(), [getFilterConfig]);

  // Store filter config in a ref to avoid dependency loops
  const filterConfigRef = useRef(filterConfig);

  // Keep the ref up to date
  useEffect(() => {
    filterConfigRef.current = filterConfig;
  }, [filterConfig]);

  // Check if filter config is empty
  const hasFilters = useMemo(
    () => Object.keys(filterConfig).length > 0,
    [filterConfig]
  );

  /**
   * COLUMN METADATA EXTRACTION
   *
   * Converts filter config into column metadata format expected by the UI.
   * This transformation allows the filter selectors to work with field definitions.
   */
  const columns = useMemo(
    (): FilterableColumn[] =>
      Object.entries(filterConfig).map(([fieldId, config]) => ({
        id: fieldId,
        columnDef: {
          meta: config,
        },
      })),
    [filterConfig]
  );

  // ============================================================================
  // FILTER STATE MANAGEMENT
  // ============================================================================

  /**
   * CORE FILTER STATE
   *
   * - filters: Array of active filter configurations
   * - joinOperator: How multiple filters are combined ("and" | "or")
   * - showQueryDialog: Whether the JSON preview dialog is open
   * - selectedSavedFilter: Currently selected saved filter ID
   */
  const [filters, setFilters] = useState<ConfigurableColumnFilter[]>([]);
  const [joinOperator, setJoinOperator] = useState<JoinOperatorV2>('and');
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<string>();

  // ============================================================================
  // SAVED FILTERS INTEGRATION HELPERS
  // ============================================================================

  /**
   * GET CURRENT SEARCH PARAMS
   *
   * Helper for saved filters to capture current URL state.
   * Used when saving filters to preserve the complete search context.
   */
  const getCurrentSearchParams = useCallback(() => {
    if (typeof window === 'undefined') return '';

    return window.location.search;
  }, []);

  /**
   * APPLY SAVED FILTER TO URL & UI
   *
   * This complex function handles loading a saved filter configuration:
   *
   * STEPS:
   * 1. Merge saved filter params with existing URL params
   * 2. Update browser URL without triggering navigation
   * 3. Parse the loaded query and populate the filter UI
   * 4. Handle parsing errors gracefully
   * 5. Notify other components of URL changes
   *
   * MERGE STRATEGY:
   * - Preserve non-filter URL parameters (e.g., page, region)
   * - Override filter-specific parameters with saved values
   * - Maintain browser history for back/forward navigation
   */
  const onApplySearchParams = useCallback(
    (searchParams: string) => {
      if (typeof window === 'undefined') return;

      // STEP 1: Prepare URL parameter merging
      const currentParams = new URLSearchParams(window.location.search);
      const newParams = new URLSearchParams(searchParams);
      const mergedParams = new URLSearchParams();

      // STEP 2: Copy existing parameters (preserves context like region, page)
      currentParams.forEach((value, key) => {
        mergedParams.set(key, value);
      });

      // STEP 3: Apply saved filter parameters (overwrites filter-specific params)
      newParams.forEach((value, key) => {
        mergedParams.set(key, value);
      });

      // STEP 4: Update browser URL without navigation
      const newUrl = `${window.location.pathname}?${mergedParams.toString()}`;
      window.history.pushState(null, '', newUrl);

      // STEP 5: Parse and populate filter UI
      const loadedQuery = newParams.get(tableId);
      if (loadedQuery) {
        try {
          // Parse JSON query into filter objects
          const parsedFilters = parseQueryToConfigurableFilters(loadedQuery);

          // Ensure each filter has a unique ID for React rendering
          const enhancedFilters = parsedFilters.map((filter) => ({
            ...filter,
            filterId:
              filter.filterId || `filter-${Date.now()}-${Math.random()}`,
          }));

          setFilters(enhancedFilters);
          lastAppliedQueryRef.current = loadedQuery;
        } catch (error) {
          // STEP 6: Handle parsing errors gracefully
          // eslint-disable-next-line no-console
          console.error('Failed to parse loaded filter query:', error);
          setFilters([]);
          lastAppliedQueryRef.current = undefined;
        }
      } else {
        // No query loaded, clear filters
        setFilters([]);
        lastAppliedQueryRef.current = undefined;
      }

      // STEP 7: Notify other components of URL changes
      window.dispatchEvent(new Event('urlchange'));
    },
    [tableId, filterConfig]
  );

  // ============================================================================
  // QUERY GENERATION & PREVIEW
  // ============================================================================

  /**
   * CURRENT QUERY PREVIEW
   *
   * Generates a real-time JSON preview of the current filter configuration.
   * Used by the "View Query" dialog to show developers what query will be sent.
   *
   * PROCESS:
   * 1. Validate all filters (remove incomplete ones)
   * 2. Convert to platform query format
   * 3. Apply join operator (AND/OR logic)
   */
  const currentQuery = useMemo(() => {
    const validFilters = getValidConfigurableFilters(filters);
    if (validFilters.length === 0) {
      return {};
    }

    return convertConfigurableFiltersToPlatformQuery(
      validFilters,
      joinOperator,
      filterConfig
    );
  }, [filters, joinOperator, filterConfig]);

  // ============================================================================
  // INITIAL STATE EXTRACTION FROM URL
  // ============================================================================

  /**
   * EXTRACT INITIAL QUERY FROM URL (ONCE ON MOUNT)
   *
   * This reads the URL parameter ONCE when the component mounts to populate
   * filters from deep links or page refreshes.
   *
   * SOURCES (priority order):
   * 1. Explicit initialUrlQuery prop (from parent)
   * 2. URL parameter matching tableId
   * 3. undefined (no initial filters)
   *
   * WHY useState LAZY INITIALIZER:
   * - Runs only once on mount (not on every render)
   * - Prevents infinite re-initialization loops
   * - SSR-safe (handles server vs client differences)
   */
  const [initialQueryFromUrl] = useState(() => {
    if (initialUrlQuery) {
      return initialUrlQuery.trim() || undefined;
    }

    if (typeof window !== 'undefined') {
      const urlQuery = new URLSearchParams(window.location.search).get(tableId);

      return urlQuery?.trim() || undefined;
    }

    return undefined;
  });

  const normalizedInitialQuery = initialQueryFromUrl;

  // ============================================================================
  // LIFECYCLE EFFECTS - INITIALIZATION & URL SYNCHRONIZATION
  // ============================================================================

  /**
   * EFFECT 1: CLIENT-SIDE HYDRATION
   *
   * Simple flag to enable full functionality after SSR hydration.
   * Prevents hydration mismatches and window access errors.
   */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * EFFECT 2: INITIALIZE FILTERS FROM URL (MOUNT ONLY)
   *
   * This is the primary initialization effect that runs ONCE after hydration.
   * It handles two types of filter population:
   *
   * A) CONSOLIDATED QUERY FILTERS (Main filtering system)
   *    - Reads the table-specific URL parameter (e.g., ?ledger_accounts=...)
   *    - Parses JSON query into individual filter objects
   *    - Sets up join operator (AND/OR) from query structure
   *    - Enhances filters with UI metadata (IDs, variants)
   *
   * B) PARAMETER-BASED FILTERS (Special cases like ledger selection)
   *    - Reads individual URL parameters marked with config.param
   *    - Creates filter objects for each parameter found
   *    - Used for things like pre-selecting a ledger
   *
   * CRITICAL: Dependencies exclude filterConfig to prevent reset loops!
   */
  useEffect(() => {
    if (!isClient) {
      return;
    }

    let initialFilters: ConfigurableColumnFilter[] = [];

    // PART A: Parse consolidated query from URL parameter
    if (normalizedInitialQuery) {
      // Avoid re-parsing the same query (change detection)
      if (lastAppliedQueryRef.current === normalizedInitialQuery) {
        return;
      }

      try {
        // Parse JSON query string into filter objects
        const parsedFilters = parseQueryToConfigurableFilters(
          normalizedInitialQuery
        );

        // Enhance filters with metadata from current config
        initialFilters = parsedFilters.map((filter) => {
          const fieldConfig = filterConfig[filter.id];

          return {
            ...filter,
            variant: fieldConfig?.variant || filter.variant,
            filterId: generateId({ length: 8 }),
          } as ConfigurableColumnFilter;
        });

        // Extract join operator from query structure
        const query = JSON.parse(normalizedInitialQuery);
        setJoinOperator(query.$or ? 'or' : 'and');

        lastAppliedQueryRef.current = normalizedInitialQuery;
      } catch (error) {
        // Silently ignore parse errors (malformed URLs, etc.)
      }
    }

    // PART B: Auto-populate from individual URL parameters
    Object.entries(filterConfig).forEach(([fieldId, config]) => {
      if (config.param && !initialFilters.some((f) => f.id === fieldId)) {
        const paramValue =
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get(config.param)
            : null;
        if (paramValue) {
          initialFilters.push({
            id: fieldId,
            value: paramValue,
            variant: config.variant,
            operator: getDefaultFilterOperatorV2(config.variant),
            filterId: generateId({ length: 8 }),
          });
        }
      }
    });

    setFilters(initialFilters);
  }, [isClient, normalizedInitialQuery]); // Removed filterConfig dependency to prevent resets

  /**
   * EFFECT 3: URL CHANGE DETECTION
   *
   * Monitors browser URL changes to sync parameter-based filters.
   * This handles:
   * - Browser back/forward navigation
   * - Programmatic URL updates from other components
   * - Manual URL editing
   *
   * SIMPLIFIED APPROACH:
   * - Single state variable tracks URL search string
   * - Detects changes via comparison, not complex event listening
   * - Minimal interval polling removed for better performance
   */
  const [urlSearch, setUrlSearch] = useState('');
  useEffect(() => {
    if (!isClient) return;

    const currentSearch = window.location.search;
    if (currentSearch !== urlSearch) {
      setUrlSearch(currentSearch);
    }

    // Listen for browser navigation changes (back/forward buttons)
    const handlePopState = () => setUrlSearch(window.location.search);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [isClient, urlSearch]);

  /**
   * EFFECT 4: PARAMETER-BASED FILTER SYNCHRONIZATION
   *
   * Handles special filters that use individual URL parameters instead of
   * the consolidated query. These are typically used for:
   * - Ledger pre-selection (ledger_selected=my-ledger)
   * - Other context-specific parameters
   *
   * PROCESS:
   * 1. Find all filter configs marked with config.param
   * 2. Check if their URL parameters exist
   * 3. Add/remove filter objects based on parameter presence
   * 4. Update filter state only if changes detected
   *
   * WHY SEPARATE FROM MAIN QUERY:
   * Some filters need to be URL parameters for routing/navigation reasons,
   * while most filters use the consolidated JSON query approach.
   */
  // Track last processed URL to avoid processing our own changes
  const lastProcessedUrlRef = useRef<string>('');

  useEffect(() => {
    if (!isClient || !urlSearch) return;

    // Skip processing if this is the same URL we just processed
    if (lastProcessedUrlRef.current === urlSearch) return;

    // Only handle param-based filters (special cases)
    const paramConfigs = Object.entries(filterConfigRef.current).filter(
      ([, config]) => config?.param
    );
    if (paramConfigs.length === 0) return;

    const searchParams = new URLSearchParams(urlSearch);

    setFilters((currentFilters) => {
      const updatedFilters = [...currentFilters];
      let hasChanges = false;

      paramConfigs.forEach(([fieldId, config]) => {
        if (!config?.param) return;

        const paramValue = searchParams.get(config.param);
        const existingIndex = updatedFilters.findIndex((f) => f.id === fieldId);
        const existingFilter =
          existingIndex !== -1 ? updatedFilters[existingIndex] : null;

        if (paramValue && existingIndex === -1) {
          // Add new param-based filter (parameter appeared)
          updatedFilters.push({
            id: fieldId,
            value: paramValue,
            variant: config.variant,
            operator: getDefaultFilterOperatorV2(config.variant),
            filterId: generateId({ length: 8 }),
          });
          hasChanges = true;
        } else if (
          paramValue &&
          existingFilter &&
          existingFilter.value !== paramValue
        ) {
          // Update existing param-based filter if value changed
          updatedFilters[existingIndex] = {
            ...existingFilter,
            value: paramValue,
          };
          hasChanges = true;
        } else if (!paramValue && existingIndex !== -1) {
          // Remove param-based filter (parameter disappeared)
          updatedFilters.splice(existingIndex, 1);
          hasChanges = true;
        }
      });

      // Mark this URL as processed
      lastProcessedUrlRef.current = urlSearch;

      return hasChanges ? updatedFilters : currentFilters;
    });
  }, [isClient, urlSearch]);

  /**
   * EFFECT 5: QUERY BUILDING & EMISSION (MAIN OUTPUT)
   *
   * This is the core effect that converts internal filter state into
   * output queries for the parent component. It runs whenever filters change.
   *
   * COMPLEX PROCESS:
   *
   * 1. VALIDATION: Remove incomplete/invalid filters
   *
   * 2. SEPARATION: Split filters into two categories:
   *    - Query filters: Go into consolidated JSON query
   *    - Param filters: Become individual URL parameters
   *
   * 3. QUERY BUILDING: Convert filters to platform query format
   *    - Apply join operator (AND/OR logic)
   *    - Generate JSON string for URL parameter
   *
   * 4. PARAMETER EXTRACTION: Extract individual URL parameters
   *    - For special filters marked with config.param
   *
   * 5. EMISSION: Combine all parameters and call parent callback
   *    - Main table query: {tableId: '{"$and": [...]}'}
   *    - Individual params: {ledger_selected: 'my-ledger'}
   *    - Change detection prevents unnecessary emissions
   *
   * 6. CLEANUP: Clear query when no filters active
   *
   * CRITICAL: Dependencies exclude filterConfig to prevent loops!
   * The filterConfig is used via closure but not in dependency array.
   */
  useEffect(() => {
    const validFilters = getValidConfigurableFilters(filters);

    if (validFilters.length > 0) {
      // STEP 1: Separate filters by type (query vs parameter)
      const { queryFilters } = separateFilters(
        validFilters,
        filterConfigRef.current
      );

      // STEP 2: Build consolidated JSON query from query filters
      const platformQuery = convertConfigurableFiltersToPlatformQuery(
        queryFilters,
        joinOperator
      );
      const queryString =
        platformQuery && Object.keys(platformQuery).length > 0
          ? JSON.stringify(platformQuery)
          : '';

      // STEP 3: Extract individual URL parameters from ALL valid filters
      // This ensures removed parameter filters get cleared from URL
      const urlParams = extractUrlParameters(
        validFilters,
        filterConfigRef.current
      );

      // STEP 4: Combine all parameters for emission
      const allParams = {
        [tableId]: queryString, // Main consolidated query
        ...urlParams, // Individual parameters (including empty ones for cleared filters)
      };

      // STEP 5: Change detection and emission
      const currentStateKey = JSON.stringify(allParams);
      if (lastAppliedQueryRef.current !== currentStateKey) {
        lastAppliedQueryRef.current = currentStateKey;
        onQueryChange?.(allParams);
      }
    } else {
      // STEP 6: Clear query when no filters active
      if (lastAppliedQueryRef.current !== undefined) {
        lastAppliedQueryRef.current = undefined;

        // Extract all parameter-based filter keys and set them to empty string
        // This ensures removed parameter filters get their URL parameters cleared
        const urlParams = extractUrlParameters([], filterConfigRef.current);

        const allParams = {
          [tableId]: '', // Clear main consolidated query
          ...urlParams, // Clear all parameter-based filters
        };

        onQueryChange?.(allParams);
      }
    }
  }, [filters, joinOperator, tableId, onQueryChange]); // Removed filterConfig dependency

  // ============================================================================
  // FILTER MANIPULATION CALLBACKS
  // ============================================================================

  /**
   * ADD NEW FILTER
   *
   * Creates a new filter with the first available field from the config.
   * Sets appropriate default values based on the field's variant type.
   */
  const onFilterAdd = useCallback(() => {
    const firstFieldId = Object.keys(filterConfig)[0];
    if (!firstFieldId) return;

    const fieldConfig = filterConfig[firstFieldId];
    if (!fieldConfig) return;

    const variant = fieldConfig.variant;
    const defaultValue =
      variant === 'metadata' || variant === 'balanceByAsset'
        ? ({ key: '', value: '' } as MetadataFilterValue)
        : '';

    setFilters([
      ...filters,
      {
        id: firstFieldId,
        value: defaultValue,
        variant: variant,
        operator: getDefaultFilterOperatorV2(variant),
        filterId: generateId({ length: 8 }),
      },
    ]);
  }, [filterConfig, filters]);

  /**
   * UPDATE EXISTING FILTER
   *
   * Updates a specific filter by its unique filterId.
   * Used when user changes field, operator, or value.
   */
  const onFilterUpdate = useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ConfigurableColumnFilter, 'filterId'>>
    ) => {
      setFilters((prevFilters) =>
        prevFilters.map((filter) => {
          if (filter.filterId === filterId) {
            return { ...filter, ...updates } as ConfigurableColumnFilter;
          }

          return filter;
        })
      );
    },
    []
  );

  /**
   * REMOVE FILTER
   *
   * Removes a filter by its unique filterId and returns focus to add button.
   * Provides smooth UX during filter removal workflow.
   */
  const onFilterRemove = useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter(
        (filter) => filter.filterId !== filterId
      );

      setFilters(updatedFilters);

      // Return focus to add button for accessibility
      requestAnimationFrame(() => {
        addButtonRef.current?.focus();
      });
    },
    [filters]
  );

  /**
   * RESET ALL FILTERS
   *
   * Comprehensive reset that clears:
   * - All active filters
   * - Join operator (back to "and")
   * - Filter config parameters
   *
   * Calls parent reset handler with appropriate parameters.
   */
  const onFiltersReset = useCallback(() => {
    setFilters([]);
    setJoinOperator('and');

    // Include filter config parameters removal in reset
    const configParams = extractUrlParameters([], filterConfigRef.current);
    onResetFilters?.(configParams);
  }, [onResetFilters]);

  // ============================================================================
  // KEYBOARD SHORTCUTS & ACCESSIBILITY
  // ============================================================================

  /**
   * GLOBAL KEYBOARD SHORTCUTS
   *
   * - Press 'f': Open filter menu
   * - Press 'shift+f': Remove last filter (if any exist)
   *
   * Shortcuts are disabled when typing in input fields.
   */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Press 'f' to open filter menu
      if (
        event.key.toLowerCase() === OPEN_MENU_SHORTCUT &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        event.preventDefault();
        setOpen(true);
      }

      // Press 'shift+f' to remove last filter
      if (
        event.key.toLowerCase() === OPEN_MENU_SHORTCUT &&
        event.shiftKey &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? '');
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filters, onFilterRemove]);

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase()) &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? '');
      }
    },
    [filters, onFilterRemove]
  );

  // ============================================================================
  // RENDER LOGIC
  // ============================================================================

  /**
   * SSR FALLBACK
   *
   * During server-side rendering or before hydration, show a disabled
   * button to prevent layout shift and hydration mismatches.
   */
  if (!isClient) {
    return (
      <Button variant="outlineDashed" size="sm" disabled>
        <Filter className="mr-2 h-4 w-4" />
        <span>Filters</span>
      </Button>
    );
  }

  /**
   * HIDE FILTER COMPONENT IF NO FILTERS CONFIGURED
   *
   * If the filter config is empty (e.g., when moduleVersion < 2.2),
   * don't render the filter component at all.
   */
  if (!hasFilters) {
    return null;
  }

  /**
   * MAIN COMPONENT RENDER
   *
   * The complete filter interface with:
   * - Filter trigger button with count badge
   * - Optional favorites toggle
   * - Comprehensive filter editing popover
   * - Drag-and-drop sortable filter list
   * - Saved filters integration
   * - Query preview dialog
   */
  return (
    <div>
      <Sortable
        value={filters}
        onValueChange={setFilters}
        getItemValue={(item: ConfigurableColumnFilter) => item.filterId}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-2">
            <a
              href={EXTERNAL_LINKS.DOCUMENTATION_FILTERING_SYNTAX.to}
              target={EXTERNAL_LINKS.DOCUMENTATION_FILTERING_SYNTAX.target}
            >
              <Button variant="outline" size="icon-md">
                <BookOpen />
              </Button>
            </a>
            <PopoverTrigger size="sm" asChild>
              <Button
                variant="outlineDashed"
                size="sm"
                onKeyDown={onTriggerKeyDown}
              >
                <Filter className="mr-2 h-4 w-4" />
                <span>Filters</span>
                {filters.length > 0 && (
                  <Badge variant="gold" size="sm" className="ml-2 rounded-sm">
                    {filters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
          </div>

          <PopoverContent
            aria-describedby={descriptionId}
            aria-labelledby={labelId}
            className="flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-3.5 p-4 sm:min-w-[380px]"
            {...props}
          >
            {filters.length === 0 ? (
              // Empty State - matching V1 design
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium">
                    <span>No filters applied</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add filters to refine your results or select a saved filter.
                  </p>
                </div>
                <div className="flex justify-center gap-2 items-center">
                  <Button
                    variant="primary"
                    size="sm"
                    ref={addButtonRef}
                    onClick={onFilterAdd}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add filter</span>
                  </Button>

                  <SaveFilterSelector
                    hook={saveFiltersHook}
                    tableId={tableId}
                    selectedFilter={selectedSavedFilter}
                    onFilterSelect={setSelectedSavedFilter}
                    onSelect={() => setOpen(false)}
                    getCurrentSearchParams={getCurrentSearchParams}
                    onApplySearchParams={onApplySearchParams}
                  />
                </div>
              </div>
            ) : (
              // Active Filters State - matching V1 design
              <div>
                <Label>Where</Label>

                <div className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <SortableContent asChild>
                      <ul className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
                        {filters.map((filter, index) => (
                          <DataTableFilterItem
                            key={filter.filterId}
                            filter={filter}
                            index={index}
                            filterItemId={`${id}-filter-${filter.filterId}`}
                            joinOperator={joinOperator}
                            setJoinOperator={setJoinOperator}
                            columns={columns}
                            filterConfig={filterConfig}
                            onFilterUpdate={onFilterUpdate}
                            onFilterRemove={onFilterRemove}
                          />
                        ))}
                      </ul>
                    </SortableContent>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        ref={addButtonRef}
                        onClick={onFilterAdd}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add filter</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onFiltersReset}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Reset filters
                      </Button>
                    </div>

                    <Dialog
                      open={showQueryDialog}
                      onOpenChange={setShowQueryDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Code className="h-4 w-4 mr-2" />
                          View Query
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>Query Preview</DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-muted-foreground mb-4">
                          Generated query for {filters.length} filter
                          {filters.length !== 1 ? 's' : ''}
                        </div>
                        <div className="overflow-y-auto">
                          <PreviewJson
                            json={currentQuery as Record<string, unknown>}
                            className="min-h-[200px]"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center gap-6">
                  <div>
                    <Label>Saved filters</Label>
                    <p className="text-sm text-muted-foreground">
                      Save your current filters to use them in one click.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-3">
                    <SaveFilterSelector
                      hook={saveFiltersHook}
                      tableId={tableId}
                      selectedFilter={selectedSavedFilter}
                      onFilterSelect={setSelectedSavedFilter}
                      onSelect={() => setOpen(false)}
                      getCurrentSearchParams={getCurrentSearchParams}
                      onApplySearchParams={onApplySearchParams}
                    />
                    <SaveFilterForm
                      hook={saveFiltersHook}
                      tableId={tableId}
                      disabled={filters.length === 0}
                      onFilterSaved={setSelectedSavedFilter}
                      getCurrentSearchParams={getCurrentSearchParams}
                    />
                  </div>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <SortableOverlay>
          <div className="flex items-center gap-2">
            <div className="h-8 min-w-[72px] rounded-sm bg-primary/10" />
            <div className="h-8 w-32 rounded-sm bg-primary/10" />
            <div className="h-8 w-32 rounded-sm bg-primary/10" />
            <div className="h-8 min-w-36 flex-1 rounded-sm bg-primary/10" />
            <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
            <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
          </div>
        </SortableOverlay>
      </Sortable>
    </div>
  );
}

type TDataTableFilterItemV2 = {
  filter: ConfigurableColumnFilter;
  index: number;
  filterItemId: string;
  joinOperator: JoinOperatorV2;
  setJoinOperator: (value: JoinOperatorV2) => void;
  columns: FilterableColumn[];
  filterConfig: FilterConfig;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ConfigurableColumnFilter, 'filterId'>>
  ) => void;
  onFilterRemove: (filterId: string) => void;
};

function DataTableFilterItem({
  filter,
  index,
  filterItemId,
  joinOperator,
  setJoinOperator,
  columns,
  filterConfig,
  onFilterUpdate,
  onFilterRemove,
}: TDataTableFilterItemV2) {
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = useState(false);
  const [showValueSelector, setShowValueSelector] = useState(false);

  const column = columns.find((column) => column.id === filter.id);

  // Safe ID generation
  const safeFilterItemId = filterItemId || `filter-item-${index}`;
  const joinOperatorListboxId = `${safeFilterItemId}-join-operator-listbox`;
  const fieldListboxId = `${safeFilterItemId}-field-listbox`;
  const operatorListboxId = `${safeFilterItemId}-operator-listbox`;
  const inputId = `${safeFilterItemId}-input`;

  const fieldConfig = filterConfig[filter.id];
  const filterOperators =
    fieldConfig?.operators || getFilterOperatorsV2(filter.variant);

  const onItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showFieldSelector || showOperatorSelector || showValueSelector) {
        return;
      }

      if (REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase())) {
        event.preventDefault();
        onFilterRemove(filter.filterId);
      }
    },
    [
      filter.filterId,
      showFieldSelector,
      showOperatorSelector,
      showValueSelector,
      onFilterRemove,
    ]
  );

  if (!column) return null;

  return (
    <SortableItem value={filter.filterId} asChild>
      <li
        id={safeFilterItemId}
        tabIndex={-1}
        className="flex items-center gap-2"
        onKeyDown={onItemKeyDown}
      >
        <div className="min-w-[72px] text-center">
          {index === 0 ? (
            <span className="text-muted-foreground text-sm">Where</span>
          ) : index === 1 ? (
            <Select
              value={joinOperator}
              onValueChange={(value: JoinOperatorV2) => setJoinOperator(value)}
            >
              <SelectTrigger
                aria-label="Select join operator"
                aria-controls={joinOperatorListboxId}
                className="h-8 rounded lowercase [&[data-size]]:h-8"
              >
                <SelectValue placeholder={joinOperator} />
              </SelectTrigger>
              <SelectContent
                id={joinOperatorListboxId}
                position="popper"
                className="min-w-(--radix-select-trigger-width) lowercase"
              >
                {dataTableV2Config.joinOperators.map((joinOperator) => (
                  <SelectItem key={joinOperator} value={joinOperator}>
                    {joinOperator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-muted-foreground text-sm">
              {joinOperator}
            </span>
          )}
        </div>
        <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
          <PopoverTrigger size="sm" asChild>
            <Button
              aria-controls={fieldListboxId}
              variant="outline"
              size="sm"
              className="w-44 justify-between rounded font-normal"
            >
              <span className="truncate">
                {filterConfig[filter.id]?.label ?? 'Select field'}
              </span>
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={fieldListboxId}
            align="start"
            className="origin-[var(--radix-popover-content-transform-origin)] p-0"
          >
            <Command>
              <CommandInput placeholder="Search fields..." />
              <CommandList>
                <CommandEmpty>No fields found.</CommandEmpty>
                <CommandGroup>
                  {Object.entries(filterConfig).map(
                    ([fieldId, fieldConfig]) => (
                      <CommandItem
                        key={fieldId}
                        value={fieldId}
                        onSelect={(value) => {
                          const variant = fieldConfig.variant;
                          const defaultValue =
                            variant === 'metadata' ||
                            variant === 'balanceByAsset'
                              ? ({ key: '', value: '' } as MetadataFilterValue)
                              : '';

                          onFilterUpdate(filter.filterId, {
                            id: value,
                            variant: variant,
                            operator: getDefaultFilterOperatorV2(variant),
                            value: defaultValue,
                          });

                          setShowFieldSelector(false);
                        }}
                      >
                        <span className="truncate">{fieldConfig.label}</span>
                        <Check
                          className={cn(
                            'ml-auto',
                            fieldId === filter.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* Hide operator selector for boolean and dateRange filters since they have fixed operators */}
        {fieldConfig?.variant !== 'boolean' &&
          fieldConfig?.variant !== 'dateRange' && (
            <Select
              open={showOperatorSelector}
              onOpenChange={setShowOperatorSelector}
              value={filter.operator}
              onValueChange={(value: FilterOperatorV2) =>
                onFilterUpdate(filter.filterId, {
                  operator: value,
                  value:
                    value === 'isEmpty' || value === 'isNotEmpty'
                      ? ''
                      : filter.value,
                })
              }
            >
              <SelectTrigger
                aria-controls={operatorListboxId}
                className="h-8 w-32 rounded lowercase [&[data-size]]:h-8"
              >
                <div className="truncate">
                  <SelectValue placeholder={filter.operator} />
                </div>
              </SelectTrigger>
              <SelectContent
                id={operatorListboxId}
                className="origin-[var(--radix-select-content-transform-origin)]"
              >
                {filterOperators.map((operator) => (
                  <SelectItem
                    key={operator.value}
                    value={operator.value}
                    className="lowercase"
                  >
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        <div className="min-w-36 flex-1">
          <FilterInputRendererV2
            filter={filter}
            inputId={inputId}
            fieldConfig={fieldConfig}
            onFilterUpdate={onFilterUpdate}
            showValueSelector={showValueSelector}
            setShowValueSelector={setShowValueSelector}
          />
        </div>
        <Button
          aria-controls={safeFilterItemId}
          variant="outline"
          size="icon-sm"
          className="size-8 rounded"
          onClick={() => onFilterRemove(filter.filterId)}
        >
          <Trash2 />
        </Button>
        <SortableItemHandle asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="size-8 rounded cursor-grab"
            aria-label="Drag to reorder filter"
          >
            <GripVertical />
          </Button>
        </SortableItemHandle>
      </li>
    </SortableItem>
  );
}

interface FilterInputRendererV2Props {
  filter: ConfigurableColumnFilter;
  inputId: string;
  fieldConfig?: import('./types').FilterFieldConfig;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ConfigurableColumnFilter, 'filterId'>>
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
}

function FilterInputRendererV2({
  filter,
  inputId,
  fieldConfig,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}: FilterInputRendererV2Props) {
  if (filter.operator === 'isEmpty' || filter.operator === 'isNotEmpty') {
    return (
      <div
        id={inputId}
        role="status"
        aria-label={`${fieldConfig?.label} filter is ${
          filter.operator === 'isEmpty' ? 'empty' : 'not empty'
        }`}
        aria-live="polite"
        className="h-8 w-full rounded border bg-transparent dark:bg-input/30"
      />
    );
  }

  switch (filter.variant) {
    case 'text':
    case 'number': {
      const isNumber = filter.variant === 'number';

      return (
        <Input
          id={inputId}
          type={isNumber ? 'number' : filter.variant}
          aria-label={`${fieldConfig?.label} filter value`}
          aria-describedby={`${inputId}-description`}
          size="sm"
          inputMode={isNumber ? 'numeric' : undefined}
          placeholder={fieldConfig?.placeholder ?? 'Enter a value...'}
          min={fieldConfig?.min}
          max={fieldConfig?.max}
          step={fieldConfig?.step}
          defaultValue={
            typeof filter.value === 'string' ? filter.value : undefined
          }
          onChange={(event) =>
            onFilterUpdate(filter.filterId, {
              value: event.target.value,
            })
          }
        />
      );
    }

    case 'boolean': {
      if (Array.isArray(filter.value) || typeof filter.value === 'object')
        return null;

      // Handle both string and boolean values
      const isChecked =
        typeof filter.value === 'boolean'
          ? filter.value
          : filter.value === 'true';

      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={inputId}
            checked={isChecked}
            onCheckedChange={(checked) =>
              onFilterUpdate(filter.filterId, {
                value: checked ? 'true' : 'false',
              })
            }
            aria-label={`${fieldConfig?.label} boolean filter`}
          />
          <Label htmlFor={inputId} className="text-sm">
            {isChecked ? 'True' : 'False'}
          </Label>
        </div>
      );
    }

    case 'select':
    case 'multiSelect': {
      const inputListboxId = `${inputId}-listbox`;

      const multiple = filter.variant === 'multiSelect';
      const selectedValues = multiple
        ? Array.isArray(filter.value)
          ? filter.value
          : []
        : typeof filter.value === 'string'
        ? filter.value
        : undefined;

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger size="sm" asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              aria-label={`${fieldConfig?.label} filter value${
                multiple ? 's' : ''
              }`}
              variant="outline"
              size="sm"
              className="w-full rounded font-normal"
            >
              {Array.isArray(selectedValues) && selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : selectedValues
                ? selectedValues
                : fieldConfig?.placeholder ??
                  `Select option${multiple ? 's' : ''}...`}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={inputListboxId}
            className="origin-[var(--radix-popover-content-transform-origin)] p-0"
          >
            <Command>
              <CommandInput
                placeholder={fieldConfig?.placeholder ?? 'Search options...'}
              />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {fieldConfig?.options?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        const value =
                          filter.variant === 'multiSelect'
                            ? Array.isArray(selectedValues)
                              ? selectedValues.includes(option.value)
                                ? selectedValues.filter(
                                    (v) => v !== option.value
                                  )
                                : [...selectedValues, option.value]
                              : [option.value]
                            : option.value;
                        onFilterUpdate(filter.filterId, { value });
                      }}
                    >
                      {option.icon && <option.icon />}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                      {filter.variant === 'multiSelect' && (
                        <Check
                          className={cn(
                            'ml-auto',
                            Array.isArray(selectedValues) &&
                              selectedValues.includes(option.value)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    case 'date': {
      const inputListboxId = `${inputId}-listbox`;

      const dateValue = Array.isArray(filter.value)
        ? filter.value.filter(Boolean)
        : [filter.value, filter.value].filter(Boolean);

      const displayValue =
        filter.operator === 'isBetween' && dateValue.length === 2
          ? `${formatDate(new Date(String(dateValue[0])))} - ${formatDate(
              new Date(String(dateValue[1]))
            )}`
          : dateValue[0]
          ? formatDate(new Date(String(dateValue[0])))
          : 'Pick a date';

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger size="sm" asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              aria-label={`${fieldConfig?.label} date filter`}
              variant="outline"
              size="sm"
              className={cn(
                'w-full justify-start rounded text-left font-normal',
                !filter.value && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">{displayValue}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={inputListboxId}
            align="start"
            className="w-auto origin-[var(--radix-popover-content-transform-origin)] p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {filter.operator === 'isBetween' ? (
              <Calendar
                aria-label={`Select ${fieldConfig?.label} date range`}
                mode="range"
                captionLayout="dropdown"
                selected={
                  dateValue.length === 2
                    ? {
                        from: new Date(String(dateValue[0])),
                        to: new Date(String(dateValue[1])),
                      }
                    : {
                        from: new Date(),
                        to: new Date(),
                      }
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value:
                      date && date.from && date.to
                        ? [date.from.toISOString(), date.to.toISOString()]
                        : [],
                  });
                  // Close popover when both dates are selected
                  if (date && date.from && date.to) {
                    setTimeout(() => {
                      setShowValueSelector(false);
                    }, 100);
                  }
                }}
              />
            ) : (
              <Calendar
                aria-label={`Select ${fieldConfig?.label} date`}
                mode="single"
                captionLayout="dropdown"
                selected={
                  dateValue[0] ? new Date(String(dateValue[0])) : undefined
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date ? date.toISOString() : '',
                  });
                  // For single date selection, close popover immediately after selection
                  setTimeout(() => {
                    setShowValueSelector(false);
                  }, 100);
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      );
    }

    case 'metadata':
    case 'balanceByAsset': {
      const metadataValue =
        typeof filter.value === 'object' &&
        filter.value !== null &&
        'key' in filter.value &&
        'value' in filter.value
          ? (filter.value as MetadataFilterValue)
          : { key: '', value: '' };

      return (
        <div className="flex gap-2 w-full">
          <Input
            id={`${inputId}-key`}
            type="text"
            aria-label={`${fieldConfig?.label} key`}
            size="sm"
            placeholder={
              fieldConfig?.placeholderKey ??
              (filter.variant === 'balanceByAsset'
                ? 'Enter asset...'
                : 'Enter key...')
            }
            value={metadataValue.key}
            onChange={(event) => {
              const newValue: MetadataFilterValue = {
                key: event.target.value,
                value: metadataValue.value,
              };
              onFilterUpdate(filter.filterId, {
                value: newValue,
              });
            }}
            className="flex-1"
          />
          <Input
            id={`${inputId}-value`}
            type={filter.variant === 'balanceByAsset' ? 'number' : 'text'}
            step={filter.variant === 'balanceByAsset' ? 'any' : undefined}
            aria-label={`${fieldConfig?.label} value`}
            size="sm"
            placeholder={
              fieldConfig?.placeholderValue ??
              (filter.variant === 'balanceByAsset'
                ? 'Enter amount...'
                : 'Enter value...')
            }
            value={metadataValue.value}
            onChange={(event) => {
              const newValue: MetadataFilterValue = {
                key: metadataValue.key,
                value: event.target.value,
              };
              onFilterUpdate(filter.filterId, {
                value: newValue,
              });
            }}
            className="flex-1"
          />
        </div>
      );
    }

    case 'slider': {
      // Get min/max from config, fallback to range, then defaults
      const min = fieldConfig?.min ?? fieldConfig?.range?.[0] ?? 0;
      const max = fieldConfig?.max ?? fieldConfig?.range?.[1] ?? 100;
      const step = fieldConfig?.step ?? 1;

      // Handle different slider modes based on operator
      const isRangeMode = filter.operator === 'isBetween';

      if (isRangeMode) {
        // Range mode: Handle slider values as array [min, max]
        const sliderValue = Array.isArray(filter.value)
          ? filter.value.map((v) => Number(v)).filter((v) => !isNaN(v))
          : [];

        // Default to the full range if no value set
        const currentValue =
          sliderValue.length === 2
            ? (sliderValue as [number, number])
            : ([min, max] as [number, number]);

        return (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {currentValue[0]}
                {fieldConfig?.unit ? ` ${fieldConfig.unit}` : ''}
              </span>
              <span>
                {currentValue[1]}
                {fieldConfig?.unit ? ` ${fieldConfig.unit}` : ''}
              </span>
            </div>
            <Slider
              id={inputId}
              min={min}
              max={max}
              step={step}
              value={currentValue}
              onValueChange={(value) => {
                onFilterUpdate(filter.filterId, {
                  value: value.map((v) => v.toString()),
                });
              }}
              aria-label={`${fieldConfig?.label} range filter`}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {min}
                {fieldConfig?.unit ? ` ${fieldConfig.unit}` : ''}
              </span>
              <span>
                {max}
                {fieldConfig?.unit ? ` ${fieldConfig.unit}` : ''}
              </span>
            </div>
          </div>
        );
      } else {
        // Single value mode: Handle as single value for "eq" operator
        const singleValue =
          Array.isArray(filter.value) && filter.value.length > 0
            ? Number(filter.value[0])
            : typeof filter.value === 'string' ||
              typeof filter.value === 'number'
            ? Number(filter.value)
            : min;

        const currentValue = isNaN(singleValue) ? min : singleValue;

        return (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-center text-sm font-medium">
              {currentValue}
              {fieldConfig?.unit ? ` ${fieldConfig.unit}` : ''}
            </div>
            <Slider
              id={inputId}
              min={min}
              max={max}
              step={step}
              value={[currentValue]}
              onValueChange={(value) => {
                onFilterUpdate(filter.filterId, {
                  value: value[0]?.toString() || min.toString(),
                });
              }}
              aria-label={`${fieldConfig?.label} value filter`}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {min}
                {fieldConfig?.unit ? ` ${fieldConfig.unit}` : ''}
              </span>
              <span>
                {max}
                {fieldConfig?.unit ? ` ${fieldConfig.unit}` : ''}
              </span>
            </div>
          </div>
        );
      }
    }

    case 'dateRange': {
      // Parse the stored value as a date range
      let dateRange: DateRange | undefined;

      try {
        if (typeof filter.value === 'string' && filter.value) {
          const parsed = JSON.parse(filter.value);
          if (parsed.from && parsed.to) {
            dateRange = {
              from: new Date(parsed.from),
              to: new Date(parsed.to),
            };
          }
        }
      } catch (error) {
        // If parsing fails, use undefined to show no selection
        dateRange = undefined;
      }

      return (
        <DateRangePicker
          initialDateFrom={dateRange?.from}
          initialDateTo={dateRange?.to}
          showCompare={false}
          onUpdate={({ range }) => {
            // Store the date range as a JSON string
            const rangeValue = JSON.stringify({
              from: range.from.toISOString(),
              to: range.to?.toISOString() || range.from.toISOString(),
            });

            onFilterUpdate(filter.filterId, {
              value: rangeValue,
              operator: 'dateRange', // Ensure we set the correct operator
            });
          }}
        />
      );
    }

    default:
      return null;
  }
}
