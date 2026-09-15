import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sun, Moon, ArrowLeft, Ticket, Sparkles } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-theme-border bg-theme-bg/95 backdrop-blur-sm transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Contextual Navigation */}
        <div className="flex items-center gap-6">
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
                <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-theme-border bg-theme-surface/80 px-2 py-0.5 text-[10px] text-theme-muted">
                  <Sparkles className="h-2.5 w-2.5 text-theme-accent animate-pulse" strokeWidth={1.5} />
                  Rajasthan Edition
                </span>
              </div>
            </motion.button>
          )}
        </div>

        {/* Global Search Input */}
        <div className="flex flex-1 max-w-md mx-4 sm:mx-8">
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

        {/* Controls: Theme & Running Cart / Checkout */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {currentScreen === 'detail' && ticketCount > 0 && (
              <motion.button
                initial={{ scale: 0.85, opacity: 0, y: -4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={proceedToCheckout}
                className="inline-flex items-center gap-2 rounded-xl bg-theme-accent px-3.5 py-1.5 text-sm font-medium text-white dark:text-[#111110] shadow-sm hover:opacity-95 transition-all"
              >
                <span>{ticketCount} {ticketCount === 1 ? 'pass' : 'passes'}</span>
                <span className="opacity-50">|</span>
                <span>Checkout</span>
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
    </header>
  );
};
