'use client';

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  CheckCircle, 
  Sparkles, 
  Calendar,
  IndianRupee,
  MapPin
} from 'lucide-react';
import { Category, FilterOptions } from '@/types';

interface EventFiltersProps {
  categories: Category[];
  cities: string[];
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalFilteredCount: number;
}

export default function EventFilters({
  categories,
  cities,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
}: EventFiltersProps) {
  const handleCategorySelect = (categoryId: string) => {
    onFilterChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      city: e.target.value === 'all' ? undefined : e.target.value,
    });
  };

  const handleDateSelect = (dateFilter: FilterOptions['dateFilter']) => {
    onFilterChange({
      ...filters,
      dateFilter,
      customDate: dateFilter === 'custom' ? filters.customDate : undefined,
    });
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      dateFilter: 'custom',
      customDate: e.target.value,
    });
  };

  const handlePriceSelect = (priceFilter: FilterOptions['priceFilter']) => {
    onFilterChange({
      ...filters,
      priceFilter,
    });
  };

  const handleVerifiedToggle = () => {
    onFilterChange({
      ...filters,
      onlyVerified: !filters.onlyVerified,
    });
  };

  const handleReset = () => {
    onFilterChange({
      search: undefined,
      categoryId: undefined,
      city: undefined,
      dateFilter: 'all',
      customDate: undefined,
      priceFilter: 'all',
      onlyVerified: false,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.categoryId ||
    filters.city ||
    (filters.dateFilter && filters.dateFilter !== 'all') ||
    (filters.priceFilter && filters.priceFilter !== 'all') ||
    filters.onlyVerified
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-8 space-y-5">
      {/* Top Filter Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Filter & Discover Listings
            </h3>
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-orange-600">{totalFilteredCount}</span> matching events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-slate-600">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Browse by Category
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              !filters.categoryId
                ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const isSelected = filters.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                {cat.eventCount !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.eventCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Facet Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* City Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            City / Locality
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.city || 'all'}
              onChange={handleCitySelect}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Timeline Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.dateFilter || 'all'}
              onChange={(e) => handleDateSelect(e.target.value as any)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
            >
              <option value="all">Any Upcoming Date</option>
              <option value="today">Happening Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="weekend">This Weekend</option>
              <option value="month">This Month</option>
              <option value="custom">Specific Date...</option>
            </select>
          </div>
        </div>

        {/* Custom Date Picker (when custom selected) or Ticket Filter */}
        {filters.dateFilter === 'custom' ? (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Pick Date
            </label>
            <input
              type="date"
              value={filters.customDate || ''}
              onChange={handleCustomDateChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Entry Type
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => handlePriceSelect('all')}
                className={`py-1.5 rounded-lg font-medium transition-all ${
                  !filters.priceFilter || filters.priceFilter === 'all'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handlePriceSelect('free')}
                className={`py-1.5 rounded-lg font-medium transition-all ${
                  filters.priceFilter === 'free'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => handlePriceSelect('paid')}
                className={`py-1.5 rounded-lg font-medium transition-all ${
                  filters.priceFilter === 'paid'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paid
              </button>
            </div>
          </div>
        )}

        {/* Verified Badge Checkbox */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleVerifiedToggle}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              filters.onlyVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <CheckCircle
              className={`w-4 h-4 ${
                filters.onlyVerified ? 'text-emerald-600 fill-emerald-100' : 'text-slate-400'
              }`}
            />
            <span>Admin Verified Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
