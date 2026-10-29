'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Ticket, 
  Calendar, 
  MapPin, 
  QrCode, 
  Printer, 
  Download, 
  User, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';
import { EventItem, Registration } from '@/types';
import { formatDate, formatEventDateRange } from '@/lib/utils';
import { savePassLocally } from '@/lib/bookmarks';

interface RegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ event, isOpen, onClose }: RegistrationModalProps) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [ticketsCount, setTicketsCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedPass, setConfirmedPass] = useState<Registration | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          userName,
          userEmail,
          userPhone,
          ticketsCount: Number(ticketsCount) || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      setConfirmedPass(data.data);
      savePassLocally({
        ...data.data,
        eventTitle: event.title,
        eventDate: event.startDate,
        eventVenue: event.venue,
        imageUrl: event.imageUrl,
        ticketPrice: event.ticketPrice,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-200">
            <Sparkles className="w-4 h-4" />
            <span>Community Registration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-1">
            {confirmedPass ? 'Registration Confirmed!' : 'Get Digital Event Pass / RSVP'}
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 line-clamp-1">
            {event.title}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {confirmedPass ? (
            /* Digital Pass Ticket View */
            <div className="space-y-6">
              <div className="border-2 border-dashed border-orange-300 rounded-2xl p-5 bg-orange-50/50 relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white">
                      Official Digital Pass
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{event.venue}, {event.city}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>{formatDate(event.startDate)} • {event.startTime}</span>
                    </p>
                  </div>

                  {/* QR Code Graphic */}
                  <div className="shrink-0 flex flex-col items-center bg-white p-2 rounded-xl shadow-xs border border-orange-200">
                    <QrCode className="w-16 h-16 text-slate-900" />
                    <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">VERIFIED</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-orange-200 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendee</span>
                    <span className="font-bold text-slate-800">{confirmedPass.userName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pass Code</span>
                    <span className="font-mono font-extrabold text-orange-600 text-sm">
                      {confirmedPass.registrationCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tickets / Passes</span>
                    <span className="font-semibold text-slate-700">{confirmedPass.ticketsCount} Person(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Fee Status</span>
                    <span className="font-bold text-emerald-600">
                      {event.isFree ? 'Free Admission' : `Paid (₹${event.ticketPrice * confirmedPass.ticketsCount})`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Pass saved to your browser under <strong>Saved & Passes</strong>. Present this pass at the entrance.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Pass</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Event Summary Mini-Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Date & Venue:</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(event.startDate)} • {event.venue}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Ticket Price:</span>
                  <span className="font-bold text-orange-600">
                    {event.isFree ? 'FREE' : `₹${event.ticketPrice} / pass`}
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone & Pass Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+91 98450 00000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Number of Passes
                  </label>
                  <select
                    value={ticketsCount}
                    onChange={(e) => setTicketsCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Pass' : 'Passes'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Total Calculation */}
              {!event.isFree && (
                <div className="pt-2 flex items-center justify-between text-sm font-bold border-t border-slate-100">
                  <span className="text-slate-600">Total Payable:</span>
                  <span className="text-orange-600 text-lg">
                    ₹{event.ticketPrice * ticketsCount}
                  </span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isLoading ? 'Processing...' : event.isFree ? 'Confirm Free RSVP' : 'Book Passes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
