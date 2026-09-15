import React, { useRef, useMemo, useDeferredValue } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { EventItem } from '../types';
import { useBooking } from '../context/BookingContext';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { HeritageImage } from './HeritageImage';
import { getCategoryTheme } from '../utils/categoryTheme';

interface TileProps {
  event: EventItem;
  index: number;
  onView: (event: EventItem) => void;
}

const FeaturedLargeCard = React.memo<TileProps>(({ event, index, onView }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt tracking using useMotionValue and useTransform (max ~3-4°)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for gentle physics
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-3.5, 3.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const catTheme = getCategoryTheme(event.category);

  return (
    <div style={{ perspective: 1000 }} className="sm:col-span-2 lg:col-span-2">
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.25) }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: '2px',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onView(event)}
        className="group cursor-pointer border border-theme-border bg-theme-surface transition-colors duration-300 hover:border-theme-accent hover:shadow-lg flex flex-col md:flex-row h-full"
      >
        {/* Image Container with Shimmer Skeleton */}
        <div className="p-3.5 md:w-1/2 flex-shrink-0">
          <div className="overflow-hidden rounded-[2px] bg-theme-border/40 aspect-[16/10] h-full relative">
            <HeritageImage
              src={event.thumbnailImage}
              alt={event.title}
              containerClassName="h-full w-full"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
          </div>
        </div>

        {/* Event Content Details */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className={`rounded-[2px] border px-2 py-0.5 text-xs font-medium uppercase tracking-wider font-mono ${catTheme.badgeClass}`}>
                {event.category}
              </span>
              <span className="rounded-[2px] border border-theme-border px-2 py-0.5 text-xs font-mono font-medium text-theme-accent group-hover:border-theme-accent/50 transition-colors">
                From ₹{event.startingPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <h3 className="font-display text-theme-ink leading-tight font-medium group-hover:text-theme-accent transition-colors text-xl sm:text-2xl">
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
    </div>
  );
});
FeaturedLargeCard.displayName = 'FeaturedLargeCard';

const StandardGridCard = React.memo<TileProps>(({ event, index, onView }) => {
  const catTheme = getCategoryTheme(event.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.25) }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      onClick={() => onView(event)}
      className="group cursor-pointer border border-theme-border bg-theme-surface transition-all duration-300 hover:border-theme-accent hover:shadow-md flex flex-col"
      style={{ borderRadius: '2px' }}
    >
      {/* Image Container with Shimmer Skeleton */}
      <div className="p-3.5 w-full">
        <div className="overflow-hidden rounded-[2px] bg-theme-border/40 aspect-[16/10] relative">
          <HeritageImage
            src={event.thumbnailImage}
            alt={event.title}
            containerClassName="h-full w-full"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
        </div>
      </div>

      {/* Event Content Details */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className={`rounded-[2px] border px-2 py-0.5 text-xs font-medium uppercase tracking-wider font-mono ${catTheme.badgeClass}`}>
              {event.category}
            </span>
            <span className="rounded-[2px] border border-theme-border px-2 py-0.5 text-xs font-mono font-medium text-theme-accent group-hover:border-theme-accent/50 transition-colors">
              From ₹{event.startingPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <h3 className="font-display text-theme-ink leading-tight font-medium group-hover:text-theme-accent transition-colors text-lg sm:text-xl">
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
});
StandardGridCard.displayName = 'StandardGridCard';

export const EventGrid: React.FC = () => {
  const { events, categoryFilter, searchQuery, viewEvent } = useBooking();
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredEvents = useMemo(() => {
    const q = deferredSearchQuery.toLowerCase().trim();
    return events.filter((event) => {
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        event.city.toLowerCase().includes(q) ||
        (event.subtitle && event.subtitle.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [events, categoryFilter, deferredSearchQuery]);

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

          return isLargeTile ? (
            <FeaturedLargeCard key={event.id} event={event} index={index} onView={viewEvent} />
          ) : (
            <StandardGridCard key={event.id} event={event} index={index} onView={viewEvent} />
          );
        })}
      </div>
    </section>
  );
};
