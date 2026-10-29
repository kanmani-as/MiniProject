'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Ticket, 
  Share2, 
  Bookmark, 
  Phone, 
  Mail, 
  Globe, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  ExternalLink,
  CalendarPlus,
  Navigation
} from 'lucide-react';
import { EventItem } from '@/types';
import { formatDate, formatEventDateRange, downloadCalendarIcs, getGoogleCalendarUrl } from '@/lib/utils';
import { isEventSaved, toggleSaveEvent } from '@/lib/bookmarks';
import RegistrationModal from '@/components/RegistrationModal';
import ShareModal from '@/components/ShareModal';
import EventCard from '@/components/EventCard';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setEvent(data.data);
          setIsSaved(isEventSaved(data.data.id));

          // Fetch related events
          const relRes = await fetch(`/api/events?category=${data.data.categoryId}`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelatedEvents(relData.data.filter((e: EventItem) => e.id !== data.data.id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to load event details', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleBookmarkToggle = () => {
    if (!event) return;
    const newState = toggleSaveEvent(event.id);
    setIsSaved(newState);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
            <div className="h-32 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-64 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-slate-500 mt-2">The event listing you are looking for may have been removed or updated.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Listings</span>
        </Link>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue}, ${event.address}, ${event.city}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
          <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-orange-600 transition-colors">
            Categories
          </Link>
          <span>/</span>
          {event.category && (
            <>
              <Link href={`/categories/${event.category.slug}`} className="hover:text-orange-600 transition-colors">
                {event.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-800 font-semibold truncate max-w-xs">{event.title}</span>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-35 filter blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow-sm">
                {event.category?.name || 'Local Event'}
              </span>
              {event.isVerified && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Listing
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
                {event.city}, {event.state}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {event.shortDescription}
            </p>

            {/* Quick Meta Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className="font-bold">{formatEventDateRange(event.startDate, event.endDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all shadow-md"
              title="Share event"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleBookmarkToggle}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-md ${
                isSaved
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save event'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex-1 md:flex-initial px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Ticket className="w-5 h-5" />
              <span>{event.isFree ? 'RSVP / Free Digital Pass' : `Book Pass (₹${event.ticketPrice})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Event Description Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <span>About this Festival / Programme</span>
              </h2>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Tags:</span>
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule / Agenda Timeline (if available) */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span>Programme Itinerary & Schedule</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-200">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90">
                        <span className="text-xs font-mono font-bold text-orange-600 uppercase">
                          {item.time}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base mt-0.5">
                          {item.title}
                        </h4>
                        {item.speakerOrPerformer && (
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            Performer / Speaker: <span className="text-slate-800">{item.speakerOrPerformer}</span>
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-slate-600 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue & Location Directions Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>Venue & Location Directions</span>
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">{event.venue}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{event.address}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {event.city}, {event.state} {event.pincode ? `- ${event.pincode}` : ''}
                </p>
              </div>

              {/* Simulated Map Display */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 shadow-sm">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Interactive Navigation Route</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Open coordinates directly in Google Maps for turn-by-turn driving, bus, or metro directions.
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Ticket / Pass Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Admission Fee
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  event.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {event.isFree ? 'FREE PUBLIC ENTRY' : `₹${event.ticketPrice} per person`}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Event Start:</span>
                  <span className="font-semibold text-slate-800">{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Event End:</span>
                  <span className="font-semibold text-slate-800">{formatDate(event.endDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Daily Timings:</span>
                  <span className="font-semibold text-slate-800">{event.startTime} – {event.endTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Expected Crowd:</span>
                  <span className="font-semibold text-slate-800">{event.expectedAttendees.toLocaleString()}+ Visitors</span>
                </div>
              </div>

              <button
                onClick={() => setIsRegisterOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                <span>{event.isFree ? 'Get Digital Pass / RSVP' : 'Book Passes Online'}</span>
              </button>

              {/* Add to Calendar (.ics / Google) */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => downloadCalendarIcs(event)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-orange-600" />
                  <span>Download .ICS</span>
                </button>
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-orange-600" />
                  <span>Google Cal</span>
                </a>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Organized By
              </span>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{event.organizerName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Official community host / committee</p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                {event.organizerPhone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{event.organizerPhone}</span>
                  </p>
                )}
                {event.organizerEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="truncate">{event.organizerEmail}</span>
                  </p>
                )}
                {event.organizerWebsite && (
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-600 shrink-0" />
                    <a
                      href={event.organizerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline truncate"
                    >
                      {event.organizerWebsite}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  More Events in {event.category?.name || 'this Category'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Other gatherings you might like to attend
                </p>
              </div>
              <Link
                href={`/categories/${event.category?.slug}`}
                className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                View Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <EventCard key={rel.id} event={rel} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* Share Modal */}
      <ShareModal
        event={event}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
