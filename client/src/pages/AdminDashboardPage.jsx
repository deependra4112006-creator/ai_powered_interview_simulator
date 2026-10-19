import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import {
  LayoutDashboard,
  Users,
  PlayCircle,
  HelpCircle,
  FileBarChart,
  Cpu,
  Settings,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  BarChart2,
  Clock,
  Sparkles,
  Shield,
  Filter,
  Download,
  RefreshCw,
  X,
  Check,
  ChevronRight,
  UserCheck,
  UserX,
  Award,
  Layers,
  Code,
  Activity,
  Zap,
  Globe,
  Database,
  Sliders,
  Loader2
} from 'lucide-react';

export const AdminDashboardPage = ({ setActivePage, onStartNew }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'interviews' | 'questions' | 'reports' | 'ai_usage' | 'settings'

  // Loading & Refresh State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Statistics State
  const [stats, setStats] = useState({
    totalUsers: 1482,
    activeUsers: 348,
    interviewsCompleted: 2890,
    averageScore: 81,
    aiRequests: 28450,
    dailyActivity: 195,
    dailyVolume: [
      { day: 'Mon', date: 'Oct 07', volume: 112, avgScore: 78, aiCalls: 3400 },
      { day: 'Tue', date: 'Oct 08', volume: 145, avgScore: 80, aiCalls: 4100 },
      { day: 'Wed', date: 'Oct 09', volume: 188, avgScore: 82, aiCalls: 5300 },
      { day: 'Thu', date: 'Oct 10', volume: 164, avgScore: 81, aiCalls: 4700 },
      { day: 'Fri', date: 'Oct 11', volume: 220, avgScore: 84, aiCalls: 6200 },
      { day: 'Sat', date: 'Oct 12', volume: 175, avgScore: 83, aiCalls: 4900 },
      { day: 'Sun', date: 'Oct 13', volume: 195, avgScore: 85, aiCalls: 5500 }
    ],
    typeBreakdown: [
      { type: 'Technical', count: 980, share: 34, avgScore: 82 },
      { type: 'Coding / DSA', count: 820, share: 28, avgScore: 78 },
      { type: 'Behavioral (STAR)', count: 540, share: 19, avgScore: 88 },
      { type: 'System Design', count: 350, share: 12, avgScore: 79 },
      { type: 'HR Screening', count: 200, share: 7, avgScore: 91 }
    ],
    aiUsage: {
      totalTokens: '42.8M Tokens',
      avgLatency: '1.24s',
      engineUptime: '99.98%',
      modelBreakdown: [
        { model: 'Gemini 1.5 Flash', usage: '68%', status: 'Active' },
        { model: 'InterviewAI Heuristics', usage: '24%', status: 'Standby' },
        { model: 'OpenAI GPT-4o Mini', usage: '8%', status: 'Available' }
      ]
    }
  });

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');

  // Questions State
  const [questionsList, setQuestionsList] = useState([]);
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState('All');
  const [questionDifficultyFilter, setQuestionDifficultyFilter] = useState('All');

  // Question Modal (Add & Edit)
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    category: 'Technical',
    difficulty: 'Medium',
    interviewType: 'Technical',
    estimatedTime: '20 mins',
    expectedConcepts: '',
    hints: '',
    answerDiscussion: ''
  });

  // Destructive Action Confirmation Dialogs
  const [deleteQuestionModalOpen, setDeleteQuestionModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [targetUserForStatus, setTargetUserForStatus] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  // Fetch Admin Data
  const fetchAdminData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, usersRes, questionsRes] = await Promise.all([
        api.admin.getStats().catch(() => null),
        api.admin.getUsers().catch(() => null),
        api.admin.getQuestions().catch(() => null)
      ]);

      if (statsRes && statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
      if (usersRes && usersRes.success && usersRes.users) {
        setUsersList(usersRes.users);
      }
      if (questionsRes && questionsRes.success && questionsRes.questions) {
        setQuestionsList(questionsRes.questions);
      }
    } catch (err) {
      console.warn('Error fetching admin data, using initial data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesRole = u.role.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole) return false;
      }
      if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
      if (userStatusFilter !== 'All' && u.status !== userStatusFilter) return false;
      return true;
    });
  }, [usersList, userSearchQuery, userRoleFilter, userStatusFilter]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questionsList.filter((q) => {
      if (questionSearchQuery.trim()) {
        const query = questionSearchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesCat = q.category.toLowerCase().includes(query);
        if (!matchesQ && !matchesCat) return false;
      }
      if (questionCategoryFilter !== 'All' && q.category !== questionCategoryFilter) return false;
      if (questionDifficultyFilter !== 'All' && q.difficulty !== questionDifficultyFilter) return false;
      return true;
    });
  }, [questionsList, questionSearchQuery, questionCategoryFilter, questionDifficultyFilter]);

  // Handle Question Add / Edit Submit
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.question.trim()) return;

    const payload = {
      question: questionForm.question.trim(),
      category: questionForm.category,
      difficulty: questionForm.difficulty,
      interviewType: questionForm.interviewType,
      estimatedTime: questionForm.estimatedTime,
      expectedConcepts: questionForm.expectedConcepts
        ? questionForm.expectedConcepts.split(',').map((s) => s.trim())
        : ['Fundamentals'],
      hints: questionForm.hints ? questionForm.hints.split('\n').filter(Boolean) : ['Review fundamentals'],
      answerDiscussion: questionForm.answerDiscussion
    };

    try {
      if (editingQuestion) {
        await api.admin.updateQuestion(editingQuestion.id, payload);
        setQuestionsList((prev) =>
          prev.map((q) => (q.id === editingQuestion.id ? { ...q, ...payload } : q))
        );
        showToast('Question updated successfully.');
      } else {
        const res = await api.admin.createQuestion(payload);
        if (res.success && res.question) {
          setQuestionsList((prev) => [res.question, ...prev]);
        }
        showToast('New question created and published.');
      }
      setQuestionModalOpen(false);
      setEditingQuestion(null);
    } catch (err) {
      alert(`Error saving question: ${err.message}`);
    }
  };

  // Open Edit Question Modal
  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setQuestionForm({
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      interviewType: q.interviewType || 'Technical',
      estimatedTime: q.estimatedTime || '20 mins',
      expectedConcepts: Array.isArray(q.expectedConcepts) ? q.expectedConcepts.join(', ') : '',
      hints: Array.isArray(q.hints) ? q.hints.join('\n') : '',
      answerDiscussion: q.answerDiscussion || ''
    });
    setQuestionModalOpen(true);
  };

  // Open Create Question Modal
  const handleOpenCreateQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      question: '',
      category: 'Technical',
      difficulty: 'Medium',
      interviewType: 'Technical',
      estimatedTime: '20 mins',
      expectedConcepts: 'System architecture, Time complexity, Scalability',
      hints: 'Think about asymptotic complexity bounds.\nConsider horizontal sharding.',
      answerDiscussion: 'Detailed architectural breakdown and optimal code solution.'
    });
    setQuestionModalOpen(true);
  };

  // Confirm Delete Question
  const handleConfirmDeleteQuestion = async () => {
    if (!questionToDelete) return;
    try {
      await api.admin.deleteQuestion(questionToDelete.id);
      setQuestionsList((prev) => prev.filter((q) => q.id !== questionToDelete.id));
      showToast('Question permanently deleted.');
      setDeleteQuestionModalOpen(false);
      setQuestionToDelete(null);
    } catch (err) {
      alert(`Error deleting question: ${err.message}`);
    }
  };

  // Confirm User Status Change
  const handleConfirmStatusChange = async (newStatus) => {
    if (!targetUserForStatus) return;
    try {
      await api.admin.updateUserStatus(targetUserForStatus.id, newStatus);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserForStatus.id ? { ...u, status: newStatus } : u))
      );
      showToast(`User status updated to ${newStatus}.`);
      setStatusChangeModalOpen(false);
      setTargetUserForStatus(null);
    } catch (err) {
      alert(`Error updating user: ${err.message}`);
    }
  };

  // SVG Chart Dimensions
  const chartWidth = 600;
  const chartHeight = 200;
  const maxVol = Math.max(...stats.dailyVolume.map((d) => d.volume), 200);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: PlayCircle },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'ai_usage', label: 'AI Usage', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading InterviewAI Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* =========================================================================
          1. ADMIN HEADER
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>InterviewAI Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor platform metrics, evaluate candidate volume, manage users, and curate interview question banks.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={fetchAdminData}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh System Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateQuestion}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Sidebar + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            2. ADMIN SIDEBAR (7 EXACT SECTIONS)
            - Overview
            - Users
            - Interviews
            - Questions
            - Reports
            - AI Usage
            - Settings
           ========================================================================= */}
        <aside className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 space-y-1 sticky top-24 shadow-xl">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* =========================================================================
            3. MAIN CONTENT PANELS
           ========================================================================= */}
        <main className="lg:col-span-9 space-y-6">
          {/* =======================================================================
              VIEW: OVERVIEW (Stats + Interview Analytics Trends)
             ======================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dashboard Statistics (6 Required Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* 1. Total users */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
                    <span>Total Users</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +12.4% this month
                  </span>
                </div>

                {/* 2. Active users */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
                    <span>Active Users</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.activeUsers.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400">Daily active candidate pool</span>
                </div>

                {/* 3. Interviews completed */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
                    <span>Interviews Completed</span>
                    <PlayCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.interviewsCompleted.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +248 this week
                  </span>
                </div>

                {/* 4. Average score */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
                    <span>Average Score</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    {stats.averageScore}%
                  </div>
                  <span className="text-[11px] text-slate-400">Benchmark pass line: 80%</span>
                </div>

                {/* 5. AI requests */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
                    <span>AI Requests</span>
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.aiRequests.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-bold text-indigo-400">P99: 1.4s latency</span>
                </div>

                {/* 6. Daily activity */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
                    <span>Daily Activity</span>
                    <Zap className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {stats.dailyActivity}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">99.98% System Uptime</span>
                </div>
              </div>

              {/* Interview Analytics: Volume & Performance Trends */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <BarChart2 className="w-4 h-4 text-indigo-400" />
                      <span>Interview Volume & Performance Trends</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Daily interview mock sessions and average candidate score trajectory over the last 7 days.
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-2 rounded bg-indigo-500 inline-block" />
                      <span>Daily Volume (Sessions)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-1 rounded bg-amber-400 inline-block" />
                      <span>Average Score (%)</span>
                    </span>
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="relative w-full h-56 bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 flex items-end justify-between gap-3">
                  {stats.dailyVolume.map((item, idx) => {
                    const barHeightPct = Math.round((item.volume / maxVol) * 85);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                        {/* Hover tag */}
                        <div className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors text-center">
                          <span className="block text-indigo-400">{item.volume} mocks</span>
                          <span className="block text-[9px] text-amber-400 font-semibold">{item.avgScore}% avg</span>
                        </div>

                        {/* Bar */}
                        <div className="w-full max-w-[36px] bg-slate-900 rounded-t-xl overflow-hidden h-36 flex items-end border border-slate-800/60 p-0.5">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 via-indigo-500 to-cyan-400 group-hover:from-indigo-500 group-hover:to-cyan-300 transition-all duration-500"
                            style={{ height: `${barHeightPct}%` }}
                          />
                        </div>

                        <span className="text-[11px] font-semibold text-slate-400">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Type Distribution Breakdown */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Interview Track Volume & Benchmark Pass Rates</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                  {stats.typeBreakdown.map((type, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{type.type}</span>
                        <span className="text-indigo-400 font-extrabold">{type.share}%</span>
                      </div>
                      <div className="text-lg font-black text-slate-200">
                        {type.count} <span className="text-[11px] font-normal text-slate-400">rounds</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                          style={{ width: `${type.share * 2.5}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-amber-400 block font-semibold">
                        Avg Score: {type.avgScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW: USERS (Users Table with Name, Email, Role, Interviews, Score, Joined, Status)
             ======================================================================= */}
          {activeTab === 'users' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>Candidate & User Directory</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage candidate enrollments, interview completions, and account standing.
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  Showing <strong className="text-white">{filteredUsers.length}</strong> candidates
                </span>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search candidate by name, email, or role..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
                  />
                </div>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Invited">Invited</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* The Users Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4 text-center">Interviews</th>
                      <th className="py-3.5 px-4 text-center">Avg Score</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{u.email}</td>
                        <td className="py-3.5 px-4 text-slate-200">
                          <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-white">{u.interviews}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-indigo-400">{u.averageScore}%</td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">{u.joinedDate}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              u.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : u.status === 'Suspended'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetUserForStatus(u);
                              setStatusChangeModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Manage Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW: QUESTIONS (Question Management CRUD)
             ======================================================================= */}
          {activeTab === 'questions' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <span>Question Bank Management</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add, edit, set difficulty, categorize, and prune interview rubric questions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateQuestion}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Question</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={questionSearchQuery}
                    onChange={(e) => setQuestionSearchQuery(e.target.value)}
                    placeholder="Search questions by keyword or topic..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
                  />
                </div>

                <select
                  value={questionDifficultyFilter}
                  onChange={(e) => setQuestionDifficultyFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select
                  value={questionCategoryFilter}
                  onChange={(e) => setQuestionCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="All">All Categories</option>
                  <option value="DSA">DSA</option>
                  <option value="Technical">Technical</option>
                  <option value="Architecture">System Design</option>
                  <option value="Coding">Coding</option>
                  <option value="Behavioral">Behavioral</option>
                </select>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[11px] font-semibold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                          {q.category}
                        </span>
                        <span className="text-slate-400 text-[11px]">{q.interviewType}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{q.question}</h4>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditQuestion(q)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                        title="Edit question parameters"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setQuestionToDelete(q);
                          setDeleteQuestionModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW: INTERVIEWS (System Session History)
             ======================================================================= */}
          {activeTab === 'interviews' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <PlayCircle className="w-5 h-5 text-indigo-400" />
                    <span>Live & Historical Mock Interviews</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live interview sessions across all candidates in the simulator.
                  </p>
                </div>
                <span className="text-xs text-slate-400">Total: 2,890 sessions logged</span>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'sess_1', title: 'Senior Frontend Architecture', user: 'Alex Chen', role: 'Frontend Developer', score: 94, date: 'Today, 10:30 AM', status: 'Completed' },
                  { id: 'sess_2', title: 'Distributed Systems & Partitioning', user: 'David Patel', role: 'Backend Architect', score: 85, date: 'Today, 09:15 AM', status: 'Completed' },
                  { id: 'sess_3', title: 'STAR Behavioral Leadership', user: 'Sarah Jenkins', role: 'Full Stack Engineer', score: 88, date: 'Yesterday', status: 'Completed' },
                  { id: 'sess_4', title: 'Algorithmic Binary Trees (DSA)', user: 'Marcus Vance', role: 'Software Engineer', score: 72, date: 'Oct 11', status: 'Completed' },
                  { id: 'sess_5', title: 'High Concurrency API Design', user: 'Elena Rostova', role: 'Systems Engineer', score: 91, date: 'Oct 10', status: 'Completed' }
                ].map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{s.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900">
                          {s.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Candidate: <strong className="text-slate-300">{s.user}</strong> &bull; {s.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-indigo-400">{s.score}%</span>
                      <span className="text-[10px] block text-emerald-400 font-semibold">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW: REPORTS (Candidate Competency Benchmarks)
             ======================================================================= */}
          {activeTab === 'reports' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <FileBarChart className="w-5 h-5 text-indigo-400" />
                  <span>System Assessment Reports</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform-wide rubric evaluation benchmarks and hiring score distributions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Hire Recommendation Rate</span>
                  <div className="text-2xl font-black text-emerald-400">72.4%</div>
                  <p className="text-[11px] text-slate-500">Candidates scoring 80% or higher</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Average Duration</span>
                  <div className="text-2xl font-black text-indigo-400">22.8 mins</div>
                  <p className="text-[11px] text-slate-500">Across 4-question mock sessions</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Strong Hire Percentile</span>
                  <div className="text-2xl font-black text-amber-400">Top 15%</div>
                  <p className="text-[11px] text-slate-500">Candidates with score &ge; 90%</p>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW: AI USAGE (Tokens, Latency, Engine Status)
             ======================================================================= */}
          {activeTab === 'ai_usage' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <span>AI Inference & Engine Health</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time telemetry on Google Gemini API calls, token throughput, and heuristic fallbacks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Total Token Consumption</span>
                  <div className="text-2xl font-black text-white">{stats.aiUsage.totalTokens}</div>
                  <span className="text-[11px] text-indigo-400">Evaluations & Question Generation</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Average Response Time</span>
                  <div className="text-2xl font-black text-emerald-400">{stats.aiUsage.avgLatency}</div>
                  <span className="text-[11px] text-slate-400">Fast evaluation streaming</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Engine Uptime</span>
                  <div className="text-2xl font-black text-cyan-400">{stats.aiUsage.engineUptime}</div>
                  <span className="text-[11px] text-slate-400">Zero downtime architecture</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Model Routing Status
                </h4>
                <div className="space-y-2">
                  {stats.aiUsage.modelBreakdown.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-white">{m.model}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-400">Usage share: <strong>{m.usage}</strong></span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW: SETTINGS (Admin Platform Flags)
             ======================================================================= */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <span>Platform System Settings</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure global evaluation temperature, candidate rate-limits, and engine keys.
                </p>
              </div>

              <div className="space-y-4 max-w-xl text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Maintenance Mode</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      Operational
                    </span>
                  </div>
                  <p className="text-slate-400">Platform is currently accepting candidate sessions normally.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-white">Default Evaluation Rubric Engine</span>
                  <p className="text-slate-400">
                    Dual-pass: Heuristic AST analyzer combined with semantic LLM grader for senior code scoring.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          4. QUESTION ADD / EDIT MODAL
         ========================================================================= */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>{editingQuestion ? 'Edit Question' : 'Add New Question'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setQuestionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider">Question Prompt *</label>
                <textarea
                  required
                  rows={3}
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="e.g. Explain how the Event Loop handles Microtasks vs Macrotasks in JavaScript..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Category</label>
                  <select
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="DSA">DSA</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="SQL">SQL</option>
                    <option value="System Design">System Design</option>
                    <option value="HR">HR</option>
                    <option value="Behavioral">Behavioral</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm((f) => ({ ...f, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Type</label>
                  <select
                    value={questionForm.interviewType}
                    onChange={(e) => setQuestionForm((f) => ({ ...f, interviewType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Coding">Coding</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="HR">HR</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Expected Concepts (comma separated)
                </label>
                <input
                  type="text"
                  value={questionForm.expectedConcepts}
                  onChange={(e) => setQuestionForm((f) => ({ ...f, expectedConcepts: e.target.value }))}
                  placeholder="e.g. Call Stack, Promises, queueMicrotask, Repaint timing"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider">
                  Progressive Hints (one per line)
                </label>
                <textarea
                  rows={2}
                  value={questionForm.hints}
                  onChange={(e) => setQuestionForm((f) => ({ ...f, hints: e.target.value }))}
                  placeholder="Hint 1...&#10;Hint 2..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {editingQuestion ? 'Save Changes' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. CONFIRMATION DIALOG: DELETE QUESTION
         ========================================================================= */}
      {deleteQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Question?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this question? Candidates will no longer receive this prompt in new mock sessions.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white italic">
              "{questionToDelete?.question}"
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteQuestionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteQuestion}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Yes, Delete Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. CONFIRMATION DIALOG: USER STATUS CHANGE
         ========================================================================= */}
      {statusChangeModalOpen && targetUserForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-indigo-400">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Manage User Status</h3>
            </div>

            <p className="text-xs text-slate-300">
              Update account status for candidate: <strong className="text-white">{targetUserForStatus.name}</strong> ({targetUserForStatus.email})
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmStatusChange('Active')}
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Set Active
              </button>
              <button
                type="button"
                onClick={() => handleConfirmStatusChange('Invited')}
                className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Set Invited
              </button>
              <button
                type="button"
                onClick={() => handleConfirmStatusChange('Suspended')}
                className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Suspend
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStatusChangeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
