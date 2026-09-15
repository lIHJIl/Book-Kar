import React from 'react';
import { motion } from 'motion/react';
import { EventItem } from '../types';
import { useBooking } from '../context/BookingContext';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const EventGrid: React.FC = () => {
  const { events, categoryFilter, searchQuery, viewEvent } = useBooking();

  const filteredEvents = events.filter((event) => {
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      event.title.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q) ||
      event.city.toLowerCase().includes(q) ||
      (event.subtitle && event.subtitle.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  if (filteredEvents.length === 0) {
    return <EmptyState query={searchQuery} />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Info */}
      <div className="mb-8 flex items-baseline justify-between border-b border-theme-border pb-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-theme-ink">
            Scheduled repertoire
          </h2>
          <p className="text-xs text-theme-muted mt-1">
            Handcrafted classical, sufi, theatrical, and athletic programs across Rajasthan
          </p>
        </div>
        <span className="text-xs font-mono text-theme-muted">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'fixture' : 'fixtures'}
        </span>
      </div>

      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event, index) => {
          const isLargeTile = index % 5 === 4;

          return (
            <motion.article
              key={event.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
              onClick={() => viewEvent(event)}
              className={`group cursor-pointer border border-theme-border bg-theme-surface transition-all duration-300 hover:border-theme-accent hover:shadow-md ${
                isLargeTile
                  ? 'sm:col-span-2 lg:col-span-2 flex flex-col md:flex-row'
                  : 'flex flex-col'
              }`}
              style={{ borderRadius: '2px' }}
            >
              {/* Image Container */}
              <div
                className={`p-3.5 ${
                  isLargeTile
                    ? 'md:w-1/2 flex-shrink-0'
                    : 'w-full'
                }`}
              >
                <div className="overflow-hidden rounded-xl bg-theme-border/40 aspect-[16/10] relative">
                  <img
                    src={event.thumbnailImage}
                    alt={event.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </div>

              {/* Event Content Details */}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-theme-muted uppercase tracking-wider font-mono">
                      {event.category}
                    </span>
                    <span className="rounded-[2px] border border-theme-border px-2 py-0.5 text-xs font-mono font-medium text-theme-accent group-hover:border-theme-accent/50 transition-colors">
                      From ₹{event.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3
                    className={`font-display text-theme-ink leading-tight font-medium group-hover:text-theme-accent transition-colors ${
                      isLargeTile ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                    }`}
                  >
                    {event.title}
                  </h3>

                  {event.subtitle && (
                    <p className="text-xs text-theme-muted line-clamp-2 leading-relaxed">
                      {event.subtitle}
                    </p>
                  )}
                </div>

                {/* Metadata & Direct CTA */}
                <div className="pt-5 mt-auto border-t border-theme-border/70">
                  <div className="space-y-1.5 text-xs text-theme-muted mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-theme-accent" strokeWidth={1.5} />
                      <span className="text-theme-ink/90">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-theme-accent transition-transform group-hover:scale-110" strokeWidth={1.5} />
                      <span>{event.venue}, {event.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-ink group-hover:text-theme-accent transition-colors">
                      <span>{event.type === 'assigned' ? 'Select seats' : 'Select passes'}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} />
                    </span>
                    <span className="text-[11px] font-mono text-theme-muted">
                      {event.type === 'assigned' ? 'Reserved seating' : 'Open baithak / entry'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
