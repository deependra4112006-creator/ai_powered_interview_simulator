import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import {
  History,
  Search,
  Filter,
  ArrowRight,
  Trash2,
  Clock,
  Award,
  Loader2,
  Calendar,
  Sparkles,
  Layers,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
  RefreshCw,
  Plus,
  TrendingUp,
  X
} from 'lucide-react';

export const HistoryPage = ({ onViewSession, onStartNew }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search query
  const [search, setSearch] = useState('');

  // Filters requested:
  // - Interview type
  // - Role
  // - Date
  // - Score range
  const [filterType, setFilterType] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterScoreRange, setFilterScoreRange] = useState('all');

  // Layout View Mode: 'table' | 'cards'
  const [viewMode, setViewMode] = useState('table');

  // Fetch sessions from API and fallback to localStorage
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.interviews.getUserSessions();
      if (res && res.success && Array.isArray(res.sessions)) {
        setSessions(res.sessions);
      } else {
        // Fallback to local stored sessions
        const cached = localStorage.getItem('interviewai_all_sessions');
        if (cached) {
          setSessions(JSON.parse(cached));
        } else {
          setSessions([]);
        }
      }
    } catch (err) {
      console.warn('API fetch notice, checking local storage:', err.message);
      const cached = localStorage.getItem('interviewai_all_sessions');
      if (cached) {
        setSessions(JSON.parse(cached));
      } else {
        setSessions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Delete session handler
  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this session from your history?')) {
      try {
        await api.interviews.deleteSession(id);
      } catch (e) {}

      const updated = sessions.filter((s) => (s._id || s.id) !== id);
      setSessions(updated);
      localStorage.setItem('interviewai_all_sessions', JSON.stringify(updated));
    }
  };

  // Optional: Load sample demo interviews for user testing
  const handleLoadSampleInterviews = () => {
    const demoSessions = [
      {
        id: 'demo_1',
        title: 'Full Stack Engineer Technical Interview',
        role: 'Full Stack Developer',
        interviewMode: 'technical',
        difficulty: 'Medium',
        status: 'completed',
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 22).toISOString(),
        totalDurationSeconds: 1320,
        overallFeedback: {
          overallScore: 91,
          recommendation: 'Strong Hire',
          summary: 'Excellent breakdown of asynchronous microservices, React reconciler, and caching architectures.'
        },
        questions: [
          { questionText: 'Tell me about yourself.' },
          { questionText: 'Explain microservices communication.' },
          { questionText: 'Optimizing React renders.' }
        ]
      },
      {
        id: 'demo_2',
        title: 'Software Engineer Algorithmic Coding Challenge',
        role: 'Software Engineer',
        interviewMode: 'coding',
        difficulty: 'Hard',
        status: 'completed',
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 35).toISOString(),
        totalDurationSeconds: 2100,
        overallFeedback: {
          overallScore: 86,
          recommendation: 'Hire',
          summary: 'Optimal two-pointer approach for sliding window, clean Big-O complexity explanation.'
        },
        questions: [
          { questionText: 'Two Sum Problem.' },
          { questionText: 'LRU Cache.' }
        ]
      },
      {
        id: 'demo_3',
        title: 'Behavioral & Leadership STAR Simulation',
        role: 'Frontend Developer',
        interviewMode: 'behavioral',
        difficulty: 'Medium',
        status: 'completed',
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8 + 1000 * 60 * 18).toISOString(),
        totalDurationSeconds: 1080,
        overallFeedback: {
          overallScore: 94,
          recommendation: 'Strong Hire',
          summary: 'Outstanding Situation-Task-Action-Result storytelling with quantifiable project outcomes.'
        },
        questions: [
          { questionText: 'Tell me about a challenging technical bug.' },
          { questionText: 'Resolving conflicting priorities.' }
        ]
      },
      {
        id: 'demo_4',
        title: 'Backend Scalability & Distributed Systems',
        role: 'Backend Developer',
        interviewMode: 'technical',
        difficulty: 'Hard',
        status: 'completed',
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 28).toISOString(),
        totalDurationSeconds: 1680,
        overallFeedback: {
          overallScore: 78,
          recommendation: 'Needs Practice',
          summary: 'Solid database knowledge, but missed Redis distributed locking gotchas under high concurrency.'
        },
        questions: [
          { questionText: 'Distributed transaction management.' },
          { questionText: 'Database sharding vs replication.' }
        ]
      },
      {
        id: 'demo_5',
        title: 'HR Culture Fit & Executive Evaluation',
        role: 'Data Analyst',
        interviewMode: 'hr',
        difficulty: 'Easy',
        status: 'completed',
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20 + 1000 * 60 * 15).toISOString(),
        totalDurationSeconds: 900,
        overallFeedback: {
          overallScore: 88,
          recommendation: 'Hire',
          summary: 'Great communication and alignment with data governance practices.'
        },
        questions: [
          { questionText: 'Why should we hire you?' },
          { questionText: 'Where do you see yourself in 5 years?' }
        ]
      }
    ];

    setSessions(demoSessions);
    localStorage.setItem('interviewai_all_sessions', JSON.stringify(demoSessions));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterRole('all');
    setFilterDate('all');
    setFilterScoreRange('all');
  };

  // Filter and search logic
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // 1. Search Query (title, role, mode)
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (s.title || '').toLowerCase().includes(q);
        const matchRole = (s.role || '').toLowerCase().includes(q);
        const matchType = (s.interviewMode || '').toLowerCase().includes(q);
        if (!matchTitle && !matchRole && !matchType) return false;
      }

      // 2. Filter: Interview Type
      if (filterType !== 'all') {
        const mode = (s.interviewMode || '').toLowerCase();
        if (filterType === 'technical' && !mode.includes('tech')) return false;
        if (filterType === 'behavioral' && !mode.includes('behav') && !mode.includes('star')) return false;
        if (filterType === 'coding' && !mode.includes('cod')) return false;
        if (filterType === 'hr' && !mode.includes('hr')) return false;
        if (filterType === 'system_design' && !mode.includes('system')) return false;
        if (filterType === 'mixed' && !mode.includes('mix')) return false;
      }

      // 3. Filter: Role
      if (filterRole !== 'all') {
        if ((s.role || '').toLowerCase() !== filterRole.toLowerCase()) return false;
      }

      // 4. Filter: Date
      if (filterDate !== 'all') {
        const sessionDate = new Date(s.startedAt || s.createdAt || Date.now());
        const now = new Date();
        const diffDays = (now - sessionDate) / (1000 * 60 * 60 * 24);

        if (filterDate === 'today' && diffDays > 1) return false;
        if (filterDate === 'week' && diffDays > 7) return false;
        if (filterDate === 'month' && diffDays > 30) return false;
        if (filterDate === 'quarter' && diffDays > 90) return false;
      }

      // 5. Filter: Score Range
      if (filterScoreRange !== 'all') {
        const score = s.overallFeedback?.overallScore || s.overallFeedback?.score || 0;
        if (filterScoreRange === '90_100' && score < 90) return false;
        if (filterScoreRange === '80_89' && (score < 80 || score >= 90)) return false;
        if (filterScoreRange === '70_79' && (score < 70 || score >= 80)) return false;
        if (filterScoreRange === 'below_70' && score >= 70) return false;
      }

      return true;
    });
  }, [sessions, search, filterType, filterRole, filterDate, filterScoreRange]);

  // Overall Statistics from existing sessions
  const stats = useMemo(() => {
    if (sessions.length === 0) return { total: 0, avgScore: 0, highestScore: 0, totalHours: 0 };

    const completed = sessions.filter((s) => s.status === 'completed' || s.overallFeedback);
    const scores = completed.map((s) => s.overallFeedback?.overallScore || s.overallFeedback?.score || 0).filter(Boolean);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const totalSecs = sessions.reduce((acc, s) => acc + (s.totalDurationSeconds || 1200), 0);
    const totalHours = (totalSecs / 3600).toFixed(1);

    return {
      total: sessions.length,
      avgScore,
      highestScore,
      totalHours
    };
  }, [sessions]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading your interview archive...</p>
      </div>
    );
  }

  // Check if any filter is active
  const hasActiveFilters = search || filterType !== 'all' || filterRole !== 'all' || filterDate !== 'all' || filterScoreRange !== 'all';

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* =========================================================================
          PAGE HEADER
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Session Archive & Records
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-3">
            <History className="w-8 h-8 text-indigo-400" />
            <span>Interview History</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Inspect past AI simulations, examine question-by-question evaluations, and track your progress over time.
          </p>
        </div>

        {/* Top Actions: New Interview & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Layout Toggle: Table vs Cards */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'cards' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          {/* New Interview Button */}
          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          QUICK STATS SUMMARY CARDS (If sessions exist)
         ========================================================================= */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Interviews</span>
            <span className="text-2xl font-black text-white font-mono">{stats.total}</span>
            <span className="text-[10px] text-slate-400 block">All recorded sessions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Average Score</span>
            <span className="text-2xl font-black text-indigo-400 font-mono">{stats.avgScore}/100</span>
            <span className="text-[10px] text-slate-400 block">Across completed rounds</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Highest Score</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{stats.highestScore}/100</span>
            <span className="text-[10px] text-slate-400 block">Personal best performance</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Practice Time</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">{stats.totalHours} hrs</span>
            <span className="text-[10px] text-slate-400 block">Total simulation hours</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          SEARCH & FILTERS PANEL:
          - Search input
          - Filter: Interview type
          - Filter: Role
          - Filter: Date
          - Filter: Score range
         ========================================================================= */}
      {sessions.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role, session title, format..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* 1. Filter: Interview Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Interview Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral (STAR)</option>
                  <option value="coding">Coding</option>
                  <option value="hr">HR Round</option>
                  <option value="system_design">System Design</option>
                  <option value="mixed">Mixed Mocks</option>
                </select>
              </div>

              {/* 2. Filter: Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Target Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>

              {/* 3. Filter: Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Date
                </label>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Past 7 Days</option>
                  <option value="month">Past 30 Days</option>
                  <option value="quarter">Past 90 Days</option>
                </select>
              </div>

              {/* 4. Filter: Score Range */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Score Range
                </label>
                <select
                  value={filterScoreRange}
                  onChange={(e) => setFilterScoreRange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Scores</option>
                  <option value="90_100">90 - 100 (Strong Hire)</option>
                  <option value="80_89">80 - 89 (Hire)</option>
                  <option value="70_79">70 - 79 (Pass)</option>
                  <option value="below_70">Below 70 (Needs Work)</option>
                </select>
              </div>

            </div>

          </div>

          {/* Reset Filters Link */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800 text-slate-400">
              <span>Showing {filteredSessions.length} of {sessions.length} recorded interviews</span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          EMPTY STATE (Exact user requirement):
          "You haven't completed any interviews yet."
          Button: "Start Your First Interview"
         ========================================================================= */}
      {sessions.length === 0 ? (
        <div className="p-10 sm:p-16 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto animate-pulse">
            <History className="w-10 h-10 text-indigo-400" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              You haven't completed any interviews yet.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Take your first AI interview with Dr. Elena Vance to receive instant performance scoring, feedback rubrics, and personalized skill analytics.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onStartNew}
              className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Start Your First Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Optional Demo Loader to test populated view */}
            <button
              type="button"
              onClick={handleLoadSampleInterviews}
              className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl font-semibold text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Interviews</span>
            </button>
          </div>
        </div>
      ) : filteredSessions.length === 0 ? (
        /* Empty Filter State */
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <Search className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">No interviews match your search criteria</h4>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* =========================================================================
            TABLE LAYOUT:
            Columns requested:
            - Date
            - Role
            - Interview Type
            - Difficulty
            - Score
            - Duration
            - Status
            - View Report
           ========================================================================= */
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Role</th>
                  <th className="py-4 px-5">Interview Type</th>
                  <th className="py-4 px-5">Difficulty</th>
                  <th className="py-4 px-5">Score</th>
                  <th className="py-4 px-5">Duration</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">View Report</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
                {filteredSessions.map((s) => {
                  const id = s._id || s.id;
                  const isCompleted = s.status === 'completed' || s.overallFeedback;
                  const score = s.overallFeedback?.overallScore || s.overallFeedback?.score || 85;
                  const durationMins = Math.round((s.totalDurationSeconds || 1200) / 60);
                  const dateStr = s.startedAt || s.createdAt
                    ? new Date(s.startedAt || s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Recent';

                  const typeFormatted = s.interviewMode
                    ? s.interviewMode.charAt(0).toUpperCase() + s.interviewMode.slice(1)
                    : 'Technical';

                  return (
                    <tr
                      key={id}
                      onClick={() => onViewSession(s)}
                      className="hover:bg-slate-850/70 transition-colors cursor-pointer group"
                    >
                      {/* 1. Date */}
                      <td className="py-4 px-5 font-mono text-slate-300 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* 2. Role */}
                      <td className="py-4 px-5 font-bold text-white whitespace-nowrap">
                        {s.role || 'Software Engineer'}
                      </td>

                      {/* 3. Interview Type */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {typeFormatted}
                        </span>
                      </td>

                      {/* 4. Difficulty */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.difficulty === 'Hard'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : s.difficulty === 'Medium'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {s.difficulty || 'Medium'}
                        </span>
                      </td>

                      {/* 5. Score */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {isCompleted ? (
                          <div className="flex items-baseline space-x-1 font-mono">
                            <span className="font-extrabold text-sm text-white">{score}</span>
                            <span className="text-[10px] text-slate-500">/100</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-400 font-mono">In Progress</span>
                        )}
                      </td>

                      {/* 6. Duration */}
                      <td className="py-4 px-5 font-mono whitespace-nowrap text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{durationMins} mins</span>
                        </div>
                      </td>

                      {/* 7. Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                          <span>{isCompleted ? 'Completed' : 'In Progress'}</span>
                        </span>
                      </td>

                      {/* 8. View Report Button */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewSession(s);
                          }}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all hover:scale-105 cursor-pointer"
                        >
                          <span>View Report</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* =========================================================================
            CARD LAYOUT (Alternate view mode)
           ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((s) => {
            const id = s._id || s.id;
            const isCompleted = s.status === 'completed' || s.overallFeedback;
            const score = s.overallFeedback?.overallScore || s.overallFeedback?.score || 85;
            const durationMins = Math.round((s.totalDurationSeconds || 1200) / 60);
            const dateStr = s.startedAt || s.createdAt
              ? new Date(s.startedAt || s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recent';

            const typeFormatted = s.interviewMode
              ? s.interviewMode.charAt(0).toUpperCase() + s.interviewMode.slice(1)
              : 'Technical';

            return (
              <div
                key={id}
                onClick={() => onViewSession(s)}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between space-y-4 cursor-pointer transition-all hover:scale-[1.01] group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{dateStr}</span>
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isCompleted
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors">
                      {s.role || 'Software Engineer'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{s.title || 'Technical Simulation'}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {typeFormatted}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      s.difficulty === 'Hard'
                        ? 'bg-rose-500/15 text-rose-300'
                        : s.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-emerald-500/15 text-emerald-300'
                    }`}>
                      {s.difficulty || 'Medium'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                      {durationMins} mins
                    </span>
                  </div>
                </div>

                {/* Score & View Report Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Score</span>
                    <div className="flex items-baseline space-x-1 font-mono">
                      <span className="text-lg font-black text-white">{isCompleted ? score : '--'}</span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSession(s);
                    }}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default HistoryPage;
