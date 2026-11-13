import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { Job, JobStatus } from '../../shared/types';
import {
  Plus,
  Trash2,
  MapPin,
  Briefcase,
  DollarSign,
  FileText,
  Check,
  AlertCircle,
  Sparkles,
  Edit2,
  Users,
  Eye,
  Clock,
  X,
  Building,
  CheckCircle2,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const JobPostingsManager: React.FC = () => {
  const { jobs, addJob, updateJob, deleteJob, toggleJobStatus, applications } = useAppState();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Pretoria, South Africa (Hybrid)');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('R 75,000 - R 100,000 / month');
  const [experience, setExperience] = useState('3+ Years');
  const [description, setDescription] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [respInput, setRespInput] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState(false);

  // Filter
  const [searchFilter, setSearchFilter] = useState('');

  const handleStartCreate = () => {
    setEditingJobId(null);
    setTitle('');
    setDepartment('Engineering');
    setLocation('Pretoria, South Africa (Hybrid)');
    setType('Full-time');
    setSalary('R 75,000 - R 100,000 / month');
    setExperience('3+ Years');
    setDescription('');
    setRequirements(['3+ years of relevant experience', 'Strong problem solving skills']);
    setResponsibilities(['Collaborate with team members to deliver high quality features']);
    setBenefits(['Competitive compensation', 'Flexible work arrangements']);
    setIsFormOpen(true);
  };

  const handleStartEdit = (job: Job) => {
    setEditingJobId(job.id);
    setTitle(job.title);
    setDepartment(job.department);
    setLocation(job.location);
    setType(job.type);
    setSalary(job.salary);
    setExperience(job.experience);
    setDescription(job.description);
    setRequirements(job.requirements || []);
    setResponsibilities(job.responsibilities || []);
    setBenefits(job.benefits || []);
    setIsFormOpen(true);
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqInput.trim()) {
      setRequirements(prev => [...prev, reqInput.trim()]);
      setReqInput('');
    }
  };

  const handleAddResponsibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (respInput.trim()) {
      setResponsibilities(prev => [...prev, respInput.trim()]);
      setRespInput('');
    }
  };

  const handleAddBenefit = (e: React.FormEvent) => {
    e.preventDefault();
    if (benefitInput.trim()) {
      setBenefits(prev => [...prev, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !salary || !description || requirements.length === 0) {
      alert('Please fill out all required fields and add at least one qualification requirement!');
      return;
    }

    if (editingJobId) {
      updateJob(editingJobId, {
        title,
        department,
        location,
        type,
        salary,
        experience,
        description,
        requirements,
        responsibilities,
        benefits
      });
    } else {
      addJob({
        title,
        department,
        location,
        type,
        salary,
        experience,
        description,
        requirements,
        responsibilities,
        benefits,
        status: 'Active',
        featured: false
      });
    }

    setIsFormOpen(false);
    setEditingJobId(null);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const getApplicantCount = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };

  const filteredJobs = jobs.filter(
    j =>
      j.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.department.toLowerCase().includes(searchFilter.toLowerCase()) ||
      j.location.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div id="job-manager-root" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            Recruitment Campaign Manager
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Advertised Job Vacancies</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, pause, or publish open positions shown on the applicant portal.
          </p>
        </div>

        <button
          id="post-job-btn"
          onClick={handleStartCreate}
          className="px-5 py-3 bg-indigo-600 text-white text-xs font-bold rounded-2xl hover:bg-indigo-700 active:scale-95 shadow-md flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Advertise New Position</span>
        </button>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Job opening updated successfully and published to the Applicant Careers board!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT FORM MODAL / ACCORDION */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-6 text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingJobId ? 'Edit Job Opening Specifications' : 'Advertise a New Team Position'}
                </h3>
                <p className="text-xs text-slate-500">Provide role description, requirements, and benefits.</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Position Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Senior Machine Learning Engineer"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Department *</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI & Innovations">AI & Innovations</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Platform Operations">Platform Operations</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Pretoria, South Africa (Hybrid) or Remote"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Work Mode / Type *</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Monthly Compensation Range *</label>
                  <input
                    type="text"
                    required
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                    placeholder="e.g. R 85,000 - R 115,000 / month"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Experience Level *</label>
                  <input
                    type="text"
                    required
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder="e.g. 3+ Years"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Role Summary & Overview *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Outline the mission of the role, impact on the company, and day-to-day work..."
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Requirements Chips */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Candidate Requirements *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reqInput}
                    onChange={e => setReqInput(e.target.value)}
                    placeholder="Add a required skill or qualification and click Add..."
                    className="flex-1 text-xs font-medium p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => setRequirements(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 cursor-pointer"
                >
                  {editingJobId ? 'Save Changes' : 'Publish Job Opening'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH AND FILTER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          placeholder="Filter job vacancies by title, department, or city..."
          className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500"
        />
        <span className="text-xs text-slate-400 font-bold shrink-0">{filteredJobs.length} Postings</span>
      </div>

      {/* JOBS LIST */}
      <div className="space-y-4">
        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Vacancies Created Yet</h4>
            <p className="text-xs text-slate-500">
              {searchFilter
                ? 'No postings match your search filter.'
                : 'Click "Post New Vacancy" above to advertise a new job opening for applicants.'}
            </p>
          </div>
        )}
        {filteredJobs.map(job => {
          const applicantCount = getApplicantCount(job.id);
          const isPaused = job.status === 'Paused';

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isPaused ? 'border-amber-200 bg-amber-50/20 opacity-80' : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {job.department}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPaused
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {isPaused ? 'Paused' : 'Active Listing'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Posted {job.createdAt}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900">{job.title}</h3>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" /> {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-500" /> {job.salary}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> {job.experience}
                  </span>
                </div>
              </div>

              {/* Metrics & Actions */}
              <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl">
                  <span className="text-xs font-black text-indigo-600 block">{applicantCount}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applicants</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleJobStatus(job.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isPaused
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                    title={isPaused ? 'Resume position listing' : 'Pause position listing'}
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStartEdit(job)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                    title="Edit vacancy details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete vacancy "${job.title}"?`)) {
                        deleteJob(job.id);
                      }
                    }}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                    title="Delete vacancy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
