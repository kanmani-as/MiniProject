'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import { Category } from '@/types';

export default function SubmitEventPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('06:00 PM');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [organizerName, setOrganizerName] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerWebsite, setOrganizerWebsite] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCategories(data.data);
          setCategoryId(data.data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          categoryId,
          startDate,
          endDate: endDate || startDate,
          startTime,
          endTime,
          venue,
          address: address || `${venue}, ${city}`,
          city,
          state,
          shortDescription: shortDescription || description.substring(0, 160),
          description,
          isFree,
          ticketPrice: isFree ? 0 : Number(ticketPrice) || 0,
          organizerName,
          organizerPhone,
          organizerEmail,
          organizerWebsite,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
          status: 'PENDING_REVIEW',
          isVerified: false,
          isFeatured: false,
          expectedAttendees: 500,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit event listing');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-white py-10 sm:py-14 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-3">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Community Event Submission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Submit a Local Event or Festival
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Help local citizens and tourists discover your cultural programme, temple procession, college fest, or handicraft mela. Submissions are reviewed by administrators prior to publication.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {submitted ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Event Submitted for Verification!
            </h2>

            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for contributing to your community. Your listing for <strong>{title}</strong> has been logged and assigned to the administration queue for verification.
            </p>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-xs text-orange-900 max-w-md mx-auto text-left flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Next Steps for Verification:</p>
                <p className="mt-0.5 text-orange-800">
                  Municipal event moderators review date/venue validity and contact details. You can view the moderation queue anytime in the <strong>Admin Portal</strong>.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setVenue('');
                  setDescription('');
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Submit Another Event
              </button>
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20"
              >
                Review in Admin Portal
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Section 1: Event Identity */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">1. Basic Event Details</h3>
                <p className="text-xs text-slate-500">Provide official name and category of the festival</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Event / Festival Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 52nd Annual Karaga Shaktyotsava"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Mysore, Mangalore"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Date, Time & Venue */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">2. Date, Timings & Venue</h3>
                <p className="text-xs text-slate-500">Accurate location and timings for attendees</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Date (if multi-day)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 05:30 PM"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="e.g. 10:00 PM"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Town Hall Grounds / Temple Mandap"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Near Gandhi Circle, Fort Area"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Descriptions */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">3. Description & Highlights</h3>
                <p className="text-xs text-slate-500">Explain the background, schedule, and cultural attractions</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Summary (1-2 sentences)
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Catchy overview displayed on event cards"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details including key rituals, performer names, competitions, food stalls, and guidelines for visitors..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>

              {/* Poster Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Optional. Leave blank to automatically use a curated cultural theme poster.
                </p>
              </div>
            </div>

            {/* Section 4: Admission & Organizer Contact */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">4. Admission & Organizer Contact</h3>
                <p className="text-xs text-slate-500">Contact details for inquiries and ticket registration</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="freeEntry"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <label htmlFor="freeEntry" className="font-bold text-slate-800 text-sm cursor-pointer">
                    Free Entry for Public
                  </label>
                </div>

                {!isFree && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ticket Price (₹)
                    </label>
                    <input
                      type="number"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(Number(e.target.value))}
                      placeholder="e.g. 150"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="Trust / Club / College"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    placeholder="organizer@trust.org"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <Link
                href="/"
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center gap-2 disabled:opacity-50 hover:scale-105 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{isSubmitting ? 'Submitting to Queue...' : 'Submit Event for Verification'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
