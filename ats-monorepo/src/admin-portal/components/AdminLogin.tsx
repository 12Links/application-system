import React, { useState } from 'react';
import { Key, Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { CompanyLogo } from '../../shared/CompanyLogo';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Default to the Vercel multi-service route '/api' or explicitly configured VITE_API_URL
    const apiUrl = import.meta.env.VITE_API_URL ?? '/api';

    try {
      const formData = new URLSearchParams();
      formData.append('username', email.trim());
      formData.append('password', password);

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Strict role validation: Ensure user has administrator role in Supabase
        if (data.role !== 'admin') {
          setError('Access denied. This account does not possess administrator credentials.');
          setIsLoading(false);
          return;
        }

        localStorage.setItem('ats_admin_session', data.access_token);
        localStorage.setItem('ats_admin_email', data.email || email.trim());
        if (data.name) {
          localStorage.setItem('ats_admin_name', data.name);
        }
        onLoginSuccess();
        return;
      }

      if (response.status === 401 || response.status === 403) {
        setError('Invalid staff credentials. Only registered administrators in the database are authorized.');
      } else {
        const errData = await response.json().catch(() => null);
        setError(errData?.detail || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error('Authentication request error:', err);
      setError('Unable to connect to the authentication service. Please verify your connection or try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6 text-left"
      >
        {/* Branding & Header */}
        <div className="text-center space-y-3 pb-1">
          <div className="flex justify-center mb-1">
            <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" strokeWidth={1.5} />
            Recruiter & Administrator Workspace
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Authorized administrative access for managing vacancies, candidate pipelines, evaluations, and hiring workflows.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" strokeWidth={1.5} />
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
              Administrator email address
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. info@12links.co.za"
              className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
              Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 transition-all mt-6 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" strokeWidth={1.5} />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign in to admin workspace</span>
                <ArrowRight className="w-4 h-4 text-slate-300" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
