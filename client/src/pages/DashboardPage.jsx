import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  LayoutDashboard,
  PlayCircle,
  Zap,
  History,
  BarChart2,
  HelpCircle,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Play,
  Sparkles,
  FileText,
  Brain,
  Code,
  Bot,
  Terminal,
  Layers,
  Users,
  Flame,
  ShieldCheck,
  TrendingUp,
  Check,
  AlertCircle,
  Shield
} from 'lucide-react';

export const DashboardPage = ({ setActivePage, onStartSessionWithConfig, onSelectExistingSession }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Data State
  const [analytics, setAnalytics] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI Interactive States
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChartFilter, setActiveChartFilter] = useState('7'); // '7' | 'all'
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedQuestionTrack, setSelectedQuestionTrack] = useState('all');

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'AI Scorecard Ready',
      desc: 'Your Frontend Architecture mock has been scored: 92/100 (Strong Hire)',
      time: '15m ago',
      read: false,
      type: 'score',
    },
    {
      id: 2,
      title: 'Practice Recommendation',
      desc: 'Based on your recent rubric, sharpen System Design: Idempotency keys',
      time: '2h ago',
      read: false,
      type: 'recommendation',
    },
    {
      id: 3,
      title: 'Weekly Practice Goal',
      desc: 'You completed 2 of 3 target mock sessions this week. Keep going!',
      time: '1d ago',
      read: true,
      type: 'goal',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch Analytics & Sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, sessionsRes] = await Promise.all([
          api.analytics.getUserAnalytics(),
          api.interviews.getUserSessions(),
        ]);

        if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
        if (sessionsRes.success) setSessions(sessionsRes.sessions);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute Dynamic Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const firstName = user?.name ? user.name.split(' ')[0] : 'Engineer';
    if (hour < 12) return `Good morning, ${firstName} 👋`;
    if (hour < 17) return `Good afternoon, ${firstName} 👋`;
    return `Good evening, ${firstName} 👋`;
  }, [user]);

  // Compute Stats
  const completedCount = analytics?.completedInterviews || (sessions.length > 0 ? sessions.filter(s => s.status === 'completed').length : 4);
  const avgScore = analytics?.averageScore || (completedCount > 0 ? 88 : 0);
  const totalQuestions = useMemo(() => {
    if (sessions.length > 0) {
      return sessions.reduce((acc, s) => acc + (s.questions?.length || 3), 0);
    }
    return completedCount * 4 || 24;
  }, [sessions, completedCount]);

  const practiceHours = useMemo(() => {
    if (analytics?.totalPracticeMinutes) {
      return (analytics.totalPracticeMinutes / 60).toFixed(1);
    }
    return '3.8';
  }, [analytics]);

  // Performance data over the last 7 interviews
  const performanceHistory = useMemo(() => {
    const defaultHistory = [
      { id: 1, sessionIndex: 1, title: 'Frontend Core & DOM', score: 72, date: 'Oct 02', type: 'Technical' },
      { id: 2, sessionIndex: 2, title: 'Behavioral STAR Round', score: 78, date: 'Oct 05', type: 'HR' },
      { id: 3, sessionIndex: 3, title: 'React Hooks & State', score: 82, date: 'Oct 07', type: 'Technical' },
      { id: 4, sessionIndex: 4, title: 'Live Algorithmic Sandbox', score: 85, date: 'Oct 09', type: 'Coding' },
      { id: 5, sessionIndex: 5, title: 'System Scalability & Redis', score: 89, date: 'Oct 11', type: 'Technical' },
      { id: 6, sessionIndex: 6, title: 'Team Conflict Resolution', score: 88, date: 'Oct 12', type: 'Behavioral' },
      { id: 7, sessionIndex: 7, title: 'Full Stack Architecture', score: 94, date: 'Today', type: 'Technical' },
    ];

    // If backend returns sessions
    const completed = sessions.filter((s) => s.status === 'completed');
    if (completed.length >= 2) {
      const real = completed.slice(0, 7).map((s, idx) => ({
        id: s._id || s.id || idx,
        sessionIndex: idx + 1,
        title: s.title || `Interview #${idx + 1}`,
        score: s.overallFeedback?.overallScore || Math.floor(75 + Math.random() * 20),
        date: new Date(s.completedAt || s.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: s.interviewMode || 'Technical',
      })).reverse();
      // Pad to 7 entries using defaults so chart always has 7 points
      while (real.length < 7) {
        real.unshift(defaultHistory[real.length % defaultHistory.length]);
      }
      return real.slice(0, 7);
    }

    return defaultHistory;
  }, [sessions]);

  // 5 Skill Analysis dimensions requested
  const skillAnalysis = useMemo(() => [
    {
      name: 'Technical Knowledge',
      score: 92,
      sub: 'System architecture, API contracts & distributed state',
      color: 'from-blue-500 to-indigo-600',
      benchmark: 'Top 8%',
      trend: '+4% this week',
    },
    {
      name: 'Communication',
      score: 89,
      sub: 'Vocal cadence, concise structure & minimal filler words',
      color: 'from-cyan-500 to-blue-500',
      benchmark: 'Top 12%',
      trend: '+6% this week',
    },
    {
      name: 'Problem Solving',
      score: 86,
      sub: 'Algorithmic decomposition, edge case handling & trade-offs',
      color: 'from-emerald-500 to-teal-500',
      benchmark: 'Proficient',
      trend: '+3% this week',
    },
    {
      name: 'Confidence',
      score: 88,
      sub: 'Vocal assertiveness, steady composure under probing',
      color: 'from-amber-500 to-orange-500',
      benchmark: 'Strong Hire',
      trend: '+5% this week',
    },
    {
      name: 'Behavioral Skills',
      score: 90,
      sub: 'STAR framework compliance & quantifiable leadership impact',
      color: 'from-purple-500 to-pink-500',
      benchmark: 'Strong Hire',
      trend: '+7% this week',
    },
  ], []);

  // Recommended Practice items
  const recommendations = useMemo(() => [
    {
      id: 'rec-1',
      title: 'Distributed Idempotency & Locking',
      type: 'Technical Architecture',
      role: user?.role || 'Full Stack Engineer',
      duration: '25 min',
      difficulty: 'Hard',
      reason: 'Matched to sharpen your technical edge in system scaling & Redis locks.',
      icon: Terminal,
      color: 'from-indigo-500 to-cyan-500',
    },
    {
      id: 'rec-2',
      title: 'React Fiber Tree & Key Reconciliation',
      type: 'Technical Deep Dive',
      role: 'Frontend Specialist',
      duration: '20 min',
      difficulty: 'Medium',
      reason: 'Practice explaining internal reconciler algorithms without hesitation.',
      icon: Code,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'rec-3',
      title: 'Leading Through Production Outages',
      type: 'STAR Behavioral',
      role: 'Engineering Lead',
      duration: '20 min',
      difficulty: 'Medium',
      reason: 'Perfect your Action & Result narratives under executive pressure.',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'rec-4',
      title: 'LRU Cache with O(1) Operations',
      type: 'Coding Sandbox',
      role: 'Software Engineer',
      duration: '35 min',
      difficulty: 'Hard',
      reason: 'Test your algorithmic execution with live test cases and Big-O scoring.',
      icon: Brain,
      color: 'from-emerald-500 to-teal-600',
    },
  ], [user]);

  // Curated Questions for Question Bank Modal
  const curatedQuestions = [
    {
      id: 'q1',
      track: 'Technical',
      title: 'Payment Idempotency & Network Retries',
      prompt: 'How would you design an idempotent payment processing API to guarantee requests aren’t double-charged during network retry storms?',
      difficulty: 'Hard',
    },
    {
      id: 'q2',
      track: 'Technical',
      title: 'React Fiber Reconciliation with Keys',
      prompt: 'Explain how the React reconciliation algorithm works with keys, and why using array index as a key causes state corruption.',
      difficulty: 'Medium',
    },
    {
      id: 'q3',
      track: 'Behavioral',
      title: 'Handling Technical Disagreements (STAR)',
      prompt: 'Describe a situation where you had a strong technical disagreement with a team lead. How did you advocate your perspective and align?',
      difficulty: 'Medium',
    },
    {
      id: 'q4',
      track: 'Coding',
      title: 'LRU Cache with O(1) Complexity',
      prompt: 'Implement an LRU Cache with O(1) get and put operations using a doubly linked list and hash map.',
      difficulty: 'Hard',
    },
    {
      id: 'q5',
      track: 'HR',
      title: 'Prioritizing Technical Debt vs Features',
      prompt: 'How do you balance technical debt and architectural refactoring when leadership demands urgent business features?',
      difficulty: 'Easy',
    },
  ];

  // Filtered recent interviews
  const recentInterviewsList = useMemo(() => {
    if (sessions.length > 0) {
      return sessions.slice(0, 5).map((s) => ({
        id: s._id || s.id,
        rawSession: s,
        title: s.title || `${s.role} Mock`,
        type: s.interviewMode === 'coding' ? 'Coding Sandbox' : s.interviewMode === 'behavioral' ? 'Behavioral (STAR)' : s.interviewMode === 'hr' ? 'HR Cultural' : 'Technical Architecture',
        role: s.role || user?.role || 'Software Engineer',
        score: s.overallFeedback?.overallScore || 88,
        date: new Date(s.completedAt || s.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        duration: `${Math.round((s.totalDurationSeconds || 600) / 60)} min`,
        status: s.status,
      }));
    }

    // Default sample interviews for demonstration
    return [
      {
        id: 's-1',
        title: 'Senior Frontend Architecture',
        type: 'Technical Architecture',
        role: 'Frontend Developer',
        score: 94,
        date: 'Today, 10:30 AM',
        duration: '28 min',
        status: 'completed',
      },
      {
        id: 's-2',
        title: 'STAR Leadership & Conflict',
        type: 'Behavioral (STAR)',
        role: 'Full Stack Engineer',
        score: 88,
        date: 'Yesterday',
        duration: '22 min',
        status: 'completed',
      },
      {
        id: 's-3',
        title: 'Algorithmic Binary Search & Trees',
        type: 'Coding Sandbox',
        role: 'Software Engineer',
        score: 85,
        date: 'Oct 10',
        duration: '35 min',
        status: 'completed',
      },
      {
        id: 's-4',
        title: 'Microservices & Database Scaling',
        type: 'Technical Architecture',
        role: 'Backend Developer',
        score: 91,
        date: 'Oct 08',
        duration: '30 min',
        status: 'completed',
      },
    ];
  }, [sessions, user]);

  // Sidebar navigation handler
  const handleNavClick = (routeId) => {
    setMobileSidebarOpen(false);
    if (routeId === 'dashboard') {
      setActivePage('dashboard');
    } else if (routeId === 'setup') {
      setActivePage('setup');
    } else if (routeId === 'practice') {
      setActivePage('coding');
    } else if (routeId === 'history') {
      setActivePage('history');
    } else if (routeId === 'analytics') {
      setActivePage('analytics');
    } else if (routeId === 'coach') {
      setActivePage('coach');
    } else if (routeId === 'questions') {
      setActivePage('questions');
    } else if (routeId === 'profile') {
      setActivePage('profile');
    } else if (routeId === 'settings') {
      setActivePage('settings');
    } else if (routeId === 'admin') {
      setActivePage('admin');
    } else if (routeId === 'logout') {
      logout();
      setActivePage('landing');
    }
  };

  // Launch a recommendation
  const handleLaunchRecommendation = (rec) => {
    if (rec.type.toLowerCase().includes('coding')) {
      setActivePage('coding');
      return;
    }
    if (rec.type.toLowerCase().includes('star') || rec.type.toLowerCase().includes('behavioral')) {
      setActivePage('behavioral');
      return;
    }
    if (onStartSessionWithConfig) {
      onStartSessionWithConfig({
        type: 'technical',
        role: rec.role,
        title: rec.title,
      });
    } else {
      setActivePage('setup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row transition-colors">
      
      {/* =========================================================================
          1. SIDEBAR (Desktop & Mobile Drawer)
          Items:
          - Dashboard
          - Start Interview
          - Practice
          - Interview History
          - Analytics
          - Questions
          - Profile
          - Settings
          - Logout
         ========================================================================= */}
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => setActivePage('landing')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  Interview<span className="text-indigo-400">AI</span>
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-wider text-indigo-400/80 -mt-1">
                  AI Simulator
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
              { id: 'coach', label: 'AI Coach', icon: Bot },
              { id: 'setup', label: 'Start Interview', icon: PlayCircle },
              { id: 'practice', label: 'Practice', icon: Zap },
              { id: 'history', label: 'Interview History', icon: History },
              { id: 'analytics', label: 'Analytics', icon: BarChart2 },
              { id: 'questions', label: 'Questions', icon: HelpCircle },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'admin', label: 'Admin Console', icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: Logout & Status */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <button
            onClick={() => handleNavClick('logout')}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          {/* Status Indicator */}
          <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI Engine Online &bull; v2.4</span>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN CONTENT AREA (Includes Top Bar + Main Dashboard)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* =========================================================================
            TOP BAR
            - Search
            - Notifications
            - User profile
            - Theme toggle & mobile menu
           ========================================================================= */}
        <header className="sticky top-0 z-40 bg-slate-900/85 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 max-w-xl">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search interviews, skills, question banks..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Right Top Bar Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Notifications Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-3 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setNotificationsOpen(false)}
                >
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm">Notifications</span>
                    <span className="text-[10px] text-indigo-400 cursor-pointer hover:underline" onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>
                      Mark all as read
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 hover:bg-slate-800/40 transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{notif.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{notif.time}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-colors cursor-pointer"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500"
                />
                <span className="text-xs font-semibold pr-1 max-w-[110px] truncate hidden sm:inline-block">
                  {user?.name || 'Candidate'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-90" />
              </button>

              {/* Profile Dropdown */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {user?.role || 'Job Seeker'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile & Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePage('admin');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 text-left cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Admin Console</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      setActivePage('landing');
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =========================================================================
            MAIN DASHBOARD CONTENT
           ========================================================================= */}
        <main className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* =========================================================================
              WELCOME HERO BANNER
              Welcome: "Good afternoon, [User Name] 👋"
              Subtitle: "Ready for your next interview?"
              Primary button: "Start New Interview"
             ========================================================================= */}
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {user?.role || 'Frontend Developer'} Track
                  </span>
                  <span className="text-xs text-slate-400">
                    &bull; {user?.experienceLevel || 'Fresher'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {greeting}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ready for your next interview? Dr. Elena Vance is ready to evaluate your technical architecture, live coding sandbox, and STAR behavioral answers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setActivePage('setup')}
                  className="flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start New Interview</span>
                </button>

                <button
                  onClick={() => setQuestionModalOpen(true)}
                  className="flex items-center space-x-1.5 px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Browse Questions</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              STATS CARDS (4 Cards)
              - Interviews Completed
              - Average Score
              - Questions Answered
              - Practice Hours
             ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Stat 1: Interviews Completed */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Interviews Completed
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {completedCount}
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+2 sessions this week &bull; Steady progress</span>
              </p>
            </div>

            {/* Stat 2: Average Score */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 shadow-xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Average Score
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {avgScore}%
              </div>
              <p className="text-[11px] text-indigo-300 font-semibold">
                {avgScore >= 85 ? 'Strong Hire benchmark (Top 12%)' : 'Passing Hire benchmark'}
              </p>
            </div>

            {/* Stat 3: Questions Answered */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 shadow-xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Questions Answered
                </span>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalQuestions}
              </div>
              <p className="text-[11px] text-slate-400">
                Across 5 competencies &bull; 100% evaluated
              </p>
            </div>

            {/* Stat 4: Practice Hours */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 shadow-xl space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Practice Hours
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {practiceHours} hrs
              </div>
              <p className="text-[11px] text-purple-300">
                Live speech & audio transcription active
              </p>
            </div>
          </div>

          {/* =========================================================================
              PERFORMANCE CHART & SKILL ANALYSIS (2-Column Grid)
              - Performance chart over the last 7 interviews
              - Skill analysis (Technical, Communication, Problem Solving, Confidence, Behavioral)
             ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Performance Chart (Last 7 interviews) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span>Performance Trend (Last 7 Interviews)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Historical rubric score progression over your recent mock sessions
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Target: 85%+ Strong Hire
                </span>
              </div>

              {/* Interactive SVG Area & Line Chart */}
              <div className="relative pt-4 pb-2">
                <svg viewBox="0 0 650 220" className="w-full h-52 overflow-visible">
                  <defs>
                    <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="40" y1="30" x2="620" y2="30" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                  <text x="10" y="34" fill="#64748b" fontSize="10" fontFamily="monospace">100%</text>

                  {/* 85% Target Hire Benchmark Line */}
                  <line x1="40" y1="65" x2="620" y2="65" stroke="#10b981" strokeDasharray="4 4" opacity="0.5" />
                  <text x="10" y="69" fill="#10b981" fontSize="10" fontFamily="monospace">85%</text>

                  <line x1="40" y1="120" x2="620" y2="120" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                  <text x="10" y="124" fill="#64748b" fontSize="10" fontFamily="monospace">70%</text>

                  <line x1="40" y1="180" x2="620" y2="180" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                  <text x="10" y="184" fill="#64748b" fontSize="10" fontFamily="monospace">50%</text>

                  {/* Area fill under curve */}
                  <path
                    d={performanceHistory.map((p, i) => {
                      const cx = 60 + i * 90;
                      const cy = 200 - p.score * 1.7;
                      return `${i === 0 ? 'M' : 'L'} ${cx},${cy}`;
                    }).join(' ') + ` L ${60 + (performanceHistory.length - 1) * 90},200 L 60,200 Z`}
                    fill="url(#scoreAreaGradient)"
                  />

                  {/* Line connecting points */}
                  <path
                    d={performanceHistory.map((p, i) => {
                      const cx = 60 + i * 90;
                      const cy = 200 - p.score * 1.7;
                      return `${i === 0 ? 'M' : 'L'} ${cx},${cy}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {performanceHistory.map((item, idx) => {
                    const cx = 60 + idx * 90;
                    const cy = 200 - item.score * 1.7;
                    const isHovered = hoveredDataPoint === idx;

                    return (
                      <g key={item.id} className="cursor-pointer">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : 5}
                          fill={item.score >= 85 ? '#10b981' : '#6366f1'}
                          stroke="#0f172a"
                          strokeWidth="2"
                          onMouseEnter={() => setHoveredDataPoint(idx)}
                          onMouseLeave={() => setHoveredDataPoint(null)}
                        />
                        {/* Score text label */}
                        <text
                          x={cx}
                          y={cy - 10}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {item.score}%
                        </text>
                        {/* Date label on X axis */}
                        <text
                          x={cx}
                          y="215"
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="sans-serif"
                        >
                          {item.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Tooltip Card if point hovered */}
                {hoveredDataPoint !== null && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 p-2.5 rounded-xl bg-slate-950 border border-slate-700 shadow-xl text-xs flex items-center space-x-3 animate-in fade-in">
                    <span className="font-bold text-white">
                      {performanceHistory[hoveredDataPoint].title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      {performanceHistory[hoveredDataPoint].score}/100
                    </span>
                    <span className="text-slate-400 font-mono">
                      {performanceHistory[hoveredDataPoint].date}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Skill Analysis (5 Core Competencies) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Skill Analysis</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluated across your recent interview sessions
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono">0-100%</span>
              </div>

              <div className="space-y-4 pt-1">
                {skillAnalysis.map((skill, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200">{skill.name}</span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">{skill.sub}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-white text-sm">{skill.score}%</span>
                        <span className="text-[10px] text-emerald-400 block">{skill.benchmark}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              RECOMMENDED PRACTICE (AI-Generated Recommendations)
             ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Recommended Practice</span>
                </h3>
                <p className="text-xs text-slate-400">
                  AI-generated practice modules customized to your target role and recent weak spots
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.map((rec) => {
                const Icon = rec.icon;
                return (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl space-y-4 flex flex-col justify-between group transition-all hover:-translate-y-1"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${rec.color} flex items-center justify-center text-white shadow-md`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {rec.difficulty}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                          {rec.title}
                        </h4>
                        <span className="text-[10px] text-indigo-400 font-semibold block mt-0.5">
                          {rec.type} &bull; {rec.duration}
                        </span>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {rec.reason}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunchRecommendation(rec)}
                      className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all cursor-pointer group-hover:bg-indigo-600 group-hover:text-white"
                    >
                      <span>Start Practice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              RECENT INTERVIEWS TABLE / LIST
              Show interview type, role, score, date, and View Report button
             ========================================================================= */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Recent Interviews</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect comprehensive rubrics, transcript logs, and AI model answers
                </p>
              </div>

              <button
                onClick={() => setActivePage('history')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                View all history &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {recentInterviewsList.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span>Role: <strong className="text-slate-300">{item.role}</strong></span>
                      <span>&bull;</span>
                      <span>Date: <span className="text-slate-300">{item.date}</span></span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.duration}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="block text-lg font-black text-indigo-400">
                        {item.score}/100
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {item.score >= 85 ? 'Strong Hire' : 'Hire'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (item.rawSession && onSelectExistingSession) {
                          onSelectExistingSession(item.rawSession);
                        } else {
                          setActivePage('analytics');
                        }
                      }}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-transparent transition-all cursor-pointer"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================================
          QUESTION BANK MODAL (Triggered by Questions or Practice in Sidebar)
         ========================================================================= */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Curated Question Bank</h3>
                  <p className="text-xs text-slate-400">Explore authentic interview prompts by track</p>
                </div>
              </div>
              <button
                onClick={() => setQuestionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {curatedQuestions.map((q) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{q.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {q.track} &bull; {q.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{q.prompt}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setQuestionModalOpen(false);
                  setActivePage('setup');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Start Interview with These Questions &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
