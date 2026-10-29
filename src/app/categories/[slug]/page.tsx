'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Layers, Compass, Sparkles } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { Category, EventItem } from '@/types';

export default function CategoryEventsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryAndEvents() {
      setIsLoading(true);
      try {
        // Fetch categories to find matched
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.success) {
          const matched = catData.data.find((c: Category) => c.slug === slug);
          if (matched) {
            setCategory(matched);
            // Fetch events for this category
            const evRes = await fetch(`/api/events?category=${matched.id}`);
            const evData = await evRes.json();
            if (evData.success) {
              setEvents(evData.data);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load category events', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      loadCategoryAndEvents();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-48 rounded-3xl bg-slate-200 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Category Not Found</h2>
        <p className="text-slate-500 mt-2">The category you requested could not be located.</p>
        <Link
          href="/categories"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View All Categories</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Category Hero */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-14 sm:py-20">
        <div className="absolute inset-0">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover opacity-25 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Category Explorer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{category.name}</h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {category.description}
          </p>

          <div className="mt-6 inline-block px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-orange-200 border border-white/20">
            {events.length} {events.length === 1 ? 'Event Listed' : 'Events Listed'}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {events.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No events currently listed in this category</h3>
            <p className="text-sm text-slate-500 mt-1">
              Be the first organizer to submit a listing for {category.name}!
            </p>
            <Link
              href="/submit-event"
              className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
            >
              Submit an Event Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
