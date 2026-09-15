import { EventCategory } from '../types';

export interface CategoryTheme {
  id: EventCategory;
  label: string;
  badgeClass: string;
  dotColor: string;
}

export function getCategoryTheme(category: string): {
  badgeClass: string;
  colorClass: string;
  dotBg: string;
  name: string;
} {
  const norm = category.toLowerCase();
  if (norm === 'festivals') {
    return {
      badgeClass: 'border-theme-terracotta/40 text-theme-terracotta bg-theme-terracotta/10',
      colorClass: 'text-theme-terracotta',
      dotBg: 'bg-[#B84A39]',
      name: 'Festival',
    };
  }
  if (norm === 'theatre') {
    return {
      badgeClass: 'border-[#8E2838]/40 dark:border-[#E06D80]/40 text-[#8E2838] dark:text-[#E06D80] bg-[#8E2838]/10 dark:bg-[#E06D80]/10',
      colorClass: 'text-[#8E2838] dark:text-[#E06D80]',
      dotBg: 'bg-[#8E2838]',
      name: 'Theatre',
    };
  }
  if (norm === 'sports') {
    return {
      badgeClass: 'border-[#3C6E47]/40 dark:border-[#68B678]/40 text-[#3C6E47] dark:text-[#68B678] bg-[#3C6E47]/10 dark:bg-[#68B678]/10',
      colorClass: 'text-[#3C6E47] dark:text-[#68B678]',
      dotBg: 'bg-[#3C6E47]',
      name: 'Polo & Equine',
    };
  }
  // concerts / default
  return {
    badgeClass: 'border-theme-accent/40 text-theme-accent bg-theme-accent/10',
    colorClass: 'text-theme-accent',
    dotBg: 'bg-theme-accent',
    name: 'Concert',
  };
}
