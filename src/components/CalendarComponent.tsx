'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Ticket
} from 'lucide-react';
import { EventItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface CalendarComponentProps {
  events: EventItem[];
}

export default function CalendarComponent({ events }: CalendarComponentProps) {
  // Start with November 2026 (matching our sample events timeline)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Month is 0-indexed (10 = Nov)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-12');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar matrix calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Map events to date strings
  const eventsByDate = useMemo(() => {
    const map: { [dateStr: string]: EventItem[] } = {};
    events.forEach(evt => {
      // Loop from startDate to endDate
      const start = new Date(evt.startDate);
      const end = new Date(evt.endDate);
      const cur = new Date(start);

      while (cur <= end) {
        const curStr = cur.toISOString().split('T')[0];
        if (!map[curStr]) map[curStr] = [];
        if (!map[curStr].some(e => e.id === evt.id)) {
          map[curStr].push(evt);
        }
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [events]);

  // Selected date events
  const selectedDayEvents = eventsByDate[selectedDateStr] || [];

  return (
    <div className="space-y-8">
      {/* Calendar Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {monthNames[month]} {year}
              </h2>
              <p className="text-xs text-slate-500">
                Click any highlighted date to inspect local events and festivals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 10, 1))}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Jump to Nov 2026
            </button>
            <button
              onClick={nextMonth}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before day 1 */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 sm:h-28 rounded-xl bg-slate-50/50 border border-transparent" />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const fullDateStr = `${year}-${monthStr}-${dayStr}`;
            const dayEvents = eventsByDate[fullDateStr] || [];
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDateStr === fullDateStr;

            return (
              <button
                key={fullDateStr}
                onClick={() => setSelectedDateStr(fullDateStr)}
                className={`h-20 sm:h-28 rounded-2xl p-2 sm:p-2.5 text-left flex flex-col justify-between transition-all border relative group ${
                  isSelected
                    ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/60 shadow-sm'
                    : hasEvents
                    ? 'border-orange-200 bg-white hover:bg-orange-50/30 hover:border-orange-300'
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs sm:text-sm font-bold ${
                    isSelected 
                      ? 'text-orange-600 font-extrabold' 
                      : hasEvents 
                      ? 'text-slate-900' 
                      : 'text-slate-400'
                  }`}>
                    {dayNum}
                  </span>

                  {hasEvents && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </div>

                {hasEvents ? (
                  <div className="space-y-1 overflow-hidden w-full">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[9px] sm:text-[10px] font-semibold truncate px-1.5 py-0.5 rounded bg-orange-100 text-orange-800"
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] font-bold text-slate-500 pl-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-300 hidden sm:block">No events</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Event Drilldown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">
              Day Schedule Breakdown
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Events for {formatDate(selectedDateStr)}
            </h3>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 w-fit">
            {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'Event Scheduled' : 'Events Scheduled'}
          </span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">No events or festivals found on this specific date.</p>
            <p className="text-xs text-slate-400 mt-1">Select another day with an orange indicator dot above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {selectedDayEvents.map((evt) => (
              <div
                key={evt.id}
                className="rounded-2xl border border-slate-200 p-5 hover:border-orange-300 transition-all hover:shadow-md flex flex-col justify-between bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      {evt.category?.name}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      evt.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {evt.isFree ? 'FREE ENTRY' : `₹${evt.ticketPrice}`}
                    </span>
                  </div>

                  <Link href={`/events/${evt.id}`}>
                    <h4 className="font-bold text-slate-900 hover:text-orange-600 transition-colors text-base line-clamp-1">
                      {evt.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {evt.shortDescription}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{evt.startTime} - {evt.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span className="truncate">{evt.venue}, {evt.city}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    By {evt.organizerName}
                  </span>
                  <Link
                    href={`/events/${evt.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
