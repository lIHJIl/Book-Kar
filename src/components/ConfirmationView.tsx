import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useBooking } from '../context/BookingContext';
import { Check, Calendar, MapPin, Download, QrCode, Sparkles, Award } from 'lucide-react';

export const ConfirmationView: React.FC = () => {
  const { confirmedTicket, resetBooking } = useBooking();
  const shouldReduceMotion = useReducedMotion();
  const [walletAdded, setWalletAdded] = useState(false);

  if (!confirmedTicket) return null;

  const { event, guest, ticketNumber, issuedAt, entryGate, total, seats, gaSelection } = confirmedTicket;

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Playful festive particles */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${15 + (i * 6)}%`,
                y: -10,
                opacity: 0.9,
                scale: 0.6 + (i % 3) * 0.3,
                rotate: i * 25,
              }}
              animate={{
                y: [0, 450 + (i % 5) * 40],
                x: [`${15 + (i * 6)}%`, `${15 + (i * 6) + ((i % 2 === 0 ? 1 : -1) * 8)}%`],
                opacity: [0.9, 1, 0],
                rotate: [0, 180 + i * 45],
              }}
              transition={{
                duration: 2.5 + (i % 3) * 0.8,
                delay: (i * 0.12),
                ease: 'easeOut',
              }}
              className="absolute h-2 w-2 rounded-full"
              style={{
                backgroundColor: i % 3 === 0 ? '#C7A06B' : i % 3 === 1 ? '#E48858' : '#657C60',
              }}
            />
          ))}
        </div>
      )}

      {/* Top Banner Notice */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center space-y-2"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme-accent bg-theme-surface text-theme-accent shadow-sm mb-1"
        >
          <Check className="h-5 w-5" strokeWidth={2.5} />
        </motion.div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal text-theme-ink tracking-tight">
          Reservation confirmed
        </h1>
        <p className="font-body text-xs sm:text-sm text-theme-muted max-w-md mx-auto">
          Pass <span className="font-mono text-theme-accent font-semibold">#{ticketNumber}</span> issued to {guest.fullName}. An official digital pass has been dispatched to {guest.email}.
        </p>
      </motion.div>

      {/* Physical Ticket Pass */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-xl overflow-hidden rounded-xl border border-theme-border bg-theme-surface shadow-2xl transition-colors"
      >
        {/* Physical Ticket Header with Image */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black">
          <img
            src={event.heroImage}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center brightness-75 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Golden Royal Stamp Badge */}
          <motion.div
            initial={{ scale: 2.2, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 350, damping: 20 }}
            className="absolute top-12 right-6 rounded-md border-2 border-[#C7A06B]/80 bg-black/60 px-3 py-1 text-center backdrop-blur-xs shadow-lg"
          >
            <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-[#C7A06B] font-bold uppercase">
              <Award className="h-3 w-3" />
              <span>AUTHENTIC PASS</span>
            </div>
          </motion.div>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-[#F3F1EA]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-[2px] bg-[#C7A06B]" />
              <span className="font-medium tracking-wide font-mono text-[11px]">BOOK_KAR. OFFICIAL PASS</span>
            </div>
            <span className="font-mono text-[11px] text-[#C7A06B]">{ticketNumber}</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-[#F3F1EA]">
            <span className="text-[11px] uppercase tracking-wider font-mono text-[#C7A06B]">
              {event.category}
            </span>
            <h2 className="font-display text-2xl font-normal italic tracking-tight text-[#F3F1EA] line-clamp-1">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Physical Ticket Main Section */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Performance Logistics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-theme-border pb-6 text-xs">
            <div>
              <span className="text-theme-muted block mb-1">Date & Time</span>
              <span className="font-medium text-theme-ink block">{event.date}</span>
              <span className="text-theme-muted font-mono">{event.time}</span>
            </div>

            <div>
              <span className="text-theme-muted block mb-1">Venue</span>
              <span className="font-medium text-theme-ink block">{event.venue}</span>
              <span className="text-theme-muted">{event.city}</span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-theme-muted block mb-1">Access Gate</span>
              <span className="font-mono font-medium text-theme-accent block">{entryGate}</span>
              <span className="text-theme-muted font-mono">Doors {event.doorsOpen}</span>
            </div>
          </div>

          {/* Seating / Tier Allocation */}
          <div className="border-b border-theme-border pb-6">
            <span className="text-xs text-theme-muted font-medium block mb-2">
              Allocated access
            </span>

            {event.type === 'assigned' && seats && (
              <div className="flex flex-wrap gap-2">
                {seats.map((seat) => (
                  <motion.div
                    key={seat.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-[2px] border border-theme-border bg-theme-bg px-3 py-1.5 text-xs font-mono font-medium text-theme-ink"
                  >
                    Row {seat.row} / Seat {seat.number}
                  </motion.div>
                ))}
              </div>
            )}

            {event.type === 'general_admission' && gaSelection && (
              <div className="space-y-1.5">
                {gaSelection.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-theme-ink">
                    <span>{item.tierName}</span>
                    <span className="font-mono font-medium">{item.quantity} passes</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attendee Holder */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-theme-muted block">Pass holder</span>
              <span className="font-medium text-theme-ink text-sm">{guest.fullName}</span>
            </div>
            <div className="text-right">
              <span className="text-theme-muted block">Total paid</span>
              <span className="font-display text-lg font-normal italic text-theme-accent font-mono">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Tear Line with Simulated Notches */}
        <div className="relative flex items-center justify-between px-2 bg-theme-surface">
          <div className="h-6 w-3 rounded-r-full border-r border-y border-theme-border bg-theme-bg" />
          <div className="flex-1 border-b-2 border-dashed border-theme-border mx-2" />
          <div className="h-6 w-3 rounded-l-full border-l border-y border-theme-border bg-theme-bg" />
        </div>

        {/* Physical Ticket Stub: Barcode & QR Block */}
        <div className="p-6 sm:p-8 bg-theme-bg/60 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-[2px] border border-theme-border bg-white p-2 flex items-center justify-center text-black">
              <QrCode className="h-12 w-12 text-[#15140F]" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-theme-muted block">Scan at turnstile</span>
              <span className="font-mono text-xs font-semibold text-theme-ink block">
                {ticketNumber}
              </span>
              <span className="text-[10px] text-theme-muted block font-mono">
                Issued {issuedAt}
              </span>
            </div>
          </div>

          {/* Stylized Barcode Graphic */}
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-[3px] h-9">
              {[4, 2, 6, 1, 3, 5, 2, 4, 1, 3, 6, 2, 5, 1, 4, 2, 6, 3, 2, 5, 1].map((w, idx) => (
                <span
                  key={idx}
                  className="bg-theme-ink h-full block"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] text-theme-muted tracking-widest block">
              *{ticketNumber}*
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setWalletAdded(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-6 py-3 text-xs font-medium text-theme-ink hover:border-theme-accent transition-all shadow-sm"
        >
          {walletAdded ? (
            <>
              <Check className="h-4 w-4 text-theme-accent" strokeWidth={1.5} />
              <span>Added to Apple Wallet</span>
            </>
          ) : (
            <span>Add to Apple Wallet</span>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-6 py-3 text-xs font-medium text-theme-ink hover:border-theme-accent transition-all shadow-sm"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
          <span>Save pass as PDF</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetBooking}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-theme-accent px-7 py-3 text-xs font-medium text-white dark:text-[#111110] hover:opacity-95 transition-all shadow-sm"
        >
          Browse more events
        </motion.button>
      </div>
    </div>
  );
};
