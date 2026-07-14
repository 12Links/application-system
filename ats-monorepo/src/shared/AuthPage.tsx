import React, { useState } from 'react';
import { useAppState } from './StateContext';
import { CompanyLogo } from './CompanyLogo';
import { Mail, Lock, User as UserIcon, Phone, Globe, Github, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { signIn, signUp, users } = useAppState();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (isSignUp) {
      if (!name) {
        setError('Please enter your full name');
        return;
      }
      const result = signUp({
        name,
        email,
        phone,
        password,
        portfolioUrl,
        githubUrl,
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    } else {
      const result = signIn(email, password);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setIsSignUp(false);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 relative overflow-hidden">
      {/* Intricate decorative cyber grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0ea5e9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600" />

        <div className="p-6 sm:p-8 flex flex-col items-center">
          {/* Company Logo Display */}
          <CompanyLogo variant="text-only" lightTheme={true} className="mb-2" />

          <p className="text-xs text-slate-500 text-center max-w-sm mb-6 mt-1 font-medium leading-relaxed">
            Create or access your developer profile to apply for technology vacancies based in our 
            <span className="font-semibold text-sky-600"> Pretoria head office, South Africa</span>.
          </p>

          {/* Form Tabs */}
          <div className="flex w-full bg-slate-100 p-1 rounded-xl mb-6">
            <button
              id="auth-signin-tab"
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In to Profile
            </button>
            <button
              id="auth-signup-tab"
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isSignUp
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register Candidate
            </button>
          </div>

          {error && (
            <div className="w-full flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs p-3 rounded-lg mb-4 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name & surname"
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="signup-phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+27 (082) 123-4567"
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Portfolio Link (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Globe className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="signup-portfolio-input"
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://myportfolio.co.za"
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">GitHub URL (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Github className="w-4 h-4" />
                  </span>
                  <input
                    id="signup-github-input"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/myusername"
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-lg shadow-sky-500/10 transition-all uppercase tracking-wider mt-2"
            >
              {isSignUp ? 'Create Account & Continue' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Assist Tooltip */}
          <div className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col items-center">
            <button
              id="toggle-demo-accounts-btn"
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Need test candidate profiles? View Demo Accounts</span>
            </button>

            {showDemoAccounts && (
              <div className="w-full mt-3 bg-slate-50 border border-slate-150 rounded-xl p-3 space-y-2 text-[11px] text-slate-600 animate-fade-in">
                <p className="font-bold text-slate-700 text-center mb-1">Click below to auto-fill preloaded portfolios:</p>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('evelyn.miller@example.com')}
                    className="text-left p-2 rounded bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-all font-medium flex justify-between"
                  >
                    <span>Evelyn Miller (Senior Full-Stack)</span>
                    <span className="text-sky-600 font-bold">evelyn.miller@example.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('alex.thorne@codeflow.io')}
                    className="text-left p-2 rounded bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-all font-medium flex justify-between"
                  >
                    <span>Alex Thorne (Frontend Engineer)</span>
                    <span className="text-sky-600 font-bold">alex.thorne@codeflow.io</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('marcus.patel@gmail.com')}
                    className="text-left p-2 rounded bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-all font-medium flex justify-between"
                  >
                    <span>Marcus Patel (Junior Backend)</span>
                    <span className="text-sky-600 font-bold">marcus.patel@gmail.com</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center pt-1 italic">All test profiles use password: <strong>password</strong></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
