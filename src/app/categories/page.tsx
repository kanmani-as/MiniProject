'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Category } from '@/types';

export default function CategoriesDirectoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
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
              <Layers className="w-3.5 h-3.5" />
              <span>Category Directory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Event & Festival Categories
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore categorized listings tailored for cultural preservation, spiritual processions, academic symposiums, shopping bazaars, and musical recitals.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <span className="absolute bottom-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-orange-700 shadow-sm">
                      {cat.eventCount || 0} Events Active
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-orange-600 border-t border-slate-100">
                  <span>Browse Category Events</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
