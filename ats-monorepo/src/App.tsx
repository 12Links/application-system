/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StateProvider } from './shared/StateContext';
import { ApplicantPortal } from './applicant-portal/ApplicantPortal';
import { AdminPortal } from './admin-portal/AdminPortal';
import { MapPin } from 'lucide-react';

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}

function AppContent() {
  const getIsAdminPath = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path.startsWith('/admin/') || hash === '#admin';
  };

  const [isAdminRoute, setIsAdminRoute] = useState(getIsAdminPath);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminRoute(getIsAdminPath());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (path === '/admin') {
      window.history.pushState({}, '', '/admin');
      setIsAdminRoute(true);
    } else {
      window.history.pushState({}, '', '/');
      setIsAdminRoute(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-800 selection:text-white">
      {/* MAIN VIEW AREA */}
      <main className="flex-1 flex flex-col">
        {isAdminRoute ? (
          <AdminPortal onNavigateToPublic={() => navigateTo('/')} />
        ) : (
          <ApplicantPortal onNavigateToAdmin={() => navigateTo('/admin')} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
              12 Links Future Technologies (Pty) Ltd
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>Pretoria, South Africa</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>Software Engineering & Systems</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {!isAdminRoute ? (
              <button
                type="button"
                onClick={() => navigateTo('/admin')}
                className="text-slate-400 hover:text-slate-700 transition-colors font-medium cursor-pointer"
              >
                Staff Portal
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('/')}
                className="text-slate-400 hover:text-slate-700 transition-colors font-medium cursor-pointer"
              >
                Back to Careers
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
