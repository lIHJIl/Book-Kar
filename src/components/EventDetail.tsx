import React from 'react';
import { useBooking } from '../context/BookingContext';
import { SeatMap } from './SeatMap';
import { GeneralAdmissionSelector } from './GeneralAdmissionSelector';
import { OrderSummaryPanel } from './OrderSummaryPanel';
import { ArrowLeft, Calendar, Clock, MapPin, Info } from 'lucide-react';

export const EventDetail: React.FC = () => {
  const { activeEvent, backToDiscovery } = useBooking();

  if (!activeEvent) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Return Navigation */}
      <div className="mb-6">
        <button
          onClick={backToDiscovery}
          className="group inline-flex items-center gap-2 text-xs font-medium text-theme-muted hover:text-theme-ink focus:outline-none transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.5} />
          <span>Return to seasonal repertoire</span>
        </button>
      </div>

      {/* Main Layout: Left Event Content + Right Sticky Order Panel */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Left Column: Event Hero, Info & Ticket Selector */}
        <div className="flex-1 w-full space-y-10">
          {/* Header & Featured Media */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl bg-theme-border/40 aspect-[21/9] sm:aspect-[2.4/1] w-full">
              <img
                src={activeEvent.heroImage}
                alt={activeEvent.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="rounded-[2px] border border-theme-border px-2 py-0.5 text-xs font-medium text-theme-muted capitalize">
                  {activeEvent.category}
                </span>
                <span className="text-xs text-theme-muted">
                  Doors open {activeEvent.doorsOpen}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-theme-ink tracking-tight leading-tight">
                {activeEvent.title}
              </h1>

              {activeEvent.subtitle && (
                <p className="font-body text-base text-theme-muted leading-relaxed">
                  {activeEvent.subtitle}
                </p>
              )}
            </div>

            {/* Event Schedule & Location Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-theme-border py-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-theme-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="block font-medium text-theme-ink">Performance date</span>
                  <span className="text-theme-muted">{activeEvent.date}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-theme-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="block font-medium text-theme-ink">Performance time</span>
                  <span className="text-theme-muted">{activeEvent.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-theme-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="block font-medium text-theme-ink">{activeEvent.venue}</span>
                  <span className="text-theme-muted">{activeEvent.address}</span>
                </div>
              </div>
            </div>

            {/* Curatorial Description */}
            <div className="space-y-3 text-sm leading-relaxed text-theme-ink/80">
              <p>{activeEvent.description}</p>
              {activeEvent.curatorNote && (
                <div className="rounded-[2px] border border-theme-border bg-theme-surface/60 p-3.5 text-xs text-theme-muted flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-theme-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>{activeEvent.curatorNote}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Selection Area */}
          <div className="border-t border-theme-border pt-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-normal text-theme-ink">
                {activeEvent.type === 'assigned' ? 'Select your seats' : 'Select your admission passes'}
              </h2>
              <p className="text-xs text-theme-muted mt-1">
                {activeEvent.type === 'assigned'
                  ? 'Tap available positions on the interactive auditorium plan below. Up to 6 seats per booking.'
                  : 'Choose admission tier passes. Instant digital ticket issuance upon checkout.'}
              </p>
            </div>

            {activeEvent.type === 'assigned' && activeEvent.sections ? (
              <SeatMap sections={activeEvent.sections} tiers={activeEvent.tiers} />
            ) : (
              activeEvent.gaTiers && <GeneralAdmissionSelector tiers={activeEvent.gaTiers} />
            )}
          </div>
        </div>

        {/* Right Sticky Column: Order Summary */}
        <OrderSummaryPanel />
      </div>
    </div>
  );
};
