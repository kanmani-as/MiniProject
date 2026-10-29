'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Tag, 
  Calendar as CalendarIcon, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Category } from '@/types';

interface HeroBannerProps {
  categories: Category[];
  cities: string[];
  totalEventsCount: number;
}

export default function HeroBanner({ categories, cities, totalEventsCount }: HeroBannerProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'weekend' | 'month'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedDateFilter && selectedDateFilter !== 'all') params.set('date', selectedDateFilter);

    router.push(`/?${params.toString()}#events-directory`);
  };

  const handlePillClick = (filter: 'all' | 'today' | 'tomorrow' | 'weekend' | 'month') => {
    setSelectedDateFilter(filter);
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (filter !== 'all') params.set('date', filter);

    router.push(`/?${params.toString()}#events-directory`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-500/10 via-sky-500/5 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-blue-100">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Centralized Local Event & Festival Portal</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Discover Local Festivals, Fairs & Events{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">
              Happening Near You
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Find accurate dates, venues, timings, entry passes, and contact details for temple processions, cultural festivals, college meets, handicraft melas, and concerts in one convenient place.
          </p>

          {/* Search Box Card */}
          <div className="mt-8 sm:mt-10 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-200/80">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                {/* Keyword */}
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by event name, festival, artist..."
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* City */}
                <div className="sm:col-span-3 relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="all">All Cities / Towns</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="sm:col-span-4 relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Date Pills & Submit Button */}
              <div className="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                  <span className="text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Quick dates:
                  </span>
                  {[
                    { key: 'all', label: 'All Dates' },
                    { key: 'today', label: 'Today' },
                    { key: 'tomorrow', label: 'Tomorrow' },
                    { key: 'weekend', label: 'This Weekend' },
                    { key: 'month', label: 'This Month' },
                  ].map((pill) => (
                    <button
                      key={pill.key}
                      type="button"
                      onClick={() => handlePillClick(pill.key as any)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                        selectedDateFilter === pill.key
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Events</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-blue-200/50">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{totalEventsCount}+</div>
              <div className="text-xs text-slate-500 font-medium">Curated Events & Fests</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{categories.length}</div>
              <div className="text-xs text-slate-500 font-medium">Cultural Categories</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{cities.length || 5}+</div>
              <div className="text-xs text-slate-500 font-medium">Cities & Heritage Hubs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-6 h-6" /> 100%
              </div>
              <div className="text-xs text-slate-500 font-medium">Admin Verified Info</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
