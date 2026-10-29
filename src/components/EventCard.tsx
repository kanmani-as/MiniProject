'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Bookmark, 
  ArrowRight, 
  Ticket,
  Users
} from 'lucide-react';
import { EventItem } from '@/types';
import { formatDate, formatEventDateRange } from '@/lib/utils';
import { isEventSaved, toggleSaveEvent } from '@/lib/bookmarks';

interface EventCardProps {
  event: EventItem;
  viewMode?: 'grid' | 'list';
}

export default function EventCard({ event, viewMode = 'grid' }: EventCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isEventSaved(event.id));
    const handleBookmarkChange = () => {
      setSaved(isEventSaved(event.id));
    };
    window.addEventListener('utsav_bookmarks_changed', handleBookmarkChange);
    return () => {
      window.removeEventListener('utsav_bookmarks_changed', handleBookmarkChange);
    };
  }, [event.id]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSaveEvent(event.id);
    setSaved(newState);
  };

  const getCategoryColor = (catId?: string) => {
    switch (catId) {
      case 'cat-1': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cat-2': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cat-3': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cat-4': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cat-5': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cat-6': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'cat-7': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:border-orange-200 flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div className="relative md:w-72 h-52 md:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          
          <button
            onClick={handleBookmarkClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              saved 
                ? 'bg-orange-500 text-white' 
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-orange-600'
            }`}
            title={saved ? 'Remove from saved' : 'Save event'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>

          <div className="absolute bottom-3 left-3 md:hidden">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.categoryId)}`}>
              {event.category?.name || 'Local Event'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="hidden md:flex items-center justify-between gap-2 mb-2">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(event.categoryId)}`}>
                {event.category?.name || 'Local Event'}
              </span>
              {event.isVerified && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Verified Listing
                </span>
              )}
            </div>

            <Link href={`/events/${event.id}`}>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                {event.title}
              </h3>
            </Link>

            <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {event.shortDescription}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium text-orange-950">
                <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{formatEventDateRange(event.startDate, event.endDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{event.venue}, {event.city}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                event.isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-800'
              }`}>
                {event.isFree ? 'FREE ENTRY' : `₹${event.ticketPrice} / person`}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 hidden sm:inline truncate max-w-[140px]">
                By {event.organizerName}
              </span>
            </div>

            <Link
              href={`/events/${event.id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all group-hover:translate-x-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:border-orange-200 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top category & bookmark row */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs border backdrop-blur-md ${getCategoryColor(event.categoryId)}`}>
              {event.category?.name || 'Local Event'}
            </span>

            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                saved 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-orange-600'
              }`}
              title={saved ? 'Remove from saved' : 'Save event'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Bottom image overlay: Date & Verification */}
          <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>{formatEventDateRange(event.startDate, event.endDate)}</span>
            </div>

            {event.isVerified && (
              <span className="flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <Link href={`/events/${event.id}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors text-base sm:text-lg line-clamp-1">
              {event.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          <div className="mt-4 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
            event.isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-800'
          }`}>
            {event.isFree ? 'FREE ENTRY' : `₹${event.ticketPrice}`}
          </span>
        </div>

        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
