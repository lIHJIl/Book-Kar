import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sun, Moon, ArrowLeft, Ticket, Sparkles, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    backToDiscovery,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    ticketCount,
    proceedToCheckout,
  } = useBooking();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-theme-border bg-theme-bg/98 shadow-xs transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Contextual Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          {currentScreen !== 'discovery' ? (
            <motion.button
              onClick={backToDiscovery}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 text-sm text-theme-muted hover:text-theme-ink focus:outline-none transition-colors"
              aria-label="Return to event directory"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
              <span className="font-body font-medium">All events</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={backToDiscovery}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 text-left focus:outline-none"
              aria-label="Book_kar. home"
            >
              <motion.div
                whileHover={{ rotate: [-2, 2, -1, 0] }}
                transition={{ duration: 0.4 }}
                className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-theme-accent text-white dark:text-[#111110] shadow-sm"
              >
                <Ticket className="h-4 w-4" strokeWidth={1.5} />
              </motion.div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl tracking-tight font-medium text-theme-ink">
                  Book_kar<span className="text-theme-accent font-semibold">.</span>
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 rounded-[2px] border border-theme-border bg-theme-surface/80 px-2 py-0.5 text-[10px] text-theme-muted">
                  <Sparkles className="h-2.5 w-2.5 text-theme-accent animate-pulse" strokeWidth={1.5} />
                  Rajasthan Edition
                </span>
              </div>
            </motion.button>
          )}
        </div>

        {/* Desktop Search Input (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 lg:mx-8">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-theme-muted">
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forts, baithaks, ghazals, venues..."
              className="w-full rounded-xl border border-theme-border bg-theme-surface py-2 pl-9 pr-4 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-theme-muted hover:text-theme-ink focus:outline-none"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Controls: Mobile Search Trigger, Theme & Running Cart / Checkout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-ink hover:border-theme-accent focus:outline-none transition-colors"
            aria-label="Toggle search bar"
          >
            {isMobileSearchOpen ? (
              <X className="h-4 w-4 text-theme-ink" strokeWidth={1.5} />
            ) : (
              <Search className="h-4 w-4 text-theme-ink" strokeWidth={1.5} />
            )}
          </motion.button>

          <AnimatePresence>
            {currentScreen === 'detail' && ticketCount > 0 && (
              <motion.button
                initial={{ scale: 0.85, opacity: 0, y: -4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={proceedToCheckout}
                className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-3 py-1.5 text-xs sm:text-sm font-medium text-white dark:text-[#111110] shadow-sm hover:opacity-95 transition-all"
              >
                <span>{ticketCount} {ticketCount === 1 ? 'pass' : 'passes'}</span>
                <span className="opacity-50 hidden sm:inline">|</span>
                <span className="hidden sm:inline">Checkout</span>
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ rotate: 180, scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-ink hover:border-theme-accent focus:outline-none transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light atmosphere' : 'Switch to dark atmosphere'}
            title={theme === 'dark' ? 'Switch to light atmosphere' : 'Switch to dark atmosphere'}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4" strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4" strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Collapsible Search Sheet/Bar */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="md:hidden border-t border-theme-border bg-theme-surface px-4 py-3 shadow-md overflow-hidden"
          >
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-theme-muted">
                <Search className="h-4 w-4 text-theme-accent" strokeWidth={1.5} />
              </div>
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setIsMobileSearchOpen(false);
                  }
                }}
                placeholder="Search forts, baithaks, ghazals, venues..."
                className="w-full rounded-xl border border-theme-border bg-theme-bg py-2 pl-9 pr-14 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-theme-muted hover:text-theme-ink px-1 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
