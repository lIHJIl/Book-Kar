import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EventCategory,
  EventItem,
  Seat,
  GuestDetails,
  PaymentDetails,
  ConfirmedTicket,
  ViewScreen,
} from '../types';
import { mockEvents } from '../data/events';

interface BookingContextType {
  events: EventItem[];
  activeEvent: EventItem | null;
  currentScreen: ViewScreen;
  categoryFilter: EventCategory | 'all';
  searchQuery: string;
  selectedSeats: Seat[];
  gaQuantities: Record<string, number>;
  checkoutStep: 1 | 2 | 3;
  guestDetails: GuestDetails;
  paymentDetails: PaymentDetails;
  confirmedTicket: ConfirmedTicket | null;
  theme: 'light' | 'dark';
  inlineError: string | null;
  isProcessingPayment: boolean;
  ticketCount: number;
  subtotal: number;
  bookingFee: number;
  total: number;

  toggleTheme: () => void;
  setCategoryFilter: (category: EventCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  viewEvent: (event: EventItem) => void;
  backToDiscovery: () => void;
  toggleSeat: (seat: Seat) => void;
  setGaQuantity: (tierId: string, quantity: number) => void;
  proceedToCheckout: () => void;
  setCheckoutStep: (step: 1 | 2 | 3) => void;
  updateGuestDetails: (details: Partial<GuestDetails>) => void;
  updatePaymentDetails: (details: Partial<PaymentDetails>) => void;
  submitPayment: () => Promise<boolean>;
  resetBooking: () => void;
  clearInlineError: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events] = useState<EventItem[]>(mockEvents);
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('discovery');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [gaQuantities, setGaQuantities] = useState<Record<string, number>>({});
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvc: '',
  });

  const [confirmedTicket, setConfirmedTicket] = useState<ConfirmedTicket | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vellum-theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vellum-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const clearInlineError = () => {
    setInlineError(null);
  };

  const viewEvent = (event: EventItem) => {
    setActiveEvent(event);
    setSelectedSeats([]);
    setGaQuantities({});
    setInlineError(null);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const backToDiscovery = () => {
    setCurrentScreen('discovery');
    setActiveEvent(null);
    setSelectedSeats([]);
    setGaQuantities({});
    setInlineError(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const toggleSeat = (seat: Seat) => {
    setInlineError(null);
    if (seat.status === 'sold') {
      setInlineError(`Seat ${seat.row}-${seat.number} is unavailable. Choose another seat.`);
      return;
    }

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);
    if (isAlreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        setInlineError('Selection limit of 6 seats reached per reservation.');
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const setGaQuantity = (tierId: string, quantity: number) => {
    setInlineError(null);
    const clamped = Math.max(0, Math.min(8, quantity));
    setGaQuantities((prev) => ({
      ...prev,
      [tierId]: clamped,
    }));
  };

  const ticketCount = activeEvent?.type === 'assigned'
    ? selectedSeats.length
    : (Object.values(gaQuantities) as number[]).reduce((acc, qty) => acc + qty, 0);

  const subtotal = activeEvent?.type === 'assigned'
    ? selectedSeats.reduce((acc, seat) => acc + seat.price, 0)
    : (activeEvent?.gaTiers || []).reduce((acc, tier) => {
        const qty = gaQuantities[tier.id] || 0;
        return acc + tier.price * qty;
      }, 0);

  const bookingFee = ticketCount > 0 ? Math.round(subtotal * 0.05 + 80 * ticketCount) : 0;
  const total = subtotal + bookingFee;

  const proceedToCheckout = () => {
    if (ticketCount === 0) {
      setInlineError('Select at least one ticket or seat before proceeding.');
      return;
    }
    setCheckoutStep(1);
    setCurrentScreen('checkout');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const updateGuestDetails = (details: Partial<GuestDetails>) => {
    setGuestDetails((prev) => ({ ...prev, ...details }));
  };

  const updatePaymentDetails = (details: Partial<PaymentDetails>) => {
    setPaymentDetails((prev) => ({ ...prev, ...details }));
  };

  const submitPayment = async (): Promise<boolean> => {
    if (!activeEvent) return false;
    setIsProcessingPayment(true);
    setInlineError(null);

    // Simulate verified bank authorization
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `BK-${activeEvent.category.slice(0, 3).toUpperCase()}-${randomSuffix}`;
    const gates = ['Suraj Pol Gate', 'Fateh Pol Entry', 'Tripolia Portico', 'Chand Pol Courtyard', 'Zenana Ramp Gate'];
    const chosenGate = gates[Math.floor(Math.random() * gates.length)];

    const gaSelection = activeEvent.type === 'general_admission' && activeEvent.gaTiers
      ? activeEvent.gaTiers
          .filter((t) => (gaQuantities[t.id] || 0) > 0)
          .map((t) => ({
            tierName: t.name,
            quantity: gaQuantities[t.id] || 0,
            unitPrice: t.price,
          }))
      : undefined;

    const confirmation: ConfirmedTicket = {
      ticketNumber: ticketId,
      event: activeEvent,
      seats: activeEvent.type === 'assigned' ? [...selectedSeats] : undefined,
      gaSelection,
      guest: { ...guestDetails },
      subtotal,
      bookingFee,
      total,
      issuedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      entryGate: chosenGate,
      barcodeValue: `*${ticketId}*${Date.now()}*`,
    };

    setConfirmedTicket(confirmation);
    setIsProcessingPayment(false);
    setCurrentScreen('confirmation');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return true;
  };

  const resetBooking = () => {
    setActiveEvent(null);
    setSelectedSeats([]);
    setGaQuantities({});
    setCheckoutStep(1);
    setConfirmedTicket(null);
    setGuestDetails({ fullName: '', email: '', phone: '' });
    setPaymentDetails({ cardNumber: '', cardHolder: '', expiry: '', cvc: '' });
    setCurrentScreen('discovery');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <BookingContext.Provider
      value={{
        events,
        activeEvent,
        currentScreen,
        categoryFilter,
        searchQuery,
        selectedSeats,
        gaQuantities,
        checkoutStep,
        guestDetails,
        paymentDetails,
        confirmedTicket,
        theme,
        inlineError,
        isProcessingPayment,
        ticketCount,
        subtotal,
        bookingFee,
        total,
        toggleTheme,
        setCategoryFilter,
        setSearchQuery,
        viewEvent,
        backToDiscovery,
        toggleSeat,
        setGaQuantity,
        proceedToCheckout,
        setCheckoutStep,
        updateGuestDetails,
        updatePaymentDetails,
        submitPayment,
        resetBooking,
        clearInlineError,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
