import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Calendar, Mail, Phone, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Utsav<span className="text-orange-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A centralized civic web portal dedicated to local festivals, temple chariot processions, college competitions, fairs, exhibitions, and cultural programmes.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-lg">
              <Shield className="w-4 h-4 shrink-0 text-amber-400" />
              <span>All listings verified by website administrators or registered organizers.</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Explore Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/categories/cultural-festivals" className="hover:text-orange-400 transition-colors">
                  Cultural Festivals & Melas
                </Link>
              </li>
              <li>
                <Link href="/categories/religious-events" className="hover:text-orange-400 transition-colors">
                  Temple Rathotsavams & Deepams
                </Link>
              </li>
              <li>
                <Link href="/categories/college-events" className="hover:text-orange-400 transition-colors">
                  College Fests & Hackathons
                </Link>
              </li>
              <li>
                <Link href="/categories/fairs-exhibitions" className="hover:text-orange-400 transition-colors">
                  Handicraft & Book Fairs
                </Link>
              </li>
              <li>
                <Link href="/categories/music-concerts" className="hover:text-orange-400 transition-colors">
                  Classical & Fusion Music
                </Link>
              </li>
              <li>
                <Link href="/categories/workshops-seminars" className="hover:text-orange-400 transition-colors">
                  Pottery & Heritage Walks
                </Link>
              </li>
            </ul>
          </div>

          {/* Localities Covered */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Regions & Cities
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Bengaluru', 'Mysore', 'Mangalore', 'Shivamogga', 'Hubballi', 'Dharwad', 'Belagavi', 'Udupi'].map((city) => (
                <Link
                  key={city}
                  href={`/?city=${city}`}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-orange-500/20 hover:text-orange-300 border border-slate-700 transition-all text-slate-300"
                >
                  {city}
                </Link>
              ))}
            </div>
            <div className="mt-6 text-sm text-slate-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Central Civic Event Registry</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>contact@utsavhub.org</span>
              </p>
            </div>
          </div>

          {/* Academic & Platform Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Academic Project Scope
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Designed as a prototype web application for discovery of community gatherings. Built using Next.js backend services and MySQL relational data storage with responsive mobile support.
            </p>
            <div className="space-y-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 transition-colors"
              >
                <span>Go to Admin Dashboard</span>
                <span>&rarr;</span>
              </Link>
              <div>
                <Link
                  href="/submit-event"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 transition-colors"
                >
                  <span>Submit an Organizer Event</span>
                  <span>+</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 UtsavHub. Local Event and Festival Information System.</p>
          <p className="flex items-center justify-center gap-1">
            Preserving local culture & community spirit with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
