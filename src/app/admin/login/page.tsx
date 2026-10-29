'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowLeft, Key, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@localevents.gov');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store admin session token
      localStorage.setItem('utsav_admin_token', data.token);
      localStorage.setItem('utsav_admin_user', JSON.stringify(data.user));

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = () => {
    setEmail('admin@localevents.gov');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
          Administrator Portal
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          UtsavHub Content Moderation, MySQL Registry & Listing Control
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-700 backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@localevents.gov"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Quick Demo Hint */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block">Demo Credentials:</span>
                <span className="text-orange-400 font-mono">admin@localevents.gov / admin123</span>
              </div>
              <button
                type="button"
                onClick={fillQuickDemo}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-600"
              >
                Auto Fill
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
            >
              <Key className="w-4 h-4" />
              <span>{isLoading ? 'Verifying Session...' : 'Sign In as Administrator'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
