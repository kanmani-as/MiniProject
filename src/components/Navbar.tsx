'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Compass, 
  Grid, 
  Bookmark, 
  PlusCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles,
  Search
} from 'lucide-react';
import { getSavedEventIds } from '@/lib/bookmarks';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const updateCounts = () => {
    setSavedCount(getSavedEventIds().length);
  };

  useEffect(() => {
    updateCounts();
    const handleBookmarkChange = () => updateCounts();
    window.addEventListener('utsav_bookmarks_changed', handleBookmarkChange);
    return () => {
      window.removeEventListener('utsav_bookmarks_changed', handleBookmarkChange);
    };
  }, []);

  const navLinks = [
    { label: 'Explore Events', href: '/', icon: Compass },
    { label: 'Categories', href: '/categories', icon: Grid },
    { label: 'Event Calendar', href: '/calendar', icon: Calendar },
    { 
      label: 'Saved & Passes', 
      href: '/saved', 
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Utsav<span className="text-blue-600">Hub</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Local Events
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Festivals • Cultural Meets • Fairs • Concerts
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-xs' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/submit-event"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-slate-700 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Submit Event</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/25 transition-all hover:shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/saved"
              className="relative p-2 text-slate-600 hover:text-blue-600 sm:hidden"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/submit-event"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Submit an Event / Festival
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <ShieldCheck className="w-4 h-4" />
              Administrator Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
