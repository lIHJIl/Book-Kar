import React from 'react';
import { motion } from 'motion/react';
import { EventCategory } from '../types';
import { useCatalog } from '../context/CatalogContext';

const CATEGORIES: { id: EventCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All programs' },
  { id: 'concerts', label: 'Concerts' },
  { id: 'theatre', label: 'Theatre' },
  { id: 'sports', label: 'Sports' },
  { id: 'festivals', label: 'Festivals' },
];

export const CategoryTicker: React.FC = () => {
  const { categoryFilter, setCategoryFilter } = useCatalog();

  return (
    <div className="w-full border-b border-theme-border bg-theme-bg overflow-x-auto scrollbar-none">
      <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 py-2">
          {CATEGORIES.map((cat) => {
            const isActive = categoryFilter === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                className={`relative px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus:outline-none rounded-[2px] ${
                  isActive
                    ? 'text-theme-ink'
                    : 'text-theme-muted hover:text-theme-ink'
                }`}
              >
                <span className="relative z-10">{cat.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="category-active-bar"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-theme-accent"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
