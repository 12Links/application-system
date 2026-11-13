import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { Job } from '../../shared/types';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ArrowRight,
  X,
  CheckCircle,
  UploadCloud,
  Check,
  Github,
  Globe,
  Linkedin,
  Code2,
  Terminal,
  Layers,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobBoardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onNavigateToTab }) => {
  const { jobs, applyToJob, setActiveApplicationId, currentUser } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedRoleType, setSelectedRoleType] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

    const matchesWorkMode =
      selectedWorkMode === 'All' ||
      (selectedWorkMode === 'Remote' && job.location.toLowerCase().includes('remote')) ||
      (selectedWorkMode === 'Hybrid' && job.location.toLowerCase().includes('hybrid')) ||
      (selectedWorkMode === 'On-site' && (job.location.toLowerCase().includes('pretoria') && !job.location.toLowerCase().includes('remote')));

    const matchesRoleType =
      selectedRoleType === 'All' ||
      job.type.toLowerCase().includes(selectedRoleType.toLowerCase());

    const isActive = job.status !== 'Closed';

    return matchesSearch && matchesDept && matchesWorkMode && matchesRoleType && isActive;
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

  const handleOpenGeneralApply = () => {
    const generalJob: Job = {
      id: 'general-talent-pool',
      title: 'General Engineering Application (Pretoria / Hybrid)',
      department: 'Engineering',
      location: 'Pretoria, South Africa (Hybrid & On-site)',
      type: 'Full-time / Contract',
      salary: 'Market-related',
      experience: 'All experience levels welcome',
      description: 'Open application for software engineers, frontend/backend developers, and systems architects interested in building platforms and tooling with 12 Links Future Technologies.',
      requirements: [
        'Demonstrated interest in TypeScript, Python, modern web frameworks, or systems programming',
        'Portfolio, GitHub profile, or examples of built work',
        'Ability to collaborate with a focused engineering team based in Pretoria'
      ],
      responsibilities: [
        'Build and maintain web platforms and systems software',
        'Participate in architecture reviews and automated testing',
        'Contribute to customer-facing and internal tools'
      ],
      benefits: [
        'Direct involvement in foundational system architecture',
        'Modern workstations and continuous professional development',
        'Flexible Pretoria-based hybrid working environment'
      ],
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSelectedJob(generalJob);
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

    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill out all required contact fields (Full name, Email address, Phone number).');
      return;
    }

    setIsSubmitting(true);

    let backendId: string | undefined = undefined;
    const apiUrl = import.meta.env.VITE_API_URL ?? '/api';

    if (apiUrl) {
      try {
        const formData = new FormData();
        formData.append('job_id', selectedJob.id);
        formData.append('applicant_name', name.trim());
        formData.append('applicant_email', email.trim());
        formData.append('applicant_phone', phone.trim());
        if (portfolio) formData.append('portfolio_url', portfolio.trim());
        if (github) formData.append('github_url', github.trim());

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

    // Save to local application state
    const createdAppId = applyToJob({
      id: backendId,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      applicantName: name.trim(),
      applicantEmail: email.trim(),
      applicantPhone: phone.trim(),
      portfolioUrl: portfolio.trim() || undefined,
      githubUrl: github.trim() || undefined,
      linkedinUrl: linkedin.trim() || undefined,
      resumeFileName: resumeName || 'Resume_Document.pdf',
      experienceYears: experience,
      coverLetter: coverLetter.trim() || undefined
    });

    setActiveApplicationId(createdAppId);
    setSuccessAppId(createdAppId);
    setIsSubmitting(false);
    setIsApplyModalOpen(false);

    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
    setPortfolio('');
    setGithub('');
    setLinkedin('');
    setCoverLetter('');
    setResumeName('');
    setResumeSize('');
  };

  return (
    <div className="space-y-8">
      {/* Hero Section: Crisp, high-contrast engineering header */}
      <section className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-sm text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700/80 rounded-full text-xs font-medium text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Careers at 12 Links Future Technologies
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Careers at 12 Links Future Technologies
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Join our Pretoria engineering team building custom web platforms, AI tooling, and systems software.
          </p>

          {/* Authentic stack & location tags */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl">
              <Code2 className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
              <span>TypeScript & Next.js</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl">
              <Terminal className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
              <span>Python & FastAPI</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
              <span>Pretoria / Hybrid</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
              <span>Project & Graduate Roles</span>
            </div>
          </div>
        </div>
      </section>

      {/* When NO vacancies exist: Hide broken search filters and offer clean Open Application / CV Drop */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-5 shadow-xs">
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Advertised Vacancies Right Now</h3>
            <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              We are not actively recruiting for a specific position today, but we regularly evaluate exceptional developers and systems engineers for our Pretoria office and hybrid projects. Submit a general application with your portfolio, GitHub, and CV.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenGeneralApply}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Submit General Application / CV Drop</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ) : (
        /* When vacancies ARE present: Display search and separated filters */
        <>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by job title, skill (e.g. React, Python), or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 transition-all placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Separated Work Mode Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedWorkMode}
                  onChange={e => setSelectedWorkMode(e.target.value)}
                  className="text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none text-slate-700"
                >
                  <option value="All">All work modes</option>
                  <option value="On-site">On-site (Pretoria)</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>

                {/* Separated Employment Type Filter */}
                <select
                  value={selectedRoleType}
                  onChange={e => setSelectedRoleType(e.target.value)}
                  className="text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none text-slate-700"
                >
                  <option value="All">All role types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship / Graduate</option>
                </select>
              </div>
            </div>

            {/* Department Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-medium text-slate-500 shrink-0 mr-1">Department:</span>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Vacancies List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Open Opportunities</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
                </p>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" strokeWidth={1.5} />
                <h3 className="font-semibold text-slate-800 text-sm">No positions match your search</h3>
                <p className="text-xs text-slate-500">Try adjusting your keyword search or clear the filter selections.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDept('All');
                    setSelectedWorkMode('All');
                    setSelectedRoleType('All');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredJobs.map(job => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400 p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group text-left"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {job.department}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors pt-1">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Key metadata pills */}
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> {job.type}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Requirements */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-semibold text-slate-500">Requirements:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {req}
                            </span>
                          ))}
                          {job.requirements.length > 3 && (
                            <span className="text-[11px] text-slate-400 self-center">
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
                        className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-center cursor-pointer"
                      >
                        View details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenApply(job)}
                        className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* JOB DETAILS MODAL */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {selectedJob.department}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> {selectedJob.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> {selectedJob.type}
                    </span>
                    {selectedJob.salary && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{selectedJob.salary}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Role Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-800">About the role</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Responsibilities */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-800">Key responsibilities</h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedJob.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-800">Candidate qualifications</h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800">Perks and benefits</h3>
                  <ul className="space-y-1 text-xs text-slate-600 mt-2">
                    {selectedJob.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold">•</span>
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
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenApply(selectedJob)}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for this position</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLICATION FORM MODAL */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    Application Form
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1.5">{selectedJob.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedJob.department} • {selectedJob.location}
                  </p>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {currentUser && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-700 flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.5} />
                  <span>Logged in as <strong>{currentUser.name}</strong> ({currentUser.email}). Information auto-filled.</span>
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Full name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sipho Ndlovu"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Email address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. sipho.ndlovu@example.com"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Phone / mobile number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+27 82 123 4567"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Years of experience
                    </label>
                    <select
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 transition-all text-slate-700"
                    >
                      <option value="Graduate / Student">Graduate / Student</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-8 Years">5-8 Years</option>
                      <option value="8+ Years">8+ Years</option>
                    </select>
                  </div>
                </div>

                {/* Web & Social Profiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> Portfolio / website
                    </label>
                    <input
                      type="url"
                      value={portfolio}
                      onChange={e => setPortfolio(e.target.value)}
                      placeholder="https://yourportfolio.co.za"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> GitHub profile
                    </label>
                    <input
                      type="url"
                      value={github}
                      onChange={e => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} /> LinkedIn profile
                    </label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={e => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Cover Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Why do you want to join 12 Links? (Cover statement)
                  </label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    placeholder="Tell us about yourself, what you enjoy building, and why you are interested in joining our team..."
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-slate-800 placeholder:text-slate-400 leading-relaxed"
                  />
                </div>

                {/* Resume Upload Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Resume / CV document (PDF or DOCX)
                  </label>
                  <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-100/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input
                      type="file"
                      id="applicant-resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-7 h-7 text-slate-500 mb-1" strokeWidth={1.5} />
                    {resumeName ? (
                      <div className="text-center">
                        <span className="text-xs font-semibold text-slate-900 block">{resumeName}</span>
                        <span className="text-[11px] text-slate-400">{resumeSize} • Ready to upload</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-xs font-semibold text-slate-700 block">Click to select or drag document here</span>
                        <span className="text-[11px] text-slate-400">PDF or DOCX format (up to 10MB)</span>
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
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting application...</span>
                    ) : (
                      <>
                        <span>Submit application</span>
                        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-200 text-center space-y-5"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" strokeWidth={1.5} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Application Submitted</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Thank you for applying. We have received your details and our engineering recruitment team will review them.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <span className="text-xs font-semibold text-slate-600 block">Application Reference ID</span>
                <p className="text-lg font-bold text-slate-900 font-mono tracking-wider">{successAppId}</p>
                <p className="text-[11px] text-slate-400">Keep this reference ID to track your live application progress.</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessAppId(null);
                    if (onNavigateToTab) onNavigateToTab('tracker');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Track Application Status</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessAppId(null)}
                  className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Return to vacancies
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
