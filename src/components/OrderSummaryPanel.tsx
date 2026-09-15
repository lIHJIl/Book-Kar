import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBooking } from '../context/BookingContext';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export const OrderSummaryPanel: React.FC = () => {
  const {
    activeEvent,
    selectedSeats,
    gaQuantities,
    ticketCount,
    subtotal,
    bookingFee,
    total,
    proceedToCheckout,
  } = useBooking();

  if (!activeEvent) return null;

  return (
    <aside className="w-full lg:w-80 xl:w-96 rounded-[2px] border border-theme-border bg-theme-surface p-5 sm:p-6 lg:sticky lg:top-24 flex flex-col justify-between shadow-xs">
      <div className="space-y-5">
        {/* Header */}
        <div className="border-b border-theme-border pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-theme-muted font-mono">
              Reservation summary
            </h3>
            <motion.span
              key={ticketCount}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="rounded-[2px] bg-theme-border/50 px-2 py-0.5 text-xs font-mono text-theme-ink"
            >
              {ticketCount} {ticketCount === 1 ? 'entry' : 'entries'}
            </motion.span>
          </div>
          <h4 className="font-display text-lg font-medium text-theme-ink mt-2 leading-snug">
            {activeEvent.title}
          </h4>
        </div>

        {/* Location & Time info */}
        <div className="space-y-1.5 text-xs text-theme-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-theme-accent flex-shrink-0" strokeWidth={1.5} />
            <span className="text-theme-ink/90">{activeEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-theme-accent flex-shrink-0" strokeWidth={1.5} />
            <span>{activeEvent.venue}</span>
          </div>
        </div>

        {/* Selected Items Breakdown */}
        <div className="border-t border-theme-border pt-4">
          <span className="text-xs text-theme-muted block mb-2 font-medium">
            Allocated tickets
          </span>

          {ticketCount === 0 ? (
            <div className="rounded-[2px] border border-dashed border-theme-border p-4 text-center text-xs text-theme-muted">
              No seats or passes selected yet. Choose your preferred positions on the map.
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              <AnimatePresence>
                {activeEvent.type === 'assigned' &&
                  selectedSeats.map((seat) => (
                    <motion.div
                      key={seat.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between text-xs py-1 border-b border-theme-border/40 font-mono"
                    >
                      <span className="text-theme-ink font-medium">
                        Row {seat.row}, Seat {seat.number}
                      </span>
                      <span className="text-theme-accent font-semibold">₹{seat.price.toLocaleString('en-IN')}</span>
                    </motion.div>
                  ))}

                {activeEvent.type === 'general_admission' &&
                  activeEvent.gaTiers?.map((tier) => {
                    const qty = gaQuantities[tier.id] || 0;
                    if (qty === 0) return null;
                    return (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between text-xs py-1 border-b border-theme-border/40"
                      >
                        <span className="text-theme-ink font-medium">
                          {tier.name} × {qty}
                        </span>
                        <span className="text-theme-accent font-mono font-semibold">
                          ₹{(tier.price * qty).toLocaleString('en-IN')}
                        </span>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Financial Line Items */}
        {ticketCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 border-t border-theme-border pt-4 text-xs"
          >
            <div className="flex justify-between text-theme-muted">
              <span>Subtotal</span>
              <span className="text-theme-ink font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-theme-muted">
              <span>Heritage & facility preservation fee</span>
              <span className="text-theme-ink font-mono">₹{bookingFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-theme-border pt-3 text-sm">
              <span className="font-medium text-theme-ink">Total balance</span>
              <motion.span
                key={total}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                className="font-display text-xl font-normal italic text-theme-accent font-mono"
              >
                ₹{total.toLocaleString('en-IN')}
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-6 mt-6 border-t border-theme-border">
        <motion.button
          type="button"
          disabled={ticketCount === 0}
          whileHover={ticketCount > 0 ? { scale: 1.02 } : undefined}
          whileTap={ticketCount > 0 ? { scale: 0.98 } : undefined}
          onClick={proceedToCheckout}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-theme-accent py-3 text-center text-sm font-medium text-white dark:text-[#111110] disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-95 focus:outline-none transition-all shadow-sm"
        >
          <span>{ticketCount === 0 ? 'Select tickets to proceed' : 'Proceed to checkout'}</span>
          {ticketCount > 0 && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
          )}
        </motion.button>
      </div>
    </aside>
  );
};
