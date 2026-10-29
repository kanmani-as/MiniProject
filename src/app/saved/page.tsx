'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bookmark, 
  Ticket, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  QrCode, 
  Printer, 
  Trash2, 
  Sparkles,
  Compass
} from 'lucide-react';
import { EventItem, Registration } from '@/types';
import { getSavedEventIds, getSavedPasses } from '@/lib/bookmarks';
import { formatDate } from '@/lib/utils';
import EventCard from '@/components/EventCard';

export default function SavedAndPassesPage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'passes'>('bookmarks');
  const [savedEvents, setSavedEvents] = useState<EventItem[]>([]);
  const [passes, setPasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const savedIds = getSavedEventIds();
      const localPasses = getSavedPasses();
      setPasses(localPasses);

      if (savedIds.length > 0) {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success) {
          const matched = data.data.filter((e: EventItem) => savedIds.includes(e.id));
          setSavedEvents(matched);
        }
      } else {
        setSavedEvents([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleBookmarkChange = () => loadData();
    const handlePassesChange = () => loadData();
    window.addEventListener('utsav_bookmarks_changed', handleBookmarkChange);
    window.addEventListener('utsav_passes_changed', handlePassesChange);
    return () => {
      window.removeEventListener('utsav_bookmarks_changed', handleBookmarkChange);
      window.removeEventListener('utsav_passes_changed', handlePassesChange);
    };
  }, []);

  const clearPasses = () => {
    if (!confirm('Are you sure you want to clear your stored passes?')) return;
    localStorage.removeItem('utsav_my_passes');
    setPasses([]);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-white py-10 sm:py-14 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-3">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Vault</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Saved Events & Digital Passes
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Access your bookmarked cultural festivals and verified entry passes anytime from this browser.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeTab === 'bookmarks'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarked Festivals ({savedEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('passes')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeTab === 'passes'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Issued Digital Passes ({passes.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* TAB 1: BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-72 rounded-3xl bg-slate-200 animate-pulse" />
                ))}
              </div>
            ) : savedEvents.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No Saved Events Yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click the bookmark ribbon icon on any event card while browsing to save it to your personal list.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
                >
                  Explore Festivals Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} viewMode="grid" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PASSES */}
        {activeTab === 'passes' && (
          <div>
            {passes.length > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearPasses}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Passes</span>
                </button>
              </div>
            )}

            {passes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No Digital Passes Issued Yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  When you RSVP or book a pass for any upcoming festival or college event, your official ticket will appear here.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
                >
                  Find Events to Attend
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {passes.map((pass) => (
                  <div
                    key={pass.id}
                    className="bg-white rounded-3xl border-2 border-dashed border-orange-300 p-6 shadow-md relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                          Verified Pass
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-2 line-clamp-1">
                          {pass.eventTitle}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          <span>{pass.eventVenue}</span>
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          <span>{formatDate(pass.eventDate)}</span>
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <QrCode className="w-16 h-16 text-slate-900" />
                        <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">
                          {pass.registrationCode}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendee</span>
                        <span className="font-bold text-slate-800">{pass.userName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Passes</span>
                        <span className="font-bold text-slate-800">{pass.ticketsCount} Person(s)</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">
                        Issued: {new Date(pass.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Pass</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
