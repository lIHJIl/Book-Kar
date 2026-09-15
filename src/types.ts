export type EventCategory = 'concerts' | 'theatre' | 'sports' | 'festivals';

export interface SeatTier {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  tierId: string;
  price: number;
  status: 'available' | 'sold';
}

export interface SeatSection {
  name: string;
  rows: {
    row: string;
    seats: Seat[];
  }[];
}

export interface GeneralAdmissionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  available: number;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  date: string;
  time: string;
  doorsOpen: string;
  venue: string;
  city: string;
  address: string;
  startingPrice: number;
  heroImage: string;
  thumbnailImage: string;
  description: string;
  curatorNote?: string;
  type: 'assigned' | 'general_admission';
  sections?: SeatSection[];
  tiers?: SeatTier[];
  gaTiers?: GeneralAdmissionTier[];
  featured?: boolean;
}

export interface GuestDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvc: string;
}

export interface ConfirmedTicket {
  ticketNumber: string;
  event: EventItem;
  seats?: Seat[];
  gaSelection?: { tierName: string; quantity: number; unitPrice: number }[];
  guest: GuestDetails;
  subtotal: number;
  bookingFee: number;
  total: number;
  issuedAt: string;
  entryGate: string;
  barcodeValue: string;
}

export type ViewScreen = 'discovery' | 'detail' | 'checkout' | 'confirmation';
