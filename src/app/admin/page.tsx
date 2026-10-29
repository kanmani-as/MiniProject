'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Key, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('utsav_admin_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('utsav_admin_token');
    localStorage.removeItem('utsav_admin_user');
    setIsAuthenticated(false);
  };

  const handleQuickUnlock = async () => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@localevents.gov', password: 'admin123' })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('utsav_admin_token', data.token);
        localStorage.setItem('utsav_admin_user', JSON.stringify(data.user));
        setIsAuthenticated(true);
      } else {
        alert(data.error || 'Failed to authenticate administrator');
      }
    } catch (err: any) {
      alert('Error connecting to authentication endpoint: ' + err.message);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Administrator Restricted Access</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This interface is reserved for authorized municipal officers, festival trustees, and verified event coordinators.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/login"
              className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Key className="w-4 h-4" />
              <span>Go to Login Screen</span>
            </Link>

            <button
              onClick={handleQuickUnlock}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-600"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Quick Unlock (Demo Evaluation Mode)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-700 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-orange-400">
              &larr; Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
