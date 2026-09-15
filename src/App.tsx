import React, { useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { MarqueeHero } from './components/MarqueeHero';
import { CategoryTicker } from './components/CategoryTicker';
import { EventGrid } from './components/EventGrid';
import { Footer } from './components/Footer';
import { Sparkles } from 'lucide-react';

// Code-splitting non-initial screens into on-demand bundles
const EventDetail = React.lazy(() =>
  import('./components/EventDetail').then((module) => ({ default: module.EventDetail }))
);
const CheckoutView = React.lazy(() =>
  import('./components/CheckoutView').then((module) => ({ default: module.CheckoutView }))
);
const ConfirmationView = React.lazy(() =>
  import('./components/ConfirmationView').then((module) => ({ default: module.ConfirmationView }))
);

const ScreenSkeleton: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center min-h-[420px] p-8">
    <div className="relative flex h-12 w-12 items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-theme-border border-t-theme-accent animate-spin" />
      <Sparkles className="h-5 w-5 text-theme-accent animate-pulse" strokeWidth={1.5} />
    </div>
    <span className="mt-4 font-mono text-xs text-theme-muted uppercase tracking-wider">
      Opening repertoire fixture...
    </span>
  </div>
);

const AppContent: React.FC = () => {
  const { currentScreen, events } = useBooking();
  const featuredEvent = events.find((e) => e.featured) || events[0];

  // Reset viewport scroll to top on any screen transition
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentScreen]);

  return (
    <div className="relative min-h-screen flex flex-col bg-theme-bg text-theme-ink selection:bg-theme-accent selection:text-white transition-colors duration-200">
      {/* Subtle authentic paper grain / handmade noise overlay (2-3% opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.028] dark:opacity-[0.038] mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col w-full"
          >
            {currentScreen === 'discovery' && (
              <>
                <MarqueeHero event={featuredEvent} />
                <CategoryTicker />
                <EventGrid />
              </>
            )}

            <Suspense fallback={<ScreenSkeleton />}>
              {currentScreen === 'detail' && <EventDetail />}
              {currentScreen === 'checkout' && <CheckoutView />}
              {currentScreen === 'confirmation' && <ConfirmationView />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}
