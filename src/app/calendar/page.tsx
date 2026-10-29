'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Sparkles, ArrowLeft } from 'lucide-react';
import CalendarComponent from '@/components/CalendarComponent';
import { EventItem } from '@/types';

export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error('Failed to load events for calendar', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Banner */}
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Schedule</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Community Event Calendar
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore upcoming festival dates, multi-day temple fairs, concerts, and college hackathons so you and your family can plan ahead.
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {isLoading ? (
          <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
        ) : (
          <CalendarComponent events={events} />
        )}
      </div>
    </div>
  );
}
