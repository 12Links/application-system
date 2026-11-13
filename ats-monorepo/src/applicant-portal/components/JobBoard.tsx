import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { Job } from '../../shared/types';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  FileText,
  ArrowRight,
  X,
  CheckCircle,
  Sparkles,
  Building,
  Clock,
  Layers,
  UploadCloud,
  Check,
  Github,
  Globe,
  Linkedin,
  ChevronRight,
  Award,
  Zap,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobBoardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onNavigateToTab }) => {
  const { jobs, applyToJob, setActiveApplicationId, currentUser } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('3-5 Years');
  const [portfolio, setPortfolio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeSize, setResumeSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill from signed-in candidate
  React.useEffect(() => {
    if (isApplyModalOpen && currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setPortfolio(currentUser.portfolioUrl || '');
      setGithub(currentUser.githubUrl || '');
      setLinkedin(currentUser.linkedinUrl || '');
    }
  }, [isApplyModalOpen, currentUser]);

  // Extract unique departments
  const departments = ['All', ...Array.from(new Set(jobs.map(j => j.department)))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesType =
      selectedType === 'All' ||
      job.type.toLowerCase().includes(selectedType.toLowerCase()) ||
      job.location.toLowerCase().includes(selectedType.toLowerCase());

    const isActive = job.status !== 'Closed';

    return matchesSearch && matchesDept && matchesType && isActive;
  });

  const handleOpenDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleOpenApply = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(false);
    setIsApplyModalOpen(true);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeName(file.name);
      setResumeSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!name || !email || !phone) {
      alert('Please fill out all required contact fields (Name, Email, Phone).');
      return;
    }

    setIsSubmitting(true);

    let backendId: string | undefined = undefined;
    // Use VITE_API_URL if configured; otherwise use the Vercel multi-service route '/api'
    const apiUrl = import.meta.env.VITE_API_URL ?? '/api';

    // Optional backend submission attempt if API is configured
    if (apiUrl) {
      try {
        const formData = new FormData();
        formData.append('job_id', selectedJob.id);
        formData.append('applicant_name', name);
        formData.append('applicant_email', email);
        formData.append('applicant_phone', phone);
        if (portfolio) formData.append('portfolio_url', portfolio);
        if (github) formData.append('github_url', github);

        const fileInput = document.getElementById('applicant-resume-upload') as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          formData.append('resume', fileInput.files[0]);
        }

        const response = await fetch(`${apiUrl}/applications/apply`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          backendId = data.application_id || data.id;
        }
      } catch (err) {
        console.warn('Backend upload skipped, persisting locally:', err);
      }
    }

    // Save to application state
    const createdAppId = applyToJob({
      id: backendId,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      portfolioUrl: portfolio || undefined,
      githubUrl: github || undefined,
      linkedinUrl: linkedin || undefined,
      resumeFileName: resumeName || 'Resume_Document.pdf',
      experienceYears: experience,
      coverLetter: coverLetter || undefined
    });

    setActiveApplicationId(createdAppId);
    setSuccessAppId(createdAppId);
    setIsSubmitting(false);
    setIsApplyModalOpen(false);

    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setPortfolio('');
    setGithub('');
    setLinkedin('');
    setCoverLetter('');
    setResumeName('');
    setResumeSize('');
  };

  return (
    <div className="space-y-8">
      {/* Hero: Join Our Team */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-bold text-sky-300 uppercase tracking-wider border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            We Are Hiring • Join Our Team
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Intelligent Software</span> With Us
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            We are looking for visionary software engineers, AI specialists, and designers who thrive on solving hard problems. Explore our open positions, apply in minutes, and track your progress in real time.
          </p>

          {/* Value Props & Perks */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
              <Zap className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Cutting-edge AI Stack</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
              <Building className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Hybrid & Remote Options</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Competitive Compensation</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl">
              <Heart className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Health & Growth Stipends</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by job title, skill (e.g. React, Python, AI), or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none text-slate-700"
            >
              <option value="All">All Work Modes</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Full-time">Full-time</option>
            </select>
          </div>
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Department:</span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Vacancies Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Open Opportunities</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available to join our team
          </p>
        </div>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-900 text-lg tracking-tight">No Active Vacancies Advertised Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We are currently preparing exciting new positions to join our team. Please check back soon or connect with our recruitment team.
            </p>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No matching positions found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search criteria or clear the filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDept('All');
              setSelectedType('All');
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map(job => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {job.department}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors pt-1">
                      {job.title}
                    </h3>
                  </div>
                  {job.featured && (
                    <span className="shrink-0 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Hot
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Key metadata pills */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> {job.salary}
                  </span>
                </div>

                {/* Requirements snippets */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Requirements:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requirements.slice(0, 3).map((req, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-5 border-t border-slate-100 mt-5">
                <button
                  type="button"
                  onClick={() => handleOpenDetails(job)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-center cursor-pointer"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenApply(job)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* JOB DETAILS MODAL */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-6 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {selectedJob.department}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" /> {selectedJob.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" /> {selectedJob.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> {selectedJob.salary}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Role</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Responsibilities</h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedJob.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidate Qualifications</h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Perks & Benefits
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-600 mt-2">
                    {selectedJob.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenApply(selectedJob)}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLICATION FORM MODAL */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-6 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                    Application Form
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">Apply for {selectedJob.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedJob.department} • {selectedJob.location}
                  </p>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {currentUser && (
                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3 text-xs text-sky-800 flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Logged in as <strong>{currentUser.name}</strong> ({currentUser.email}). Information auto-filled!</span>
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sipho Ndlovu"
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. sipho@example.com"
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +27 82 123 4567"
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Years of Experience
                    </label>
                    <select
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    >
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-8 Years">5-8 Years</option>
                      <option value="8+ Years">8+ Years</option>
                    </select>
                  </div>
                </div>

                {/* Web & Social Profiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" /> Portfolio / Website
                    </label>
                    <input
                      type="url"
                      value={portfolio}
                      onChange={e => setPortfolio(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Github className="w-3 h-3 text-slate-400" /> GitHub Profile
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={e => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Linkedin className="w-3 h-3 text-slate-400" /> LinkedIn
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={e => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Cover Note */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Why do you want to join 12 Links? (Cover Note)
                  </label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    placeholder="Tell us about yourself, what drives you, and why you are excited to build with our team..."
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Resume Upload Box */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Resume / CV Document (PDF or DOCX)
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input
                      type="file"
                      id="applicant-resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-indigo-500 mb-1" />
                    {resumeName ? (
                      <div className="text-center">
                        <span className="text-xs font-bold text-indigo-700 block">{resumeName}</span>
                        <span className="text-[10px] text-slate-400">{resumeSize} • Ready to upload</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-xs font-bold text-slate-700 block">Click to browse or drag file here</span>
                        <span className="text-[10px] text-slate-400">PDF or DOCX up to 10MB</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUBMISSION SUCCESS MODAL */}
      <AnimatePresence>
        {successAppId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 text-center space-y-5"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Thank you for applying to join our team! We have received your profile and our hiring team will review it shortly.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Application Tracking ID</span>
                <p className="text-lg font-black text-indigo-600 font-mono tracking-wider">{successAppId}</p>
                <p className="text-[10px] text-slate-400">Save this ID to check your live application progress at any time.</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessAppId(null);
                    if (onNavigateToTab) onNavigateToTab('tracker');
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Track Application Progress</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessAppId(null)}
                  className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Continue Browsing Jobs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
