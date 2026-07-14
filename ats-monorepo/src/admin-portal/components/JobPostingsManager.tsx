import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { Plus, Trash2, MapPin, Briefcase, DollarSign, FileText, Check, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const JobPostingsManager: React.FC = () => {
  const { jobs, addJob, deleteJob, applications } = useAppState();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('3+ Years');
  const [description, setDescription] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqInput.trim()) {
      setRequirements(prev => [...prev, reqInput.trim()]);
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !salary || !description || requirements.length === 0) {
      alert('Please fill out all required fields and add at least one requirement!');
      return;
    }

    addJob({
      title,
      department,
      location,
      type,
      salary,
      experience,
      description,
      requirements
    });

    // Reset Form
    setTitle('');
    setDepartment('Engineering');
    setLocation('');
    setType('Full-time');
    setSalary('');
    setExperience('3+ Years');
    setDescription('');
    setRequirements([]);
    setIsFormOpen(false);

    // Show banner success
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  // Helper to count applicants per job
  const getApplicantCount = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };

  return (
    <div id="job-manager-root" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Active Job Postings</h2>
          <p className="text-xs text-slate-500 mt-1">Manage career listings and review applicant counts in real-time.</p>
        </div>
        <button
          id="post-job-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 active:scale-95 shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Posting
        </button>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <Check className="w-4.5 h-4.5" />
            Job posting added successfully and is now active on the career board!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Form expansion */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6"
          >
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-slate-50 pb-2">New Job Openings Specifications</h3>
            
            <form onSubmit={handleSubmitJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Job Title *</label>
                  <input
                    id="new-job-title"
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Developer Relations">Developer Relations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Location *</label>
                  <input
                    id="new-job-location"
                    type="text"
                    required
                    placeholder="e.g. Remote / San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Job Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Salary Range *</label>
                  <input
                    id="new-job-salary"
                    type="text"
                    required
                    placeholder="e.g. $110,000 - $140,000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Role Description *</label>
                <textarea
                  id="new-job-desc"
                  required
                  rows={4}
                  placeholder="Provide a description of the roles responsibilities, day-to-day operations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Requirement builder */}
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs font-bold text-slate-700">Add Core Requirements *</label>
                
                <div className="flex gap-2">
                  <input
                    id="new-job-requirement-input"
                    type="text"
                    placeholder="e.g. 3+ Years React experience"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900"
                  >
                    Add
                  </button>
                </div>

                {requirements.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-xs">
                        <span className="text-slate-600 font-medium">{req}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(idx)}
                          className="text-rose-500 hover:text-rose-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  id="submit-job-btn"
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Post Active Job Listing
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of existing jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const appCount = getApplicantCount(job.id);
          return (
            <div
              id={`admin-job-card-${job.id}`}
              key={job.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                    {job.department}
                  </span>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Archive listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-800 text-sm mt-3 line-clamp-1">{job.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Listed on {job.createdAt}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.type} • {job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>

              {/* Stats & footer */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Applicants</span>
                <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 font-bold text-indigo-600 rounded-lg">
                  {appCount} {appCount === 1 ? 'applicant' : 'applicants'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default JobPostingsManager;
