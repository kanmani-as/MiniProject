'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Layers, 
  Compass, 
  PlusCircle, 
  Search,
  Filter
} from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import { Category, EventItem, FilterOptions } from '@/types';

function HomePageContent() {
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('category') || undefined,
    city: searchParams.get('city') || undefined,
    dateFilter: (searchParams.get('date') as FilterOptions['dateFilter']) || 'all',
    customDate: searchParams.get('customDate') || undefined,
    priceFilter: 'all',
    onlyVerified: false,
  });

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch categories
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.data);
        }

        // Fetch all events
        const evRes = await fetch('/api/events');
        const evData = await evRes.json();
        if (evData.success) {
          setEvents(evData.data);
          setCities(evData.cities || []);
          setFeaturedEvents(evData.data.filter((e: EventItem) => e.isFeatured));
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update filters if URL parameters change
  useEffect(() => {
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const city = searchParams.get('city') || undefined;
    const date = (searchParams.get('date') as FilterOptions['dateFilter']) || undefined;

    setFilters(prev => ({
      ...prev,
      search: search !== undefined ? search : prev.search,
      categoryId: category !== undefined ? category : prev.categoryId,
      city: city !== undefined ? city : prev.city,
      dateFilter: date !== undefined ? date : prev.dateFilter,
    }));
  }, [searchParams]);

  // Compute filtered events client-side
  const filteredEvents = events.filter((ev) => {
    // Search
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const match =
        ev.title.toLowerCase().includes(q) ||
        ev.shortDescription.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.city.toLowerCase().includes(q) ||
        ev.organizerName.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category
    if (filters.categoryId && filters.categoryId !== 'all') {
      if (ev.categoryId !== filters.categoryId) return false;
    }

    // City
    if (filters.city && filters.city !== 'all') {
      if (ev.city.toLowerCase() !== filters.city.toLowerCase()) return false;
    }

    // Price
    if (filters.priceFilter === 'free' && !ev.isFree) return false;
    if (filters.priceFilter === 'paid' && ev.isFree) return false;

    // Verified
    if (filters.onlyVerified && !ev.isVerified) return false;

    // Date
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      if (filters.dateFilter === 'today') {
        if (!(ev.startDate <= todayStr && ev.endDate >= todayStr)) return false;
      } else if (filters.dateFilter === 'tomorrow') {
        const tom = new Date(now);
        tom.setDate(tom.getDate() + 1);
        const tomStr = tom.toISOString().split('T')[0];
        if (!(ev.startDate <= tomStr && ev.endDate >= tomStr)) return false;
      } else if (filters.dateFilter === 'weekend') {
        const dayOfWeek = now.getDay();
        const daysUntilSat = (6 - dayOfWeek + 7) % 7;
        const sat = new Date(now);
        sat.setDate(sat.getDate() + daysUntilSat);
        const sun = new Date(sat);
        sun.setDate(sun.getDate() + 1);
        const satStr = sat.toISOString().split('T')[0];
        const sunStr = sun.toISOString().split('T')[0];
        if (!(ev.startDate <= sunStr && ev.endDate >= satStr)) return false;
      } else if (filters.dateFilter === 'month') {
        const curMonth = todayStr.substring(0, 7);
        if (!(ev.startDate.startsWith(curMonth) || ev.endDate.startsWith(curMonth))) return false;
      } else if (filters.dateFilter === 'custom' && filters.customDate) {
        if (!(ev.startDate <= filters.customDate && ev.endDate >= filters.customDate)) return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBanner
        categories={categories}
        cities={cities}
        totalEventsCount={events.length}
      />

      {/* Featured Mega Festivals Carousel */}
      {featuredEvents.length > 0 && (
        <FeaturedCarousel events={featuredEvents} />
      )}

      {/* Category Explorer Highlights */}
      <section className="py-10 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                <Layers className="w-4 h-4" />
                <span>Categories of Local Life</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explore by Celebration Type
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    categoryId: prev.categoryId === cat.id ? undefined : cat.id
                  }));
                  const el = document.getElementById('events-directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  filters.categoryId === cat.id
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25 scale-[1.02]'
                    : 'bg-white hover:bg-orange-50/50 hover:border-orange-300 border-slate-200/90 shadow-xs'
                }`}
              >
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-3 ${
                    filters.categoryId === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {cat.eventCount || 0} Events
                  </span>
                  <h3 className={`font-bold text-sm leading-snug line-clamp-2 ${
                    filters.categoryId === cat.id ? 'text-white' : 'text-slate-900 group-hover:text-orange-600'
                  }`}>
                    {cat.name}
                  </h3>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                    filters.categoryId === cat.id ? 'text-white' : 'text-slate-400'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Events Directory */}
      <section id="events-directory" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Local Events & Festivals Directory
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse upcoming temple gatherings, college hackathons, book fairs, and live performances
            </p>
          </div>

          {/* Interactive Filters */}
          <EventFilters
            categories={categories}
            cities={cities}
            filters={filters}
            onFilterChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalFilteredCount={filteredEvents.length}
          />

          {/* Event Cards Grid / List */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-6">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No events matched your search</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Try clearing some filters, selecting a different city, or choosing another category.
              </p>
              <button
                onClick={() => setFilters({ dateFilter: 'all', priceFilter: 'all', onlyVerified: false })}
                className="mt-4 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} viewMode="list" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Callout Banner */}
      <section className="py-14 bg-gradient-to-tr from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Are You An Organizer?
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold mt-1 tracking-tight">
                Promote Your Local Festival, Fair, or College Programme
              </h2>
              <p className="text-orange-100 text-sm sm:text-base mt-2 leading-relaxed">
                Reach thousands of town residents, pilgrims, and students. Submit your event details for administrative verification and publication on UtsavHub.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/submit-event"
                className="px-6 py-3.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-extrabold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
              >
                <PlusCircle className="w-5 h-5 text-orange-600" />
                <span>Submit Your Event Free</span>
              </Link>
              <Link
                href="/calendar"
                className="px-6 py-3.5 rounded-xl bg-orange-700/60 hover:bg-orange-700/80 text-white border border-white/20 font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>View Event Calendar</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
