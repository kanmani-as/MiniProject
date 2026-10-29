export type EventStatus = 'PUBLISHED' | 'DRAFT' | 'PENDING_REVIEW';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  imageUrl: string;
  displayOrder: number;
  eventCount?: number;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  speakerOrPerformer?: string;
  description?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  category?: Category;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  startTime: string; // e.g. "05:30 PM"
  endTime: string;   // e.g. "09:30 PM"
  venue: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isFree: boolean;
  ticketPrice: number;
  ticketLink?: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizerWebsite?: string;
  imageUrl: string;
  isFeatured: boolean;
  isVerified: boolean;
  status: EventStatus;
  expectedAttendees: number;
  schedule?: EventScheduleItem[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle?: string;
  eventDate?: string;
  eventVenue?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  ticketsCount: number;
  registrationCode: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';
  createdAt: string;
}

export interface FilterOptions {
  search?: string;
  categoryId?: string;
  city?: string;
  dateFilter?: 'all' | 'today' | 'tomorrow' | 'weekend' | 'month' | 'custom';
  customDate?: string;
  priceFilter?: 'all' | 'free' | 'paid';
  onlyVerified?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}
