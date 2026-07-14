import React, { useState } from 'react';
import { Key, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
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

    try {
      // FastAPI OAuth2 requires form data, not standard JSON
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Success!
      localStorage.setItem('ats_admin_session', data.access_token);
      localStorage.setItem('ats_admin_email', email);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6 text-left"
      >
        {/* Branding & Icon */}
        <div className="text-center space-y-3 pb-1">
          <div className="flex justify-center mb-1">
            <CompanyLogo variant="horizontal" size="md" lightTheme={true} />
          </div>
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight uppercase">Staff Portal Verification</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized recruiter workspace access. Enter staff credentials to continue.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-semibold">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              Staff Email Address
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. recruiter@12links.com"
              className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1">
              <Key className="w-3 h-3 text-slate-400" />
              Portal Access Key
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all mt-6 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span>Authenticating with Server...</span>
              </>
            ) : (
              <>
                <span>Unlock Recruiter Access</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};