import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBooking } from '../context/BookingContext';
import { Calendar, MapPin, ArrowLeft, ShieldCheck, Check, Lock, Sparkles } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    activeEvent,
    selectedSeats,
    gaQuantities,
    subtotal,
    bookingFee,
    total,
    checkoutStep,
    setCheckoutStep,
    guestDetails,
    updateGuestDetails,
    paymentDetails,
    updatePaymentDetails,
    submitPayment,
    isProcessingPayment,
    viewEvent,
  } = useBooking();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!activeEvent) return null;

  // Formatting helpers for credit card
  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    updatePaymentDetails({ cardNumber: formatted });
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      updatePaymentDetails({ expiry: `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` });
    } else {
      updatePaymentDetails({ expiry: cleaned });
    }
  };

  const handleCvcChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    updatePaymentDetails({ cvc: cleaned });
  };

  const validateDetails = (): boolean => {
    const errors: Record<string, string> = {};
    if (!guestDetails.fullName.trim()) {
      errors.fullName = 'Full legal name is required for gate admission.';
    }
    if (!guestDetails.email.trim() || !guestDetails.email.includes('@')) {
      errors.email = 'A valid email is required to deliver your digital tickets.';
    }
    if (!guestDetails.phone.trim()) {
      errors.phone = 'Mobile telephone number is required for event notifications.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = (): boolean => {
    const errors: Record<string, string> = {};
    const cleanNumber = paymentDetails.cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 15) {
      errors.cardNumber = 'Enter a valid 15 or 16-digit card number.';
    }
    if (!paymentDetails.expiry || paymentDetails.expiry.length < 5) {
      errors.expiry = 'Enter MM/YY expiry date.';
    }
    if (!paymentDetails.cvc || paymentDetails.cvc.length < 3) {
      errors.cvc = 'Enter 3 or 4-digit security code.';
    }
    if (!paymentDetails.cardHolder.trim()) {
      errors.cardHolder = 'Cardholder name as printed on card is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (validateDetails()) {
        setCheckoutStep(3);
      }
    } else if (checkoutStep === 3) {
      if (validatePayment()) {
        submitPayment();
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Return Navigation */}
      <div className="mb-8">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => viewEvent(activeEvent)}
          className="group inline-flex items-center gap-2 text-xs font-medium text-theme-muted hover:text-theme-ink focus:outline-none transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
          <span>Back to seat allocation</span>
        </motion.button>
      </div>

      {/* 3-Step Indicator with fluid highlight bar */}
      <nav aria-label="Checkout Progress" className="mb-10 max-w-3xl">
        <ol className="flex items-center justify-between border-b border-theme-border pb-4">
          <li className="flex items-center gap-2">
            <motion.span
              animate={{ scale: checkoutStep === 1 ? 1.05 : 1 }}
              className={`flex h-6 w-6 items-center justify-center rounded-[2px] text-xs font-mono font-medium transition-colors ${
                checkoutStep > 1
                  ? 'bg-theme-accent text-white dark:text-[#111110]'
                  : checkoutStep === 1
                  ? 'border border-theme-accent text-theme-accent font-semibold'
                  : 'border border-theme-border text-theme-muted'
              }`}
            >
              {checkoutStep > 1 ? <Check className="h-3 w-3" strokeWidth={2.5} /> : '1'}
            </motion.span>
            <span
              className={`text-xs font-medium ${
                checkoutStep === 1 ? 'text-theme-ink font-semibold' : 'text-theme-muted'
              }`}
            >
              Tickets
            </span>
          </li>

          <div className="relative h-[2px] flex-1 mx-4 bg-theme-border overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-theme-accent"
              initial={false}
              animate={{ width: checkoutStep > 1 ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <li className="flex items-center gap-2">
            <motion.span
              animate={{ scale: checkoutStep === 2 ? 1.05 : 1 }}
              className={`flex h-6 w-6 items-center justify-center rounded-[2px] text-xs font-mono font-medium transition-colors ${
                checkoutStep > 2
                  ? 'bg-theme-accent text-white dark:text-[#111110]'
                  : checkoutStep === 2
                  ? 'border border-theme-accent text-theme-accent font-semibold'
                  : 'border border-theme-border text-theme-muted'
              }`}
            >
              {checkoutStep > 2 ? <Check className="h-3 w-3" strokeWidth={2.5} /> : '2'}
            </motion.span>
            <span
              className={`text-xs font-medium ${
                checkoutStep === 2 ? 'text-theme-ink font-semibold' : 'text-theme-muted'
              }`}
            >
              Details
            </span>
          </li>

          <div className="relative h-[2px] flex-1 mx-4 bg-theme-border overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-theme-accent"
              initial={false}
              animate={{ width: checkoutStep > 2 ? '100%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <li className="flex items-center gap-2">
            <motion.span
              animate={{ scale: checkoutStep === 3 ? 1.05 : 1 }}
              className={`flex h-6 w-6 items-center justify-center rounded-[2px] text-xs font-mono font-medium transition-colors ${
                checkoutStep === 3
                  ? 'border border-theme-accent text-theme-accent font-semibold'
                  : 'border border-theme-border text-theme-muted'
              }`}
            >
              3
            </motion.span>
            <span
              className={`text-xs font-medium ${
                checkoutStep === 3 ? 'text-theme-ink font-semibold' : 'text-theme-muted'
              }`}
            >
              Payment
            </span>
          </li>
        </ol>
      </nav>

      {/* Main Grid: Form Steps + Order Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Interactive Flow (Columns 1-7) */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Ticket Confirmation Review */}
            {checkoutStep === 1 && (
              <motion.section
                key="step1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl font-normal text-theme-ink">
                    Review selected admission
                  </h2>
                  <p className="text-xs text-theme-muted mt-1">
                    Confirm your ticket tier and position allocations before providing attendee registration.
                  </p>
                </div>

                <div className="rounded-[2px] border border-theme-border bg-theme-surface p-5 space-y-4">
                  <div className="border-b border-theme-border pb-3">
                    <h3 className="font-display text-lg font-medium text-theme-ink">
                      {activeEvent.title}
                    </h3>
                    <div className="text-xs text-theme-muted mt-1">
                      {activeEvent.venue} — {activeEvent.date} at {activeEvent.time}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-medium text-theme-muted uppercase tracking-wider block font-mono">
                      Reserved allocations
                    </span>

                    {activeEvent.type === 'assigned' && (
                      <div className="divide-y divide-theme-border/60">
                        {selectedSeats.map((seat) => (
                          <div key={seat.id} className="flex justify-between py-2 text-xs font-mono">
                            <span className="text-theme-ink font-medium">
                              Row {seat.row}, Seat {seat.number}
                            </span>
                            <span className="text-theme-accent font-semibold">₹{seat.price.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeEvent.type === 'general_admission' && (
                      <div className="divide-y divide-theme-border/60">
                        {activeEvent.gaTiers?.map((tier) => {
                          const qty = gaQuantities[tier.id] || 0;
                          if (qty === 0) return null;
                          return (
                            <div key={tier.id} className="flex justify-between py-2 text-xs">
                              <span className="text-theme-ink font-medium">
                                {tier.name} (Quantity: {qty})
                              </span>
                              <span className="text-theme-accent font-semibold font-mono">
                                ₹{(tier.price * qty).toLocaleString('en-IN')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    className="w-full sm:w-auto rounded-xl bg-theme-accent px-8 py-3 text-sm font-medium text-white dark:text-[#111110] hover:opacity-95 focus:outline-none transition-all shadow-sm"
                  >
                    Proceed to attendee details
                  </motion.button>
                </div>
              </motion.section>
            )}

            {/* Step 2: Guest Details Form */}
            {checkoutStep === 2 && (
              <motion.section
                key="step2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl font-normal text-theme-ink">
                    Attendee information
                  </h2>
                  <p className="text-xs text-theme-muted mt-1">
                    Direct guest checkout. Digital passes and entry barcoding will be dispatched to this email.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNextStep();
                  }}
                  className="rounded-[2px] border border-theme-border bg-theme-surface p-6 space-y-4"
                >
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium text-theme-ink mb-1.5">
                      Full legal name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={guestDetails.fullName}
                      onChange={(e) => {
                        updateGuestDetails({ fullName: e.target.value });
                        if (formErrors.fullName) setFormErrors((p) => ({ ...p, fullName: '' }));
                      }}
                      placeholder="Aarav Sharma"
                      className="w-full rounded-[2px] border border-theme-border bg-theme-bg px-3.5 py-2 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none transition-all"
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-theme-ink mb-1.5">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={guestDetails.email}
                      onChange={(e) => {
                        updateGuestDetails({ email: e.target.value });
                        if (formErrors.email) setFormErrors((p) => ({ ...p, email: '' }));
                      }}
                      placeholder="aarav.sharma@culture.in"
                      className="w-full rounded-[2px] border border-theme-border bg-theme-bg px-3.5 py-2 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none transition-all"
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-theme-ink mb-1.5">
                      Mobile telephone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={guestDetails.phone}
                      onChange={(e) => {
                        updateGuestDetails({ phone: e.target.value });
                        if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: '' }));
                      }}
                      placeholder="+91 98290 12345"
                      className="w-full rounded-[2px] border border-theme-border bg-theme-bg px-3.5 py-2 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none transition-all"
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="text-xs text-theme-muted hover:text-theme-ink transition-colors"
                    >
                      Back to tickets
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-xl bg-theme-accent px-8 py-3 text-sm font-medium text-white dark:text-[#111110] hover:opacity-95 focus:outline-none transition-all shadow-sm"
                    >
                      Proceed to payment
                    </motion.button>
                  </div>
                </form>
              </motion.section>
            )}

            {/* Step 3: Mock Payment Gateway */}
            {checkoutStep === 3 && (
              <motion.section
                key="step3"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl font-normal text-theme-ink">
                    Payment authorization
                  </h2>
                  <p className="text-xs text-theme-muted mt-1">
                    Demonstration checkout. Format validation only; no monetary transaction takes place.
                  </p>
                </div>

                {isProcessingPayment ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-[2px] border border-theme-border bg-theme-surface p-8 space-y-6 text-center shadow-sm"
                    aria-live="polite"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-theme-accent/30 border-t-theme-accent bg-theme-bg"
                    >
                      <ShieldCheck className="h-7 w-7 text-theme-accent" strokeWidth={1.5} />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-medium text-theme-ink">
                        Issuing Book_kar. official pass
                      </h3>
                      <p className="text-xs text-theme-muted max-w-sm mx-auto">
                        Verifying reservation with Rajasthan heritage venue registry and generating cryptographic barcoding.
                      </p>
                    </div>
                    {/* Animated progress indicators */}
                    <div className="space-y-2 max-w-xs mx-auto pt-2">
                      <div className="h-1.5 w-full rounded-full bg-theme-border/60 overflow-hidden">
                        <motion.div
                          className="h-full bg-theme-accent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNextStep();
                    }}
                    className="rounded-[2px] border border-theme-border bg-theme-surface p-6 space-y-4 shadow-sm"
                  >
                    <div>
                      <label htmlFor="cardHolder" className="block text-xs font-medium text-theme-ink mb-1.5">
                        Name on card
                      </label>
                      <input
                        id="cardHolder"
                        type="text"
                        required
                        value={paymentDetails.cardHolder}
                        onChange={(e) => {
                          updatePaymentDetails({ cardHolder: e.target.value });
                          if (formErrors.cardHolder) setFormErrors((p) => ({ ...p, cardHolder: '' }));
                        }}
                        placeholder="AARAV SHARMA"
                        className="w-full rounded-[2px] border border-theme-border bg-theme-bg px-3.5 py-2 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none transition-all"
                      />
                      {formErrors.cardHolder && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.cardHolder}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="cardNumber" className="block text-xs font-medium text-theme-ink mb-1.5">
                        Card number
                      </label>
                      <div className="relative">
                        <input
                          id="cardNumber"
                          type="text"
                          required
                          value={paymentDetails.cardNumber}
                          onChange={(e) => {
                            handleCardNumberChange(e.target.value);
                            if (formErrors.cardNumber) setFormErrors((p) => ({ ...p, cardNumber: '' }));
                          }}
                          placeholder="4000 1234 5678 9010"
                          maxLength={19}
                          className="w-full rounded-[2px] border border-theme-border bg-theme-bg px-3.5 py-2 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none font-mono transition-all"
                        />
                        <Lock className="absolute right-3 top-2.5 h-4 w-4 text-theme-muted pointer-events-none" strokeWidth={1.5} />
                      </div>
                      {formErrors.cardNumber && (
                        <p className="text-[11px] text-red-600 mt-1">{formErrors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-xs font-medium text-theme-ink mb-1.5">
                          Expiry date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          required
                          value={paymentDetails.expiry}
                          onChange={(e) => {
                            handleExpiryChange(e.target.value);
                            if (formErrors.expiry) setFormErrors((p) => ({ ...p, expiry: '' }));
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full rounded-[2px] border border-theme-border bg-theme-bg px-3.5 py-2 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none font-mono transition-all"
                        />
                        {formErrors.expiry && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.expiry}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="cvc" className="block text-xs font-medium text-theme-ink mb-1.5">
                          Security code (CVC)
                        </label>
                        <input
                          id="cvc"
                          type="password"
                          required
                          value={paymentDetails.cvc}
                          onChange={(e) => {
                            handleCvcChange(e.target.value);
                            if (formErrors.cvc) setFormErrors((p) => ({ ...p, cvc: '' }));
                          }}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full rounded-[2px] border border-theme-border bg-theme-bg px-3.5 py-2 text-sm text-theme-ink placeholder-theme-muted focus:border-theme-accent focus:ring-1 focus:ring-theme-accent/30 focus:outline-none font-mono transition-all"
                        />
                        {formErrors.cvc && (
                          <p className="text-[11px] text-red-600 mt-1">{formErrors.cvc}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(2)}
                        className="text-xs text-theme-muted hover:text-theme-ink transition-colors"
                      >
                        Back to details
                      </button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-xl bg-theme-accent px-8 py-3 text-sm font-medium text-white dark:text-[#111110] hover:opacity-95 focus:outline-none transition-all shadow-sm"
                      >
                        Authorize payment of ₹{total.toLocaleString('en-IN')}
                      </motion.button>
                    </div>
                  </form>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar: Order Summary Recap (Columns 8-12) */}
        <aside className="lg:col-span-5 rounded-[2px] border border-theme-border bg-theme-surface p-6 space-y-5 shadow-xs">
          <div className="border-b border-theme-border pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-theme-muted font-mono">
              Order overview
            </span>
            <h3 className="font-display text-xl font-medium text-theme-ink mt-2">
              {activeEvent.title}
            </h3>
          </div>

          <div className="space-y-1.5 text-xs text-theme-muted">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-theme-accent flex-shrink-0" strokeWidth={1.5} />
              <span className="text-theme-ink/90">{activeEvent.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-theme-accent flex-shrink-0" strokeWidth={1.5} />
              <span>{activeEvent.venue}, {activeEvent.city}</span>
            </div>
          </div>

          <div className="border-t border-theme-border pt-4 space-y-2">
            <span className="text-xs text-theme-muted font-medium block">
              Items
            </span>

            {activeEvent.type === 'assigned' &&
              selectedSeats.map((seat) => (
                <div key={seat.id} className="flex justify-between text-xs py-1 font-mono">
                  <span className="text-theme-ink">
                    Row {seat.row}, Seat {seat.number}
                  </span>
                  <span className="text-theme-accent font-medium">₹{seat.price.toLocaleString('en-IN')}</span>
                </div>
              ))}

            {activeEvent.type === 'general_admission' &&
              activeEvent.gaTiers?.map((tier) => {
                const qty = gaQuantities[tier.id] || 0;
                if (qty === 0) return null;
                return (
                  <div key={tier.id} className="flex justify-between text-xs py-1">
                    <span className="text-theme-ink">
                      {tier.name} × {qty}
                    </span>
                    <span className="text-theme-accent font-medium font-mono">₹{(tier.price * qty).toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
          </div>

          <div className="space-y-2 border-t border-theme-border pt-4 text-xs">
            <div className="flex justify-between text-theme-muted">
              <span>Subtotal</span>
              <span className="text-theme-ink font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-theme-muted">
              <span>Venue facility & heritage preservation</span>
              <span className="text-theme-ink font-mono">₹{bookingFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-theme-border pt-3 text-sm">
              <span className="font-medium text-theme-ink">Total balance</span>
              <span className="font-display text-xl font-normal italic text-theme-accent font-mono">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {guestDetails.email && checkoutStep === 3 && (
            <div className="border-t border-theme-border pt-4 text-xs text-theme-muted">
              <span>Confirmation dispatch: </span>
              <span className="text-theme-ink font-medium">{guestDetails.email}</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
