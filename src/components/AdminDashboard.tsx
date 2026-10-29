'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff, 
  Search, 
  Database, 
  Tag, 
  Calendar, 
  Users, 
  RefreshCw, 
  Check, 
  X,
  Clock,
  MapPin,
  Sparkles,
  Download,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { Category, EventItem, EventStatus, Registration } from '@/types';
import { formatDate } from '@/lib/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'moderation' | 'categories' | 'registrations' | 'db'>('events');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [dbDiagnostics, setDbDiagnostics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Notification toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);

  // Category create modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch events (including draft & pending)
      const evRes = await fetch('/api/events?includeAll=true');
      const evData = await evRes.json();
      if (evData.success) setEvents(evData.data);

      // 2. Fetch categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (catData.success) setCategories(catData.data);

      // 3. Fetch registrations
      const regRes = await fetch('/api/registrations');
      const regData = await regRes.json();
      if (regData.success) setRegistrations(regData.data);

      // 4. Fetch DB diagnostics
      const dbRes = await fetch('/api/admin/db-status');
      const dbData = await dbRes.json();
      if (dbData.success) setDbDiagnostics(dbData.diagnostics);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Event handlers
  const handleTogglePublish = async (event: EventItem) => {
    const nextStatus: EventStatus = event.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Event status updated to ${nextStatus}`);
        fetchData();
      }
    } catch (err) {
      showToast('Error updating status');
    }
  };

  const handleToggleVerify = async (event: EventItem) => {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !event.isVerified }),
      });
      if (res.ok) {
        showToast(event.isVerified ? 'Verification removed' : 'Listing marked as Verified');
        fetchData();
      }
    } catch (err) {
      showToast('Error updating verification');
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Event removed from listings');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to delete event');
    }
  };

  const handleApprovePending = async (event: EventItem) => {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED', isVerified: true }),
      });
      if (res.ok) {
        showToast(`"${event.title}" approved and published to website!`);
        fetchData();
      }
    } catch (err) {
      showToast('Failed to approve');
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      if (editingEvent.id) {
        // Update
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingEvent),
        });
        if (res.ok) {
          showToast('Event details updated successfully!');
          setIsModalOpen(false);
          setEditingEvent(null);
          fetchData();
        }
      } else {
        // Create
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingEvent),
        });
        if (res.ok) {
          showToast('New event added to registry!');
          setIsModalOpen(false);
          setEditingEvent(null);
          fetchData();
        }
      }
    } catch (err) {
      showToast('Failed to save event');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDescription.trim(),
          icon: 'Sparkles',
          color: 'from-orange-500 to-amber-600',
        }),
      });
      if (res.ok) {
        showToast('New category created!');
        setNewCatName('');
        setNewCatDescription('');
        setIsCatModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showToast('Failed to create category');
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('This will restore all sample festival listings and default data. Proceed?')) return;
    try {
      const res = await fetch('/api/admin/db-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_seed' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err) {
      showToast('Database reset error');
    }
  };

  // Filtered events
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || ev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingEvents = events.filter((e) => e.status === 'PENDING_REVIEW');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight">
                  Municipal Administrator Interface
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Authorized Session
                </span>
              </div>
              <p className="text-xs text-slate-400">
                UtsavHub Event Verification, Content Moderation & MySQL Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>View Public Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-800">
          {[
            { id: 'events', label: 'Event Listings', count: events.length },
            { id: 'moderation', label: 'Pending Verification', count: pendingEvents.length, alert: pendingEvents.length > 0 },
            { id: 'categories', label: 'Categories', count: categories.length },
            { id: 'registrations', label: 'Visitor RSVPs / Passes', count: registrations.length },
            { id: 'db', label: 'MySQL Diagnostic' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  tab.alert ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Listings</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{events.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Across all districts</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published & Active</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {events.filter((e) => e.status === 'PUBLISHED').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Visible to public</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
            <div className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
              {pendingEvents.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Awaiting approval</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Booked RSVPs</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {registrations.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Issued passes</div>
          </div>
        </div>

        {/* TAB 1: EVENT LISTINGS */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {/* Filter & Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, town, organizer..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Status select */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingEvent({
                    title: '',
                    shortDescription: '',
                    description: '',
                    categoryId: categories[0]?.id || 'cat-1',
                    startDate: '2026-11-15',
                    endDate: '2026-11-15',
                    startTime: '10:00 AM',
                    endTime: '06:00 PM',
                    venue: '',
                    address: '',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    pincode: '560001',
                    isFree: true,
                    ticketPrice: 0,
                    organizerName: '',
                    organizerEmail: '',
                    organizerPhone: '',
                    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
                    isFeatured: false,
                    isVerified: true,
                    status: 'PUBLISHED',
                    expectedAttendees: 500,
                  });
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Event</span>
              </button>
            </div>

            {/* Listings Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Event & Category</th>
                      <th className="py-3 px-4">Dates & Venue</th>
                      <th className="py-3 px-4">Entry Fee</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={evt.imageUrl}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                            />
                            <div>
                              <Link
                                href={`/events/${evt.id}`}
                                className="font-bold text-slate-900 hover:text-orange-600 transition-colors line-clamp-1 text-sm"
                              >
                                {evt.title}
                              </Link>
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-700 mt-1">
                                {evt.category?.name || 'Category'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">
                            {formatDate(evt.startDate)}
                          </div>
                          <div className="text-slate-500 text-[11px] truncate max-w-[180px]">
                            {evt.venue}, {evt.city}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            evt.isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {evt.isFree ? 'Free' : `₹${evt.ticketPrice}`}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleTogglePublish(evt)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                              evt.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : evt.status === 'PENDING_REVIEW'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                            title="Click to toggle status"
                          >
                            {evt.status === 'PUBLISHED' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{evt.status}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleVerify(evt)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                              evt.isVerified
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                            title="Click to toggle verified badge"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>{evt.isVerified ? 'Verified' : 'Unverified'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingEvent({ ...evt });
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                              title="Edit listing"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt.id, evt.title)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODERATION QUEUE */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                These events were submitted through the public &quot;Submit an Event&quot; form and require administrative verification before becoming visible to visitors.
              </span>
            </div>

            {pendingEvents.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
                <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                <h4 className="font-bold text-slate-700">Verification Queue is Clean</h4>
                <p className="text-xs text-slate-500 mt-1">There are no pending submissions awaiting review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingEvents.map((evt) => (
                  <div key={evt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Pending Moderation
                        </span>
                        <h4 className="font-bold text-slate-900 text-base mt-1.5">{evt.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {evt.venue}, {evt.city} • {formatDate(evt.startDate)}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.shortDescription || evt.description}
                    </p>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block">Organizer:</span>
                        <span className="font-semibold text-slate-800">{evt.organizerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Contact Email:</span>
                        <span className="font-semibold text-slate-800">{evt.organizerEmail || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleApprovePending(evt)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id, evt.title)}
                        className="py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Festival & Event Categories</h3>
                <p className="text-xs text-slate-500">Organize listings into cultural and civic classifications</p>
              </div>
              <button
                onClick={() => setIsCatModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        {cat.slug}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {cat.eventCount || 0} Events
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Display Order: #{cat.displayOrder}</span>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="font-bold text-orange-600 hover:text-orange-700"
                    >
                      View Category &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Visitor Registrations & Issued Passes</h3>
                <p className="text-xs text-slate-500">List of attendees who have RSVP&apos;d for upcoming events</p>
              </div>
              <button
                onClick={() => {
                  const csv = 'RegistrationCode,EventTitle,AttendeeName,Email,Phone,Tickets,Date\n' +
                    registrations.map(r => `"${r.registrationCode}","${r.eventTitle}","${r.userName}","${r.userEmail}","${r.userPhone}",${r.ticketsCount},"${r.createdAt}"`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'registrations_export.csv';
                  link.click();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export as CSV</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Pass Code</th>
                      <th className="py-3 px-4">Event</th>
                      <th className="py-3 px-4">Attendee Name</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Passes</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-orange-600">
                          {r.registrationCode}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 max-w-xs truncate">
                          {r.eventTitle || 'Event'}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {r.userName}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          <div>{r.userEmail}</div>
                          <div className="text-[11px]">{r.userPhone}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">
                          {r.ticketsCount}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MYSQL DIAGNOSTICS */}
        {activeTab === 'db' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">MySQL Database Storage & Engine Status</h3>
                <p className="text-xs text-slate-500">
                  Data storage diagnostic for academic evaluation and production MySQL deployment
                </p>
              </div>
            </div>

            {dbDiagnostics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Database Engine</span>
                  <p className="font-semibold text-slate-900 text-sm">{dbDiagnostics.databaseEngine}</p>
                  <p className="text-slate-500">Operational Mode: {dbDiagnostics.mode}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Configured DATABASE_URL</span>
                  <p className="font-mono text-slate-900 text-xs truncate bg-white p-2 rounded-lg border border-slate-200">
                    {dbDiagnostics.databaseUrlConfigured}
                  </p>
                  <p className="text-slate-500">Defined in .env.local and .env.example</p>
                </div>
              </div>
            )}

            {/* Table Stats */}
            <div className="border border-slate-200 rounded-2xl p-5">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Relational Table Statistics (vb_ Tables)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">vb_events table:</span>
                  <span className="text-lg font-bold text-slate-800">{events.length} rows</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">vb_categories table:</span>
                  <span className="text-lg font-bold text-slate-800">{categories.length} rows</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">vb_registrations table:</span>
                  <span className="text-lg font-bold text-slate-800">{registrations.length} rows</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block">vb_users table:</span>
                  <span className="text-lg font-bold text-slate-800">
                    {dbDiagnostics?.tables?.vb_users ?? 1} {(dbDiagnostics?.tables?.vb_users ?? 1) === 1 ? 'row' : 'rows'}
                  </span>
                </div>
              </div>
            </div>

            {/* Database SQL Instructions */}
            <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 text-xs text-orange-950 space-y-2">
              <h4 className="font-bold text-orange-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>MySQL Deployment & Seed Guide:</span>
              </h4>
              <p className="leading-relaxed">
                The complete standalone SQL schema with table definitions (prefixed with <code className="font-mono font-bold text-orange-800">vb_</code>), foreign keys, indexes, and sample seed records is saved at:
                <code className="block bg-white px-2.5 py-1.5 rounded-lg border border-orange-200 font-mono text-[11px] text-orange-900 my-1.5">
                  projects/database/schema.sql
                </code>
                You can run the automated seed script or import via CLI:
                <code className="block bg-slate-900 text-orange-300 px-3 py-2 rounded-lg font-mono text-[11px] my-1">
                  npm run db:seed
                </code>
              </p>
            </div>

            {/* Reset Database Button */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Restore Sample Dataset</h5>
                <p className="text-xs text-slate-500">Resets vb_users, vb_categories, vb_events, and vb_registrations tables to default records</p>
              </div>
              <button
                onClick={handleResetDatabase}
                className="px-4 py-2.5 rounded-xl border border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 font-bold text-xs flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Demo Records</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingEvent.id ? 'Edit Event Listing' : 'Add New Event Listing'}
                </h3>
                <p className="text-xs text-slate-400">Provide complete and verified event parameters</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEvent(null);
                }}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Event Title */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="e.g. Grand Town Annual Utsav"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={editingEvent.categoryId || categories[0]?.id}
                    onChange={(e) => setEditingEvent({ ...editingEvent, categoryId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingEvent.status || 'PUBLISHED'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as EventStatus })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="PUBLISHED">PUBLISHED (Visible)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW (Moderation)</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingEvent.startDate || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editingEvent.endDate || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={editingEvent.startTime || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                    placeholder="e.g. 05:30 PM"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={editingEvent.endTime || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                    placeholder="e.g. 10:00 PM"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Venue & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    placeholder="e.g. Town Hall Grounds"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.city || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
                    placeholder="e.g. Mysore"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  value={editingEvent.address || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, address: e.target.value })}
                  placeholder="Street, Landmark, Ward"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Summary
                </label>
                <input
                  type="text"
                  value={editingEvent.shortDescription || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, shortDescription: e.target.value })}
                  placeholder="1-2 sentences summarizing the festival or programme"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Description & Details
                </label>
                <textarea
                  rows={4}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Detailed schedule, traditions, attractions, parking and food notes..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={editingEvent.isFree ?? true}
                    onChange={(e) => setEditingEvent({ ...editingEvent, isFree: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="isFree" className="font-bold text-slate-700">
                    Free Public Admission
                  </label>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ticket Price (₹) if Paid
                  </label>
                  <input
                    type="number"
                    value={editingEvent.ticketPrice || 0}
                    onChange={(e) => setEditingEvent({ ...editingEvent, ticketPrice: Number(e.target.value) })}
                    disabled={editingEvent.isFree}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Organizer details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    value={editingEvent.organizerName || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, organizerName: e.target.value })}
                    placeholder="Trust / College / Board"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Organizer Phone
                  </label>
                  <input
                    type="tel"
                    value={editingEvent.organizerPhone || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, organizerPhone: e.target.value })}
                    placeholder="+91 98450 00000"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Organizer Email
                  </label>
                  <input
                    type="email"
                    value={editingEvent.organizerEmail || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, organizerEmail: e.target.value })}
                    placeholder="contact@org.org"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  value={editingEvent.imageUrl || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEvent.isFeatured ?? false}
                    onChange={(e) => setEditingEvent({ ...editingEvent, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Feature on Homepage Banner</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEvent.isVerified ?? true}
                    onChange={(e) => setEditingEvent({ ...editingEvent, isVerified: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Display Verified Badge</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-500/25"
                >
                  Save Event Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Literary Fests & Debates"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  placeholder="Brief description of this event category..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
