import React, { useState } from 'react';
import { useAppState } from '../../shared/StateContext';
import { CodingQuestion } from '../../shared/types';
import { FileCode, Plus, Edit2, Trash2, Save, X, Info, Terminal, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CodingQuestionsManager: React.FC = () => {
  const { questions, saveQuestion, deleteQuestion } = useAppState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [description, setDescription] = useState('');
  const [tsTemplate, setTsTemplate] = useState('');
  const [jsTemplate, setJsTemplate] = useState('');
  const [testCases, setTestCases] = useState<{ input: string; expected: string; description: string }[]>([
    { input: '', expected: '', description: '' }
  ]);

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    questions.length > 0 ? questions[0].id : null
  );

  const selectedQuestion = questions.find(q => q.id === activeQuestionId);

  const startEdit = (q: CodingQuestion) => {
    setEditingId(q.id);
    setIsAddingNew(false);
    setTitle(q.title);
    setDifficulty(q.difficulty);
    setDescription(q.description);
    setTsTemplate(q.starterTemplates?.typescript || '');
    setJsTemplate(q.starterTemplates?.javascript || '');
    setTestCases(q.testCases || [{ input: '', expected: '', description: '' }]);
  };

  const startAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setTitle('');
    setDifficulty('Easy');
    setDescription(`Given an array... return ...\n\n### Example 1:\n**Input:** ...\n**Output:** ...`);
    setTsTemplate(`function mySolution() {\n    // Write your code here\n}`);
    setJsTemplate(`function mySolution() {\n    // Write your code here\n}`);
    setTestCases([{ input: '', expected: '', description: 'Basic test scenario' }]);
  };

  const handleAddTestCase = () => {
    setTestCases(prev => [...prev, { input: '', expected: '', description: '' }]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length === 1) return;
    setTestCases(prev => prev.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'expected' | 'description', value: string) => {
    setTestCases(prev => prev.map((tc, i) => i === index ? { ...tc, [field]: value } : tc));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill out the Title and Description!');
      return;
    }

    const invalidTestCase = testCases.some(tc => !tc.input.trim() || !tc.expected.trim());
    if (invalidTestCase) {
      alert('Please fill out all Input and Expected fields for test cases!');
      return;
    }

    const questionData = {
      title,
      difficulty,
      description,
      starterTemplates: {
        typescript: tsTemplate,
        javascript: jsTemplate
      },
      testCases
    };

    saveQuestion(editingId ? { ...questionData, id: editingId } : questionData);
    
    // Reset form states
    setEditingId(null);
    setIsAddingNew(false);
    
    // Set active question to the newly created/saved one
    if (!editingId) {
      // Find latest question or default
      setTimeout(() => {
        setActiveQuestionId(questions[questions.length - 1]?.id || null);
      }, 50);
    }
  };

  const handleDelete = (id: string) => {
    if (questions.length <= 1) {
      alert('You must have at least one coding question in the database!');
      return;
    }
    if (confirm('Are you absolutely sure you want to delete this coding challenge?')) {
      deleteQuestion(id);
      if (activeQuestionId === id) {
        const remaining = questions.filter(q => q.id !== id);
        setActiveQuestionId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT PANEL: Challenges List */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Assessment Challenges</h3>
            <p className="text-[11px] text-slate-400">Manage coding evaluation tasks</p>
          </div>
          <button
            onClick={startAddNew}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center gap-1 text-xs font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Challenge
          </button>
        </div>

        <div className="space-y-2.5 max-h-[65vh] overflow-y-auto pr-1">
          {questions.map((q) => {
            const isActive = q.id === activeQuestionId && !isAddingNew;
            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                  isActive
                    ? 'bg-indigo-50/40 border-indigo-200/80 shadow-sm'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
                onClick={() => {
                  setActiveQuestionId(q.id);
                  setIsAddingNew(false);
                  setEditingId(null);
                }}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-700 font-sans">{q.title}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{q.testCases.length} Test Scenarios</p>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(q);
                      }}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                      title="Edit details"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(q.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete challenge"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Edit Form or View Panel */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {isAddingNew || editingId ? (
            /* CHALLENGE FORM (ADD/EDIT) */
            <motion.form
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  {editingId ? 'Edit Coding Challenge' : 'New Coding Challenge'}
                </h3>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Challenge Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Reverse a Linked List"
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Problem Description (supports markdown)</label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the logic challenge, parameters, and example structures..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-colors font-mono"
                />
              </div>

              {/* Starter Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">TypeScript Starter Code</label>
                  <textarea
                    rows={6}
                    value={tsTemplate}
                    onChange={(e) => setTsTemplate(e.target.value)}
                    placeholder="function solve() {\n}"
                    className="w-full text-[11px] px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-colors font-mono bg-slate-50 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">JavaScript Starter Code</label>
                  <textarea
                    rows={6}
                    value={jsTemplate}
                    onChange={(e) => setJsTemplate(e.target.value)}
                    placeholder="function solve() {\n}"
                    className="w-full text-[11px] px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 transition-colors font-mono bg-slate-50 text-slate-700"
                  />
                </div>
              </div>

              {/* Unit Test cases */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Automated Testing Cases</label>
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Test Scenario
                  </button>
                </div>

                <div className="space-y-3 max-h-[25vh] overflow-y-auto pr-1">
                  {testCases.map((tc, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end relative">
                      <div className="md:col-span-4 space-y-1 text-left">
                        <label className="text-[9px] text-slate-400 font-semibold block">Input Params</label>
                        <input
                          type="text"
                          required
                          value={tc.input}
                          onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                          placeholder="e.g. [2,7,11], 9"
                          className="w-full text-[11px] px-2.5 py-1.5 rounded-md border border-slate-200 bg-white outline-none"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-1 text-left">
                        <label className="text-[9px] text-slate-400 font-semibold block">Expected Value</label>
                        <input
                          type="text"
                          required
                          value={tc.expected}
                          onChange={(e) => handleTestCaseChange(index, 'expected', e.target.value)}
                          placeholder="e.g. [0,1]"
                          className="w-full text-[11px] px-2.5 py-1.5 rounded-md border border-slate-200 bg-white outline-none"
                        />
                      </div>
                      <div className="md:col-span-4 space-y-1 text-left">
                        <label className="text-[9px] text-slate-400 font-semibold block">Description</label>
                        <input
                          type="text"
                          value={tc.description}
                          onChange={(e) => handleTestCaseChange(index, 'description', e.target.value)}
                          placeholder="Basic check"
                          className="w-full text-[11px] px-2.5 py-1.5 rounded-md border border-slate-200 bg-white outline-none"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-center pb-1">
                        <button
                          type="button"
                          disabled={testCases.length === 1}
                          onClick={() => handleRemoveTestCase(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Challenge
                </button>
              </div>
            </motion.form>
          ) : selectedQuestion ? (
            /* CHALLENGE DETAIL VIEW */
            <motion.div
              key="viewer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-extrabold text-slate-800">{selectedQuestion.title}</h2>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      selectedQuestion.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : selectedQuestion.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {selectedQuestion.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase">ID: {selectedQuestion.id}</p>
                </div>

                <button
                  onClick={() => startEdit(selectedQuestion)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Challenge
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Description</h4>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-sans">
                    {selectedQuestion.description}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">TypeScript Starter</h4>
                    <pre className="bg-slate-900 text-emerald-400 text-[10px] p-3.5 rounded-xl overflow-x-auto font-mono max-h-36">
                      {selectedQuestion.starterTemplates?.typescript || '// No TS Starter Code'}
                    </pre>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">JavaScript Starter</h4>
                    <pre className="bg-slate-900 text-emerald-400 text-[10px] p-3.5 rounded-xl overflow-x-auto font-mono max-h-36">
                      {selectedQuestion.starterTemplates?.javascript || '// No JS Starter Code'}
                    </pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Expected Evaluation Scenarios</h4>
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {selectedQuestion.testCases.map((tc, index) => (
                      <div key={index} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold rounded-full flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-700">{tc.description || `Scenario ${index + 1}`}</span>
                        </div>
                        <div className="flex gap-4 font-mono text-[10px]">
                          <div>
                            <span className="text-slate-400">Input:</span> <span className="bg-white border px-1.5 py-0.5 rounded text-slate-600">{tc.input}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Expected:</span> <span className="bg-white border px-1.5 py-0.5 rounded text-emerald-600 font-semibold">{tc.expected}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
              <FileCode className="w-12 h-12 text-indigo-100 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No question selected. Click "Add Challenge" to create one!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
