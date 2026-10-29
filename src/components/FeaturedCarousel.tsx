'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Ticket
} from 'lucide-react';
import { EventItem } from '@/types';
import { formatEventDateRange } from '@/lib/utils';

interface FeaturedCarouselProps {
  events: EventItem[];
}

export default function FeaturedCarousel({ events }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!events.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [events.length]);

  if (!events || events.length === 0) return null;

  const current = events[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Featured Highlights & Mega Festivals
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Major celebrations drawing thousands of visitors from across the region
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-400 px-1">
              {currentIndex + 1} / {events.length}
            </span>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all shadow-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800">
          <div className="relative h-[420px] sm:h-[480px] w-full">
            {/* Background Image */}
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-cover opacity-45 mix-blend-luminosity scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end max-w-3xl">
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500 text-white shadow-md">
                  {current.category?.name || 'Featured Festival'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {current.isFree ? 'Free Public Entry' : `₹${current.ticketPrice} / Pass`}
                </span>
                {current.isVerified && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    ✓ Verified by Administration
                  </span>
                )}
              </div>

              {/* Title */}
              <Link href={`/events/${current.id}`}>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight hover:text-orange-400 transition-colors line-clamp-2">
                  {current.title}
                </h3>
              </Link>

              {/* Description */}
              <p className="mt-3 text-slate-300 text-sm sm:text-base line-clamp-2 leading-relaxed">
                {current.shortDescription}
              </p>

              {/* Key Meta */}
              <div className="mt-5 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span className="font-semibold">{formatEventDateRange(current.startDate, current.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>{current.startTime} - {current.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{current.venue}, {current.city}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/events/${current.id}`}
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <span>Explore Full Event Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-xs text-slate-400 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                  Organized by: <span className="text-white font-medium">{current.organizerName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-10">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-7 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
