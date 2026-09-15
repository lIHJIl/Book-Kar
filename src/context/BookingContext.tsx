import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import {
  EventCategory,
  EventItem,
  Seat,
  GuestDetails,
  PaymentDetails,
  ConfirmedTicket,
  ViewScreen,
} from '../types';
import { UIProvider, useUI } from './UIContext';
import { CatalogProvider, useCatalog } from './CatalogContext';
import { CartProvider, useCart } from './CartContext';

export { useUI } from './UIContext';
export { useCatalog } from './CatalogContext';
export { useCart } from './CartContext';

export interface BookingContextType {
  // Catalog slice
  events: EventItem[];
  categoryFilter: EventCategory | 'all';
  searchQuery: string;
  setCategoryFilter: (category: EventCategory | 'all') => void;
  setSearchQuery: (query: string) => void;

  // UI slice
  theme: 'light' | 'dark';
  currentScreen: ViewScreen;
  toggleTheme: () => void;

  // Cart slice
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

  // Unified Actions
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

const BookingBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ui = useUI();
  const catalog = useCatalog();
  const cart = useCart();

  const viewEvent = useCallback((event: EventItem) => {
    cart.setActiveEvent(event);
    ui.transitionToScreen('detail');
  }, [cart, ui]);

  const backToDiscovery = useCallback(() => {
    ui.transitionToScreen('discovery');
  }, [ui]);

  const proceedToCheckout = useCallback(() => {
    if (cart.ticketCount === 0) {
      cart.setInlineError('Select at least one ticket or seat before proceeding.');
      return;
    }
    cart.setCheckoutStep(1);
    ui.transitionToScreen('checkout');
  }, [cart, ui]);

  const submitPayment = useCallback(async (): Promise<boolean> => {
    const confirmation = await cart.submitPayment();
    if (confirmation) {
      ui.transitionToScreen('confirmation');
      return true;
    }
    return false;
  }, [cart, ui]);

  const resetBooking = useCallback(() => {
    cart.resetCart();
    ui.transitionToScreen('discovery');
  }, [cart, ui]);

  const value = useMemo<BookingContextType>(() => ({
    // Catalog
    events: catalog.events,
    categoryFilter: catalog.categoryFilter,
    searchQuery: catalog.searchQuery,
    setCategoryFilter: catalog.setCategoryFilter,
    setSearchQuery: catalog.setSearchQuery,

    // UI
    theme: ui.theme,
    currentScreen: ui.currentScreen,
    toggleTheme: ui.toggleTheme,

    // Cart
    activeEvent: cart.activeEvent,
    selectedSeats: cart.selectedSeats,
    gaQuantities: cart.gaQuantities,
    checkoutStep: cart.checkoutStep,
    guestDetails: cart.guestDetails,
    paymentDetails: cart.paymentDetails,
    confirmedTicket: cart.confirmedTicket,
    inlineError: cart.inlineError,
    isProcessingPayment: cart.isProcessingPayment,
    ticketCount: cart.ticketCount,
    subtotal: cart.subtotal,
    bookingFee: cart.bookingFee,
    total: cart.total,

    // Actions
    viewEvent,
    backToDiscovery,
    toggleSeat: cart.toggleSeat,
    setGaQuantity: cart.setGaQuantity,
    proceedToCheckout,
    setCheckoutStep: cart.setCheckoutStep,
    updateGuestDetails: cart.updateGuestDetails,
    updatePaymentDetails: cart.updatePaymentDetails,
    submitPayment,
    resetBooking,
    clearInlineError: cart.clearInlineError,
  }), [catalog, ui, cart, viewEvent, backToDiscovery, proceedToCheckout, submitPayment, resetBooking]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <CatalogProvider>
        <CartProvider>
          <BookingBridge>{children}</BookingBridge>
        </CartProvider>
      </CatalogProvider>
    </UIProvider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
