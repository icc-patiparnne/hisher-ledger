'use client';

import { Favorite } from '../../app';

/**
 * DataTableFavoriteFilter - Favorites Toggle Component
 *
 * PURPOSE:
 * - Provides a dedicated component for toggling favorites view in data tables
 * - Handles favorites state management and URL parameter updates
 * - Can be used independently of the main filter system
 *
 * KEY FEATURES:
 * - Simple toggle interface with heart icon
 * - URL parameter synchronization
 * - Accessible with proper ARIA labels
 * - Integrates with existing Favorite component
 *
 * USAGE:
 * - Place alongside DataTableFilterList in toolbar
 * - Pass favorites state and change handler
 * - Specify the URL parameter name for favorites
 */

interface DataTableFavoriteFilterProps {
  // Favorites state
  favoritesPressed?: boolean; // Current state of favorites toggle
  onFavoritesChange?: (pressed: boolean) => void; // Callback when favorites toggle changes
  favoritesParameterName?: string; // URL parameter name for favorites (e.g., 'ledgers_favorites')

  // Optional customization
  ariaLabel?: string; // Custom aria-label for accessibility
  className?: string; // Additional CSS classes
}

export function DataTableFavoriteFilter({
  favoritesPressed = false,
  onFavoritesChange,
  favoritesParameterName,
  ariaLabel = 'Show only favorites',
  className,
}: DataTableFavoriteFilterProps) {
  /**
   * HANDLE FAVORITES TOGGLE
   *
   * Updates both the local state and URL parameter when favorites toggle changes.
   * This ensures the favorites state is persisted in the URL for deep linking.
   */
  const handleFavoritesToggle = (pressed: boolean) => {
    // Update local state
    onFavoritesChange?.(pressed);

    // Update URL parameter if parameter name is provided
    if (favoritesParameterName && typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);

      if (pressed) {
        currentParams.set(favoritesParameterName, 'true');
      } else {
        currentParams.delete(favoritesParameterName);
      }

      // Update URL without triggering navigation
      const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
      window.history.pushState(null, '', newUrl);

      // Dispatch event to notify other components of URL changes
      window.dispatchEvent(new Event('urlchange'));
    }
  };

  return (
    <Favorite
      isFavorite={favoritesPressed}
      setIsFavorite={handleFavoritesToggle}
      aria-label={ariaLabel}
      className={className}
    />
  );
}
