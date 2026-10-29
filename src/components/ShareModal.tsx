'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Twitter, Mail } from 'lucide-react';
import { EventItem } from '@/types';

interface ShareModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ event, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const eventUrl = typeof window !== 'undefined' ? window.location.href : `http://localhost:3000/events/${event.id}`;
  const shareText = `Check out "${event.title}" happening on ${event.startDate} at ${event.venue}, ${event.city}!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + eventUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`, '_blank');
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent('Invitation: ' + event.title)}&body=${encodeURIComponent(shareText + '\n\nMore details: ' + eventUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-orange-600 mb-2">
          <Share2 className="w-5 h-5" />
          <h3 className="font-extrabold text-lg text-slate-900">Share This Event</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Spread the word with friends, family, and community members.
        </p>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all text-xs font-semibold"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-all text-xs font-semibold"
          >
            <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Twitter className="w-5 h-5" />
            </div>
            <span>Twitter / X</span>
          </button>

          <button
            onClick={shareEmail}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all text-xs font-semibold"
          >
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <span>Email</span>
          </button>
        </div>

        {/* Copy Link Input Bar */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Event Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={eventUrl}
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
