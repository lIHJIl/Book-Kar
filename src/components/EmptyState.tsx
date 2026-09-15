import React from 'react';
import { useBooking } from '../context/BookingContext';

interface EmptyStateProps {
  query?: string;
  category?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ query }) => {
  const { setSearchQuery, setCategoryFilter } = useBooking();

  const handleReset = () => {
    setSearchQuery('');
    setCategoryFilter('all');
  };

  return (
    <div className="mx-auto max-w-lg py-20 px-4 text-center">
      <div className="space-y-3">
        <h3 className="font-display text-2xl font-normal text-theme-ink">
          No performances found
        </h3>
        <p className="font-body text-sm text-theme-muted leading-relaxed">
          {query
            ? `No scheduled events match "${query}". Try adjusting your keywords or browse all categories.`
            : 'There are currently no scheduled events in this category. Check upcoming seasonal announcements.'}
        </p>
        <div className="pt-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 text-xs font-medium text-theme-ink hover:border-theme-accent transition-colors"
          >
            Clear filters and view all
          </button>
        </div>
      </div>
    </div>
  );
};
