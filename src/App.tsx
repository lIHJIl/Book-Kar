import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { MarqueeHero } from './components/MarqueeHero';
import { CategoryTicker } from './components/CategoryTicker';
import { EventGrid } from './components/EventGrid';
import { EventDetail } from './components/EventDetail';
import { CheckoutView } from './components/CheckoutView';
import { ConfirmationView } from './components/ConfirmationView';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentScreen, events } = useBooking();
  const featuredEvent = events.find((e) => e.featured) || events[0];

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-ink selection:bg-theme-accent selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {currentScreen === 'discovery' && (
          <>
            <MarqueeHero event={featuredEvent} />
            <CategoryTicker />
            <EventGrid />
          </>
        )}

        {currentScreen === 'detail' && <EventDetail />}

        {currentScreen === 'checkout' && <CheckoutView />}

        {currentScreen === 'confirmation' && <ConfirmationView />}
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
