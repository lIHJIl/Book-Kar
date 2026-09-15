import React from 'react';
import { Ticket } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-theme-border bg-theme-surface mt-20 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-theme-accent text-white dark:text-[#111110]">
                <Ticket className="h-3 w-3" strokeWidth={1.5} />
              </div>
              <span className="font-display text-base tracking-tight font-medium text-theme-ink">
                Book_kar<span className="text-theme-accent font-semibold">.</span>
              </span>
            </div>
            <p className="text-xs text-theme-muted">
              Ticketing architecture for fort amphitheatres, palace courtyards, polo grounds, and heritage stages across India.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-theme-muted">
            <span>Direct guest checkout</span>
            <span>Heritage preservation fund</span>
            <span>Official digital pass entry</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
