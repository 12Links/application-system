import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { Job } from '../../shared/types';
import { Search, MapPin, Briefcase, DollarSign, Calendar, FileText, ArrowRight, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const JobBoard: React.FC = () => {
  const { jobs, setActiveApplicationId, currentUser } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [github, setGithub] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill form states from logged in user profile when apply modal opens
  React.useEffect(() => {
    if (isApplyModalOpen && currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setPortfolio(currentUser.portfolioUrl || '');
      setGithub(currentUser.githubUrl || '');
    }
  }, [isApplyModalOpen, currentUser]);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('job_id', selectedJob.id);
    formData.append('applicant_name', name);
    formData.append('applicant_email', email);
    formData.append('applicant_phone', phone);
    if (portfolio) formData.append('portfolio_url', portfolio);
    if (github) formData.append('github_url', github);
    
    // Grab the actual file from the hidden input element (if it exists)
    const fileInput = document.getElementById('applicant-resume-upload') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      formData.append('resume', fileInput.files[0]);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/apply`, {
        method: 'POST',
        body: formData, 
      });

      if (!response.ok) throw new Error("Failed to submit application");
      
      const data = await response.json();
      setSuccessAppId(data.application_id || data.id); 
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setPortfolio('');
      setGithub('');
      setResumeUploaded(false);
      setResumeName('');
    } catch (error) {
      console.error("Application error:", error);
      alert("There was an error submitting your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeUploaded(true);
      setResumeName(e.target.files[0].name);
    }
  };

  return (
    <div id="job-board-root" className="space-y-6">
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Available Positions</h2>
          <p className="text-slate-500 text-sm mt-1">Join our engineering team and build the future of software.</p>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          <input
            id="job-search-input"
            type="text"
            placeholder="Search roles, skills, or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Grid Layout: Jobs list and selected detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jobs List (6 columns or 12 depending on if a job is selected) */}
        <div className={`space-y-4 transition-all duration-300 ${selectedJob ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No positions matching your search</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-2 text-sm text-indigo-600 hover:underline"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            filteredJobs.map(job => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  id={`job-card-${job.id}`}
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                    isSelected 
                      ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-md translate-x-1' 
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-md">
                        {job.department}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {job.createdAt}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mt-2.5 line-clamp-1">{job.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-y-2 mt-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1.5 col-span-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>View Job Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Job Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm sticky top-4 h-fit max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-md">
                    {selectedJob.department}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 mt-3">{selectedJob.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 border border-slate-100">
                <div>
                  <p className="text-slate-400 uppercase font-medium tracking-wider mb-1">Location</p>
                  <p className="font-semibold text-slate-700">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-medium tracking-wider mb-1">Job Type</p>
                  <p className="font-semibold text-slate-700">{selectedJob.type}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-medium tracking-wider mb-1">Compensation</p>
                  <p className="font-semibold text-slate-700">{selectedJob.salary}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-medium tracking-wider mb-1">Experience</p>
                  <p className="font-semibold text-slate-700">{selectedJob.experience}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Role Overview</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  id="apply-now-btn"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/10 flex items-center gap-2"
                >
                  Apply For This Position
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                <div>
                  <h3 className="font-bold text-slate-800">Job Application</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedJob?.title}</p>
                </div>
                <button
                  onClick={() => {
                    setIsApplyModalOpen(false);
                    setSuccessAppId(null);
                  }}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!successAppId ? (
                <form id="apply-job-form" onSubmit={handleApplySubmit} className="p-6 space-y-4">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Full Name *</label>
                      <input
                        id="applicant-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
                      <input
                        id="applicant-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                    <input
                      id="applicant-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  {/* Portfolios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">GitHub Profile URL</label>
                      <input
                        id="applicant-github"
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Portfolio URL</label>
                      <input
                        id="applicant-portfolio"
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://myportfolio.dev"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Resume Upload Box (Drag and Drop / Click) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Upload Resume (PDF, DOCX) (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/10 rounded-2xl p-6 text-center cursor-pointer transition-colors relative group">
                      <input
                        id="applicant-resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <FileText className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mx-auto mb-2 transition-colors" />
                      {resumeUploaded ? (
                        <div>
                          <p className="text-sm font-semibold text-indigo-600">{resumeName}</p>
                          <p className="text-xs text-slate-400 mt-1">Click or drag to replace resume</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Drag & drop your resume here</p>
                          <p className="text-xs text-slate-400 mt-1">or click to browse from files</p>
                        </div>
                      )}
                    </div>
                    
                    {/* The fallback email message */}
                    <div className="mt-2 text-center p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                      <p className="text-xs font-medium text-slate-600">
                        If you are having trouble with uploading the CV, please send the email to <a href="mailto:info@12links.co.za" className="text-indigo-600 hover:underline font-bold">info@12links.co.za</a>
                      </p>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      id="submit-application-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all shadow-sm"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8 text-center space-y-5">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Application Submitted!</h4>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                      Thank you for applying. We have created your candidate file. Your Application ID is:
                    </p>
                    <div className="mt-4 inline-block bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl font-mono text-base font-bold text-indigo-600">
                      {successAppId}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Please use this Application ID (or your email) to track your progress.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsApplyModalOpen(false);
                        setActiveApplicationId(successAppId);
                        setSuccessAppId(null);
                      }}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
                    >
                      Track Application
                    </button>
                    <button
                      onClick={() => {
                        setSuccessAppId(null);
                        setIsApplyModalOpen(false);
                      }}
                      className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};