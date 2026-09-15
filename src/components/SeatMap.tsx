import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Seat, SeatSection, SeatTier } from '../types';
import { useBooking } from '../context/BookingContext';

interface SeatMapProps {
  sections: SeatSection[];
  tiers?: SeatTier[];
}

export const SeatMap: React.FC<SeatMapProps> = ({ sections, tiers }) => {
  const { selectedSeats, toggleSeat, inlineError } = useBooking();
  const shouldReduceMotion = useReducedMotion();
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  const isSeatSelected = (seatId: string) => selectedSeats.some((s) => s.id === seatId);

  return (
    <div className="w-full space-y-8">
      {/* Tier Price Legend */}
      {tiers && tiers.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 border-b border-theme-border pb-4 text-xs">
          <span className="text-theme-muted font-medium">Pricing tiers:</span>
          {tiers.map((tier) => (
            <div key={tier.id} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-theme-accent" />
              <span className="text-theme-ink font-medium">{tier.name}</span>
              <span className="font-mono text-theme-muted">₹{tier.price.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stage / Performance Axis Indicator */}
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="mx-auto h-1.5 w-3/4 rounded-full bg-theme-accent/60 shadow-[0_0_12px_rgba(199,160,107,0.3)]"
        />
        <span className="mt-2 block text-xs tracking-widest text-theme-muted font-mono uppercase">
          Stage / Mehrangarh Ramparts / Performance Axis
        </span>
      </div>

      {/* Inline Specific Error Notice if triggered */}
      {inlineError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="rounded-[2px] border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-700 dark:text-red-400"
        >
          {inlineError}
        </motion.div>
      )}

      {/* Sections and Interactive Rows */}
      <div className="space-y-8 overflow-x-auto pb-4">
        {sections.map((section) => (
          <div
            key={section.name}
            className="rounded-[2px] border border-theme-border bg-theme-surface/50 p-4 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between border-b border-theme-border/60 pb-2">
              <h4 className="text-xs font-medium uppercase tracking-wider text-theme-muted font-mono">
                {section.name}
              </h4>
              <span className="text-xs text-theme-muted">
                Standard rows
              </span>
            </div>

            <div className="space-y-3 min-w-[320px]">
              {section.rows.map((rowItem) => (
                <div key={rowItem.row} className="flex items-center gap-3">
                  {/* Row Identifier */}
                  <span className="w-5 text-center text-xs font-semibold text-theme-muted font-mono">
                    {rowItem.row}
                  </span>

                  {/* Seats across row */}
                  <div className="flex flex-1 items-center justify-center gap-1.5 sm:gap-2">
                    {rowItem.seats.map((seat: Seat) => {
                      const selected = isSeatSelected(seat.id);
                      const isSold = seat.status === 'sold';

                      return (
                        <div key={seat.id} className="relative">
                          <motion.button
                            type="button"
                            disabled={isSold}
                            onClick={() => toggleSeat(seat)}
                            onMouseEnter={() => setHoveredSeat(seat)}
                            onMouseLeave={() => setHoveredSeat(null)}
                            aria-label={`Row ${seat.row} Seat ${seat.number}, ₹${seat.price.toLocaleString('en-IN')}, ${
                              isSold ? 'Sold out' : selected ? 'Selected' : 'Available'
                            }`}
                            aria-pressed={selected}
                            whileHover={isSold ? undefined : { scale: 1.18, y: -2 }}
                            whileTap={isSold ? undefined : { scale: 0.86 }}
                            animate={
                              shouldReduceMotion
                                ? undefined
                                : selected
                                ? { scale: [0.92, 1.12, 1] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className={`relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[2px] text-xs font-mono transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-theme-accent ${
                              isSold
                                ? 'cursor-not-allowed bg-theme-border/30 text-theme-muted/40'
                                : selected
                                ? 'bg-theme-accent text-white dark:text-[#111110] font-bold shadow-md shadow-theme-accent/20'
                                : 'border border-theme-border bg-theme-surface text-theme-ink hover:border-theme-accent'
                            }`}
                          >
                            <span>{seat.number}</span>
                            {isSold && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span className="h-[1px] w-full rotate-45 bg-theme-muted/40" />
                              </span>
                            )}
                          </motion.button>

                          {/* Hover Tooltip */}
                          <AnimatePresence>
                            {hoveredSeat?.id === seat.id && !isSold && (
                              <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                                transition={{ duration: 0.15 }}
                                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 whitespace-nowrap rounded-[2px] border border-theme-border bg-theme-ink px-2 py-1 text-[11px] font-mono text-theme-bg shadow-lg"
                              >
                                Row {seat.row}-{seat.number} • ₹{seat.price.toLocaleString('en-IN')}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  <span className="w-5 text-center text-xs font-semibold text-theme-muted font-mono">
                    {rowItem.row}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Map State Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-theme-muted">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-[2px] border border-theme-border bg-theme-surface" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-[2px] bg-theme-accent" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative h-4 w-4 rounded-[2px] bg-theme-border/40">
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-[1px] w-full rotate-45 bg-theme-muted/50" />
            </span>
          </span>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};
