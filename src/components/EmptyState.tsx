import React from 'react';
import { motion } from 'motion/react';
import { Compass, Ticket, Sparkles } from 'lucide-react';
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
      {/* Ornate Rajasthani Line-Art Icon Motif */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mx-auto mb-6 flex flex-col items-center justify-center"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[2px] border border-theme-border bg-theme-surface/70 shadow-xs">
          {/* Subtle jali corner notches */}
          <span className="absolute top-1 left-1 h-1 w-1 border-t border-l border-theme-accent/60" />
          <span className="absolute top-1 right-1 h-1 w-1 border-t border-r border-theme-accent/60" />
          <span className="absolute bottom-1 left-1 h-1 w-1 border-b border-l border-theme-accent/60" />
          <span className="absolute bottom-1 right-1 h-1 w-1 border-b border-r border-theme-accent/60" />

          <Ticket className="h-7 w-7 text-theme-accent rotate-[-12deg]" strokeWidth={1.25} />
          <Compass className="absolute -bottom-1 -right-1 h-5 w-5 text-theme-terracotta bg-theme-surface rounded-full p-0.5 border border-theme-border" strokeWidth={1.5} />
        </div>
      </motion.div>

      <div className="space-y-3">
        <h3 className="font-display text-2xl font-normal text-theme-ink">
          No performances found
        </h3>
        <p className="font-body text-sm text-theme-muted leading-relaxed max-w-md mx-auto">
          {query
            ? `No scheduled fixtures match "${query}". Try adjusting your search or explore the complete Rajasthan cultural season.`
            : 'There are currently no scheduled fixtures in this category. Check upcoming seasonal announcements.'}
        </p>
        <div className="pt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-xl border border-theme-border bg-theme-surface px-6 py-2.5 text-xs font-medium text-theme-ink hover:border-theme-accent hover:text-theme-accent transition-all shadow-xs"
          >
            Clear filters and view all
          </motion.button>
        </div>
      </div>
    </div>
  );
};

