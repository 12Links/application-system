import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Github,
  Globe,
  Linkedin,
  FileText,
  UploadCloud,
  CheckCircle2,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const { currentUser, updateUserProfile, signOut, applications, setActiveApplicationId } = useAppState();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser?.portfolioUrl || '');
  const [githubUrl, setGithubUrl] = useState(currentUser?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedinUrl || '');
  const [resumeFileName, setResumeFileName] = useState(currentUser?.resumeFileName || '');
  const [resumeFileSize, setResumeFileSize] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setPortfolioUrl(currentUser.portfolioUrl || '');
      setGithubUrl(currentUser.githubUrl || '');
      setLinkedinUrl(currentUser.linkedinUrl || '');
      setResumeFileName(currentUser.resumeFileName || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  // Extract initials for the avatar badge
  const getInitials = (fullName?: string, email?: string) => {
    if (fullName && fullName.trim()) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'CA';
  };

  const userApps = applications.filter(
    app => app.applicantEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFileName(file.name);
      setResumeFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      portfolioUrl: portfolioUrl.trim(),
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      resumeFileName: resumeFileName || undefined
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  const handleSelectApp = (appId: string) => {
    setActiveApplicationId(appId);
    onClose();
    onNavigateToTab?.('tracker');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col text-left"
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shadow-xs">
              {getInitials(currentUser.name, currentUser.email)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentUser.name || 'Candidate Profile'}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" strokeWidth={1.5} />
                  Verified Applicant
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.5} />
              <span className="font-semibold">Candidate profile and contact details saved successfully.</span>
            </motion.div>
          )}

          <form id="candidate-profile-form" onSubmit={handleSave} className="space-y-6">
            {/* Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase text-slate-400">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Jacky Mpoka"
                      className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+27 82 123 4567"
                      className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Credentials & Portfolio */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase text-slate-400">
                Online Profiles & Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">GitHub profile URL</label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Portfolio website</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={e => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourportfolio.co.za"
                      className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">LinkedIn profile (optional)</label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume / Curriculum Vitae */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase text-slate-400">
                Default Curriculum Vitae (CV)
              </h4>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200/80 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {resumeFileName || 'No default CV uploaded yet'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {resumeFileSize ? `${resumeFileSize} • PDF Document` : 'Accepted formats: PDF or DOCX (max 10MB)'}
                    </p>
                  </div>
                </div>

                <label className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-all flex items-center gap-1.5 shrink-0 shadow-xs">
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.5} />
                  <span>{resumeFileName ? 'Replace CV' : 'Upload CV'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Active Applications in Pipeline */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase text-slate-400">
                Your Pipeline Applications ({userApps.length})
              </h4>
              {userApps.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                  <p className="text-xs text-slate-500">You haven't submitted any applications yet.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToTab?.('jobs');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Browse open engineering vacancies</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {userApps.map(app => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{app.jobTitle}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-semibold">{app.id}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Stage: <span className="font-semibold text-slate-700">{app.currentStage}</span> • Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectApp(app.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-[11px] transition-all shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <span>View Progress</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              signOut();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="candidate-profile-form"
              className="flex-1 sm:flex-none px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
