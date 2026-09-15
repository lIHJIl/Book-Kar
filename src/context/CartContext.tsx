import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  EventItem,
  Seat,
  GuestDetails,
  PaymentDetails,
  ConfirmedTicket,
} from '../types';

interface CartContextType {
  activeEvent: EventItem | null;
  selectedSeats: Seat[];
  gaQuantities: Record<string, number>;
  checkoutStep: 1 | 2 | 3;
  guestDetails: GuestDetails;
  paymentDetails: PaymentDetails;
  confirmedTicket: ConfirmedTicket | null;
  inlineError: string | null;
  isProcessingPayment: boolean;
  ticketCount: number;
  subtotal: number;
  bookingFee: number;
  total: number;

  setActiveEvent: (event: EventItem | null) => void;
  toggleSeat: (seat: Seat) => void;
  setGaQuantity: (tierId: string, quantity: number) => void;
  setCheckoutStep: (step: 1 | 2 | 3) => void;
  updateGuestDetails: (details: Partial<GuestDetails>) => void;
  updatePaymentDetails: (details: Partial<PaymentDetails>) => void;
  submitPayment: () => Promise<ConfirmedTicket | null>;
  resetCart: () => void;
  clearInlineError: () => void;
  setInlineError: (error: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeEvent, setActiveEventState] = useState<EventItem | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [gaQuantities, setGaQuantities] = useState<Record<string, number>>({});
  const [checkoutStep, setCheckoutStepState] = useState<1 | 2 | 3>(1);
  const [inlineError, setInlineErrorState] = useState<string | null>(null);
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

  const clearInlineError = useCallback(() => {
    setInlineErrorState(null);
  }, []);

  const setInlineError = useCallback((err: string | null) => {
    setInlineErrorState(err);
  }, []);

  const setActiveEvent = useCallback((event: EventItem | null) => {
    setActiveEventState(event);
    setSelectedSeats([]);
    setGaQuantities({});
    setInlineErrorState(null);
  }, []);

  const setCheckoutStep = useCallback((step: 1 | 2 | 3) => {
    setCheckoutStepState(step);
  }, []);

  const toggleSeat = useCallback((seat: Seat) => {
    setInlineErrorState(null);
    if (seat.status === 'sold') {
      setInlineErrorState(`Seat ${seat.row}-${seat.number} is unavailable. Choose another seat.`);
      return;
    }

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length >= 6) {
        setInlineErrorState('Selection limit of 6 seats reached per reservation.');
        return prev;
      }
      return [...prev, seat];
    });
  }, []);

  const setGaQuantity = useCallback((tierId: string, quantity: number) => {
    setInlineErrorState(null);
    const clamped = Math.max(0, Math.min(8, quantity));
    setGaQuantities((prev) => ({
      ...prev,
      [tierId]: clamped,
    }));
  }, []);

  const updateGuestDetails = useCallback((details: Partial<GuestDetails>) => {
    setGuestDetails((prev) => ({ ...prev, ...details }));
  }, []);

  const updatePaymentDetails = useCallback((details: Partial<PaymentDetails>) => {
    setPaymentDetails((prev) => ({ ...prev, ...details }));
  }, []);

  const ticketCount = useMemo(() => {
    if (!activeEvent) return 0;
    if (activeEvent.type === 'assigned') {
      return selectedSeats.length;
    }
    return (Object.values(gaQuantities) as number[]).reduce((acc, qty) => acc + qty, 0);
  }, [activeEvent, selectedSeats.length, gaQuantities]);

  const subtotal = useMemo(() => {
    if (!activeEvent) return 0;
    if (activeEvent.type === 'assigned') {
      return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
    }
    return (activeEvent.gaTiers || []).reduce((acc, tier) => {
      const qty = gaQuantities[tier.id] || 0;
      return acc + tier.price * qty;
    }, 0);
  }, [activeEvent, selectedSeats, gaQuantities]);

  const bookingFee = useMemo(() => {
    return ticketCount > 0 ? Math.round(subtotal * 0.05 + 80 * ticketCount) : 0;
  }, [ticketCount, subtotal]);

  const total = useMemo(() => subtotal + bookingFee, [subtotal, bookingFee]);

  const resetCart = useCallback(() => {
    setActiveEventState(null);
    setSelectedSeats([]);
    setGaQuantities({});
    setCheckoutStepState(1);
    setConfirmedTicket(null);
    setInlineErrorState(null);
    setGuestDetails({ fullName: '', email: '', phone: '' });
    setPaymentDetails({ cardNumber: '', cardHolder: '', expiry: '', cvc: '' });
  }, []);

  const submitPayment = useCallback(async (): Promise<ConfirmedTicket | null> => {
    if (!activeEvent) return null;
    setIsProcessingPayment(true);
    setInlineErrorState(null);

    // Simulate verified authorization
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
    return confirmation;
  }, [activeEvent, gaQuantities, selectedSeats, guestDetails, subtotal, bookingFee, total]);

  const value = useMemo(
    () => ({
      activeEvent,
      selectedSeats,
      gaQuantities,
      checkoutStep,
      guestDetails,
      paymentDetails,
      confirmedTicket,
      inlineError,
      isProcessingPayment,
      ticketCount,
      subtotal,
      bookingFee,
      total,
      setActiveEvent,
      toggleSeat,
      setGaQuantity,
      setCheckoutStep,
      updateGuestDetails,
      updatePaymentDetails,
      submitPayment,
      resetCart,
      clearInlineError,
      setInlineError,
    }),
    [
      activeEvent,
      selectedSeats,
      gaQuantities,
      checkoutStep,
      guestDetails,
      paymentDetails,
      confirmedTicket,
      inlineError,
      isProcessingPayment,
      ticketCount,
      subtotal,
      bookingFee,
      total,
      setActiveEvent,
      toggleSeat,
      setGaQuantity,
      setCheckoutStep,
      updateGuestDetails,
      updatePaymentDetails,
      submitPayment,
      resetCart,
      clearInlineError,
      setInlineError,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
