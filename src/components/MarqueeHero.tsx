import React from 'react';
import { motion } from 'motion/react';
import { EventItem } from '../types';
import { useBooking } from '../context/BookingContext';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface MarqueeHeroProps {
  event: EventItem;
}

export const MarqueeHero: React.FC<MarqueeHeroProps> = ({ event }) => {
  const { viewEvent } = useBooking();

  return (
    <section className="relative w-full overflow-hidden border-b border-theme-border bg-black text-[#F3F1EA]">
      {/* Poster Background Image with Architectural Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={event.heroImage}
          alt={event.title}
          referrerPolicy="no-referrer"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="h-full w-full object-cover object-center brightness-65 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
      </div>

      {/* Hero Marquee Content */}
      <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:min-h-[600px] lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-[2px] border border-[#C7A06B]/50 bg-black/50 px-2.5 py-1 text-xs text-[#C7A06B] backdrop-blur-xs"
          >
            <Sparkles className="h-3 w-3 text-[#C7A06B]" strokeWidth={1.5} />
            <span className="font-mono tracking-wider uppercase text-[11px]">Rajasthan Spotlight Fixture</span>
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal italic tracking-tight leading-[1.08] text-[#F3F1EA]">
            {event.title}
          </h1>

          {event.subtitle && (
            <p className="font-body text-base sm:text-lg text-[#C7A06B]/90 max-w-2xl leading-relaxed">
              {event.subtitle}
            </p>
          )}

          {/* Date & Venue meta details */}
          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-[#F3F1EA]/85">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C7A06B]" strokeWidth={1.5} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C7A06B]" strokeWidth={1.5} />
              <span>{event.venue}, {event.city}</span>
            </div>
            <div className="text-sm font-medium text-[#C7A06B] font-mono">
              From ₹{event.startingPrice.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Clean CTA with spring hover */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => viewEvent(event)}
              className="group inline-flex items-center gap-2 justify-center rounded-xl bg-theme-accent px-6 py-3 text-sm font-medium text-white dark:text-[#111110] shadow-lg shadow-black/20 hover:opacity-95 focus:outline-none transition-all"
            >
              <span>{event.type === 'assigned' ? 'Select seats' : 'Select passes'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
