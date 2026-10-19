import React, { useState, useEffect, useMemo } from 'react';
import {
  PRACTICE_QUESTIONS,
  PRACTICE_CATEGORIES,
  DIFFICULTY_LEVELS,
  INTERVIEW_TYPES
} from '../data/practiceQuestionsData';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckSquare,
  Square,
  X,
  Code,
  Layers,
  Users,
  Award,
  Play,
  RotateCcw,
  Check,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export const PracticeQuestionsPage = ({ onStartPracticeQuestion, onStartNew }) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedInterviewType, setSelectedInterviewType] = useState('All');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [filterCompletedOnly, setFilterCompletedOnly] = useState(false);

  // Saved / Bookmarked Questions (persisted in localStorage)
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewai_saved_questions');
      return stored ? JSON.parse(stored) : ['dsa-1', 'js-1', 'react-1', 'sys-1'];
    } catch {
      return ['dsa-1', 'js-1', 'react-1', 'sys-1'];
    }
  });

  // Completed Questions (persisted in localStorage)
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewai_completed_questions');
      return stored ? JSON.parse(stored) : ['dsa-1', 'hr-1'];
    } catch {
      return ['dsa-1', 'hr-1'];
    }
  });

  // Question Detail Modal State
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [revealedHints, setRevealedHints] = useState({}); // { [hintIndex]: boolean }

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('interviewai_saved_questions', JSON.stringify(savedIds));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('interviewai_completed_questions', JSON.stringify(completedIds));
    } catch (e) {
      console.warn('LocalStorage completed error:', e);
    }
  }, [completedIds]);

  // Toggle Save / Bookmark
  const toggleSave = (id, e) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Completed
  const toggleCompleted = (id, e) => {
    if (e) e.stopPropagation();
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Question Detail Modal
  const handleOpenDetail = (question) => {
    setSelectedQuestion(question);
    setRevealedHints({}); // reset revealed hints for new question
  };

  // Toggle progressive hint reveal
  const toggleHint = (index) => {
    setRevealedHints((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Handle Practice Action
  const handlePractice = (question, e) => {
    if (e) e.stopPropagation();
    if (onStartPracticeQuestion) {
      onStartPracticeQuestion(question);
    } else if (onStartNew) {
      onStartNew();
    }
  };

  // Filter & Search logic
  const filteredQuestions = useMemo(() => {
    return PRACTICE_QUESTIONS.filter((q) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesConcepts = q.expectedConcepts.some((c) => c.toLowerCase().includes(query));
        if (!matchesQuestion && !matchesTopic && !matchesConcepts) {
          return false;
        }
      }

      // Topic filter
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Interview Type filter
      if (selectedInterviewType !== 'All' && q.interviewType !== selectedInterviewType) {
        return false;
      }

      // Saved only
      if (filterSavedOnly && !savedIds.includes(q.id)) {
        return false;
      }

      // Completed only
      if (filterCompletedOnly && !completedIds.includes(q.id)) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedTopic,
    selectedDifficulty,
    selectedInterviewType,
    filterSavedOnly,
    filterCompletedOnly,
    savedIds,
    completedIds
  ]);

  // Color helper for Difficulty
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/25';
    }
  };

  // Topic Color & Icon helper
  const getTopicBadgeStyle = (topic) => {
    switch (topic) {
      case 'DSA':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'JavaScript':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      case 'React':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'Python':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Java':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'SQL':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'System Design':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'HR':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case 'Behavioral':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    }
  };

  const getTopicIcon = (topic) => {
    switch (topic) {
      case 'DSA':
      case 'JavaScript':
      case 'React':
      case 'Python':
      case 'Java':
        return <Code className="w-3.5 h-3.5" />;
      case 'SQL':
      case 'System Design':
        return <Layers className="w-3.5 h-3.5" />;
      case 'HR':
      case 'Behavioral':
        return <Users className="w-3.5 h-3.5" />;
      default:
        return <Zap className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* =========================================================================
          1. HEADER & META STATS
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Interview Question Bank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Practice Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Sharpen your fundamentals across all 9 technical and behavioral tracks. Study hints, expected concepts, and solution breakdowns.
          </p>
        </div>

        {/* Quick progress counter */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white">
                {completedIds.length} / {PRACTICE_QUESTIONS.length}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm font-bold text-white">
                {savedIds.length}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. SEARCH & COMPREHENSIVE FILTERS BAR
          - Topic (9 Categories)
          - Difficulty (Easy, Medium, Hard)
          - Interview Type (Coding, Technical, System Design, Behavioral, HR)
          - Search bar
         ========================================================================= */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by question title, concept, algorithm, or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Toggle: Saved Only & Completed Only */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                filterSavedOnly
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({savedIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterCompletedOnly(!filterCompletedOnly)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                filterCompletedOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed ({completedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Dropdowns Row: Difficulty & Interview Type */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3">
            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Difficulty:</span>
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                {['All', ...DIFFICULTY_LEVELS].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
              <select
                value={selectedInterviewType}
                onChange={(e) => setSelectedInterviewType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All Types</option>
                {INTERVIEW_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredQuestions.length}</strong> of{' '}
            {PRACTICE_QUESTIONS.length} questions
          </div>
        </div>

        {/* Category Pills (The 9 Core Categories) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Category Track ({PRACTICE_CATEGORIES.length}):
          </span>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            <button
              type="button"
              onClick={() => setSelectedTopic('All')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedTopic === 'All'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Topics
            </button>
            {PRACTICE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTopic(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                  selectedTopic === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. QUESTIONS CARDS GRID
          Each card shows:
          - Question
          - Difficulty
          - Topic
          - Estimated time
          Actions:
          - Practice
          - Save
          - Mark as completed
         ========================================================================= */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No questions match your current filters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords, clear category selections, or toggle off the saved/completed filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('All');
              setSelectedDifficulty('All');
              setSelectedInterviewType('All');
              setFilterSavedOnly(false);
              setFilterCompletedOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuestions.map((q) => {
            const isSaved = savedIds.includes(q.id);
            const isCompleted = completedIds.includes(q.id);

            return (
              <div
                key={q.id}
                onClick={() => handleOpenDetail(q)}
                className={`p-5 rounded-3xl bg-slate-900 border transition-all flex flex-col justify-between space-y-4 group cursor-pointer hover:shadow-2xl hover:scale-[1.01] ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-gradient-to-b from-slate-900 to-emerald-950/10'
                    : 'border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                {/* Header row: Topic, Difficulty, Time, Save & Complete icons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {/* Topic Badge */}
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getTopicBadgeStyle(
                        q.topic
                      )}`}
                    >
                      {getTopicIcon(q.topic)}
                      <span>{q.topic}</span>
                    </span>

                    {/* Top right quick icons: Save & Complete */}
                    <div className="flex items-center space-x-1">
                      {/* Mark Completed Toggle */}
                      <button
                        type="button"
                        onClick={(e) => toggleCompleted(q.id, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isCompleted
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800'
                        }`}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {/* Bookmark / Save Toggle */}
                      <button
                        type="button"
                        onClick={(e) => toggleSave(q.id, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                        }`}
                        title={isSaved ? 'Remove from saved' : 'Save question'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-3">
                    {q.question}
                  </h3>
                </div>

                {/* Meta details & Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    {/* Difficulty & Type */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${getDifficultyBadge(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-slate-400 text-[11px]">{q.interviewType}</span>
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{q.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Practice, Save, Mark as completed */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* View Details / Hints */}
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(q)}
                      className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Details & Hints</span>
                    </button>

                    {/* Practice Button */}
                    <button
                      type="button"
                      onClick={(e) => handlePractice(q, e)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Practice</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          4. QUESTION DETAIL MODAL
          Contains:
          - Question prompt & meta badges
          - Hints (progressive reveal)
          - Expected concepts
          - Answer discussion
          - Practice button
         ========================================================================= */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/50">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getTopicBadgeStyle(
                      selectedQuestion.topic
                    )}`}
                  >
                    {getTopicIcon(selectedQuestion.topic)}
                    <span>{selectedQuestion.topic}</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getDifficultyBadge(
                      selectedQuestion.difficulty
                    )}`}
                  >
                    {selectedQuestion.difficulty}
                  </span>

                  <span className="text-slate-400 text-xs font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedQuestion.estimatedTime}</span>
                  </span>

                  <span className="text-slate-500 text-xs">&bull;</span>
                  <span className="text-slate-400 text-xs font-semibold">
                    {selectedQuestion.interviewType} Interview
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {selectedQuestion.question}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Expected Concepts */}
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Award className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Expected Concepts Tested
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedQuestion.expectedConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 text-xs font-medium"
                    >
                      &bull; {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progressive Hints Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Progressive Hints ({selectedQuestion.hints.length})
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Click to reveal when you need a nudge
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedQuestion.hints.map((hint, idx) => {
                    const isRevealed = revealedHints[idx];
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60"
                      >
                        <button
                          type="button"
                          onClick={() => toggleHint(idx)}
                          className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span>Hint {idx + 1}</span>
                          </span>
                          <span className="text-[11px] text-indigo-400 font-bold">
                            {isRevealed ? 'Hide Hint' : 'Click to Reveal'}
                          </span>
                        </button>
                        {isRevealed && (
                          <div className="p-3.5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-amber-500/5">
                            {hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* In-depth Answer Discussion */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Comprehensive Answer Discussion & Architecture
                  </h4>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedQuestion.answerDiscussion}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-5 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3 text-xs">
                {/* Save toggle inside modal */}
                <button
                  type="button"
                  onClick={() => toggleSave(selectedQuestion.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    savedIds.includes(selectedQuestion.id)
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedIds.includes(selectedQuestion.id) ? 'Saved' : 'Save Question'}</span>
                </button>

                {/* Completed toggle inside modal */}
                <button
                  type="button"
                  onClick={() => toggleCompleted(selectedQuestion.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    completedIds.includes(selectedQuestion.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedIds.includes(selectedQuestion.id) ? 'Completed' : 'Mark Completed'}</span>
                </button>
              </div>

              {/* Direct Practice Button */}
              <button
                type="button"
                onClick={() => {
                  const q = selectedQuestion;
                  setSelectedQuestion(null);
                  handlePractice(q);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Practice This Question Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeQuestionsPage;
