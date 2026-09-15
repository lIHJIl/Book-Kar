import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { EventCategory, EventItem } from '../types';
import { mockEvents } from '../data/events';

interface CatalogContextType {
  events: EventItem[];
  categoryFilter: EventCategory | 'all';
  setCategoryFilter: (category: EventCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events] = useState<EventItem[]>(mockEvents);
  const [categoryFilter, setCategoryFilterState] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQueryState] = useState('');

  const setCategoryFilter = useCallback((category: EventCategory | 'all') => {
    setCategoryFilterState(category);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const value = useMemo(
    () => ({
      events,
      categoryFilter,
      setCategoryFilter,
      searchQuery,
      setSearchQuery,
    }),
    [events, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = (): CatalogContextType => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
