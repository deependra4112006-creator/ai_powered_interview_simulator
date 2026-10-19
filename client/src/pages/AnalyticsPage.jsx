import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart2,
  TrendingUp,
  Award,
  Cpu,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Loader2,
  Sparkles,
  Clock,
  Target,
  Zap,
  Code,
  Layers,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Play,
  ChevronRight,
  ShieldCheck,
  Flame,
  Info
} from 'lucide-react';

export const AnalyticsPage = ({ onStartNew }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30d'); // '7d' | '30d' | 'all'
  const [activeTooltip, setActiveTooltip] = useState(null); // for interactive chart tooltips
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('all');

  // Baseline mock data structure, completely ready for real database integration
  const initialAnalyticsData = {
    overview: {
      overallPerformance: 86,
      averageScore: 82,
      bestScore: 96,
      totalInterviews: 24,
      completedInterviews: 18,
      totalPracticeMinutes: 1005,
      totalPracticeFormatted: '16h 45m',
      percentile: 92,
      statusTier: 'Strong Hire Candidate',
      weeklyStreakDays: 5
    },
    aiInsights: {
      improvingIn: {
        skill: 'System Design & Distributed Scalability',
        delta: '+16%',
        description:
          'Your scores have climbed from 68% to 84% over your last 5 sessions. Your explanations of caching layers (Redis/CDN), database sharding, and latency vs throughput trade-offs now follow clear industry blueprints.'
      },
      focusMoreOn: {
        skill: 'DSA: Dynamic Programming & Space Complexity',
        delta: '-8% under pressure',
        description:
          'During timed algorithmic challenges, problem exploration averages 4.8 minutes before code initiation, and space complexity guarantees are occasionally omitted. Practice stating the Big-O invariant early before writing code.'
      },
      strongestSkill: {
        skill: 'Communication & Behavioral Fluency',
        score: 92,
        description:
          'You consistently structure answers using the STAR methodology (Situation, Task, Action, Result), clearly attribute individual impact with metrics, and maintain executive composure under probing follow-ups.'
      }
    },
    skillBreakdown: [
      {
        id: 'technical',
        name: 'Technical',
        score: 86,
        benchmark: 80,
        trend: '+7%',
        tier: 'Advanced',
        description: 'Core computer science fundamentals, backend ecosystems, memory lifecycles, and runtime execution.',
        icon: 'Cpu',
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-indigo-400'
      },
      {
        id: 'dsa',
        name: 'DSA',
        score: 79,
        benchmark: 80,
        trend: '+4%',
        tier: 'Proficient',
        description: 'Algorithms, data structures, trees, dynamic programming, and Big-O computational complexity.',
        icon: 'Code',
        color: 'from-cyan-500 to-blue-600',
        textColor: 'text-cyan-400'
      },
      {
        id: 'communication',
        name: 'Communication',
        score: 92,
        benchmark: 85,
        trend: '+9%',
        tier: 'Expert',
        description: 'Verbal clarity, concise articulation, executive presence, and STAR framework adherence.',
        icon: 'MessageSquare',
        color: 'from-purple-500 to-pink-600',
        textColor: 'text-purple-400'
      },
      {
        id: 'problemSolving',
        name: 'Problem Solving',
        score: 84,
        benchmark: 80,
        trend: '+6%',
        tier: 'Advanced',
        description: 'Deconstructing ambiguous scenarios, rigorous edge-case analysis, and systematic debugging.',
        icon: 'Zap',
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-400'
      },
      {
        id: 'systemDesign',
        name: 'System Design',
        score: 81,
        benchmark: 75,
        trend: '+14%',
        tier: 'Proficient',
        description: 'High-level architectures, microservices, scalability, caching, and database partitioning.',
        icon: 'Layers',
        color: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-400'
      },
      {
        id: 'behavioral',
        name: 'Behavioral',
        score: 89,
        benchmark: 80,
        trend: '+8%',
        tier: 'Expert',
        description: 'Leadership principles, conflict resolution, ownership, empathy, and stakeholder collaboration.',
        icon: 'Users',
        color: 'from-rose-500 to-red-600',
        textColor: 'text-rose-400'
      }
    ],
    charts: {
      scoreProgression: [
        { sessionNumber: 1, title: 'Full Stack Screen', date: 'Sep 18', score: 68 },
        { sessionNumber: 2, title: 'Frontend Core', date: 'Sep 22', score: 72 },
        { sessionNumber: 3, title: 'DSA & Algorithms', date: 'Sep 27', score: 76 },
        { sessionNumber: 4, title: 'System Architecture', date: 'Oct 01', score: 79 },
        { sessionNumber: 5, title: 'Behavioral Round', date: 'Oct 05', score: 86 },
        { sessionNumber: 6, title: 'Coding Challenge', date: 'Oct 08', score: 82 },
        { sessionNumber: 7, title: 'Distributed Systems', date: 'Oct 10', score: 88 },
        { sessionNumber: 8, title: 'Mock Technical', date: 'Oct 12', score: 94 }
      ],
      technicalSkills: [
        { name: 'Data Structures', score: 82, benchmark: 78, category: 'DSA' },
        { name: 'Algorithms & DP', score: 76, benchmark: 78, category: 'DSA' },
        { name: 'System Architecture', score: 85, benchmark: 75, category: 'Design' },
        { name: 'Databases & SQL', score: 88, benchmark: 80, category: 'Storage' },
        { name: 'REST & gRPC APIs', score: 91, benchmark: 82, category: 'Networking' },
        { name: 'Concurrency & Async', score: 78, benchmark: 74, category: 'Core' }
      ],
      communicationPerformance: [
        { metric: 'Clarity & Articulation', score: 90, benchmark: 82, note: 'Clear pace, no filler words' },
        { metric: 'STAR Framework Compliance', score: 88, benchmark: 80, note: 'Strong Situation/Task/Action/Result flow' },
        { metric: 'Conciseness & Pacing', score: 82, benchmark: 78, note: 'Answers average 90-120 seconds' },
        { metric: 'Technical Vocabulary', score: 92, benchmark: 85, note: 'Precise engineering terminology' },
        { metric: 'Confidence & Composure', score: 94, benchmark: 85, note: 'Poise maintained under follow-up probes' },
        { metric: 'Relevance to Question', score: 89, benchmark: 82, note: 'Direct answers without drifting' }
      ],
      interviewTypePerformance: [
        { type: 'Technical', avgScore: 85, completedCount: 8, passRate: 88 },
        { type: 'Coding / DSA', avgScore: 80, completedCount: 6, passRate: 83 },
        { type: 'Behavioral', avgScore: 91, completedCount: 5, passRate: 100 },
        { type: 'HR Screening', avgScore: 94, completedCount: 3, passRate: 100 },
        { type: 'System Design', avgScore: 81, completedCount: 2, passRate: 75 }
      ],
      weeklyPracticeActivity: [
        { day: 'Mon', shortDate: 'Oct 07', minutes: 45, sessions: 1 },
        { day: 'Tue', shortDate: 'Oct 08', minutes: 60, sessions: 2 },
        { day: 'Wed', shortDate: 'Oct 09', minutes: 90, sessions: 2 },
        { day: 'Thu', shortDate: 'Oct 10', minutes: 30, sessions: 1 },
        { day: 'Fri', shortDate: 'Oct 11', minutes: 120, sessions: 3 },
        { day: 'Sat', shortDate: 'Oct 12', minutes: 75, sessions: 2 },
        { day: 'Sun', shortDate: 'Oct 13', minutes: 60, sessions: 1 }
      ]
    }
  };

  const [analyticsData, setAnalyticsData] = useState(initialAnalyticsData);

  // Normalize data from the API while seamlessly preserving full analytics structure
  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const res = await api.analytics.getUserAnalytics();
      if (res && res.success && res.analytics) {
        const serverData = res.analytics;
        setAnalyticsData((prev) => ({
          overview: {
            ...prev.overview,
            ...(serverData.overview || {}),
            averageScore: serverData.overview?.averageScore ?? serverData.averageScore ?? prev.overview.averageScore,
            totalInterviews: serverData.overview?.totalInterviews ?? serverData.totalInterviews ?? prev.overview.totalInterviews,
            completedInterviews: serverData.overview?.completedInterviews ?? serverData.completedInterviews ?? prev.overview.completedInterviews,
            totalPracticeMinutes: serverData.overview?.totalPracticeMinutes ?? serverData.totalPracticeMinutes ?? prev.overview.totalPracticeMinutes
          },
          aiInsights: {
            ...prev.aiInsights,
            ...(serverData.aiInsights || {})
          },
          skillBreakdown: serverData.skillBreakdown && serverData.skillBreakdown.length > 0
            ? serverData.skillBreakdown.map((item, idx) => ({
                ...prev.skillBreakdown[idx % prev.skillBreakdown.length],
                ...item
              }))
            : prev.skillBreakdown,
          charts: {
            scoreProgression: serverData.charts?.scoreProgression && serverData.charts.scoreProgression.length > 0
              ? serverData.charts.scoreProgression
              : prev.charts.scoreProgression,
            technicalSkills: serverData.charts?.technicalSkills || prev.charts.technicalSkills,
            communicationPerformance: serverData.charts?.communicationPerformance || prev.charts.communicationPerformance,
            interviewTypePerformance: serverData.charts?.interviewTypePerformance || prev.charts.interviewTypePerformance,
            weeklyPracticeActivity: serverData.charts?.weeklyPracticeActivity || prev.charts.weeklyPracticeActivity
          }
        }));
      }
    } catch (err) {
      console.warn('Using baseline analytics mock data due to API notice:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Helper icons mapper for skills
  const renderSkillIcon = (iconName, className) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Code':
        return <Code className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Users':
      default:
        return <Users className={className} />;
    }
  };

  const { overview, aiInsights, skillBreakdown, charts } = analyticsData;

  // Filter skills if user clicks a filter
  const displayedSkills = selectedSkillFilter === 'all'
    ? skillBreakdown
    : skillBreakdown.filter((s) => s.id === selectedSkillFilter);

  // SVG parameters for the Score Progression Area/Line Chart
  const progressionData = charts.scoreProgression;
  const chartWidth = 720;
  const chartHeight = 260;
  const padX = 50;
  const padY = 35;
  const minScore = 50;
  const maxScore = 100;

  const getCoordinates = (index, score) => {
    const x = padX + (index / (Math.max(1, progressionData.length - 1))) * (chartWidth - padX * 2);
    const y = chartHeight - padY - ((score - minScore) / (maxScore - minScore)) * (chartHeight - padY * 2);
    return { x, y };
  };

  const points = progressionData.map((d, i) => getCoordinates(i, d.score));
  const linePath = points.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padY} L ${points[0].x} ${chartHeight - padY} Z`
    : '';

  // Calculate benchmark line Y (at 80%)
  const benchmarkY = chartHeight - padY - ((80 - minScore) / (maxScore - minScore)) * (chartHeight - padY * 2);

  // Weekly Practice Totals
  const weeklyTotalMins = charts.weeklyPracticeActivity.reduce((acc, d) => acc + d.minutes, 0);
  const weeklyAvgMins = Math.round(weeklyTotalMins / charts.weeklyPracticeActivity.length);
  const maxWeeklyMin = Math.max(...charts.weeklyPracticeActivity.map((d) => d.minutes), 60);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Sparkles className="w-5 h-5 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white">Aggregating Talent Intelligence</p>
          <p className="text-xs text-slate-400 mt-1">Calculating your multi-dimensional interview analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* =========================================================================
          1. HEADER & CONTROLS
          - Title: "Your Interview Analytics"
          - Subtitle & meta tags
          - Timeframe filters & Quick Actions
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>AI Talent Intelligence & Skill Radar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Your Interview Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Track multi-session progress, pinpoint interview weaknesses, and calibrate your hiring readiness across all 6 key dimensions.
          </p>
        </div>

        {/* Timeframe & Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Time range pills */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All Time' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Export / Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Download or Print PDF Report"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export</span>
          </button>

          {/* Start New Interview Button */}
          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Interview</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. FIVE OVERVIEW STATS CARDS
          - Overall performance
          - Average score
          - Best score
          - Total interviews
          - Total practice time
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Overall Performance */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Overall Performance</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{overview.overallPerformance}%</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +5.4%
            </span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              {overview.statusTier}
            </span>
            <span className="text-[11px] text-slate-400">Top {100 - overview.percentile}%</span>
          </div>
        </div>

        {/* 2. Average Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{overview.averageScore}%</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +3.8%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 truncate">
            Across {overview.completedInterviews} completed rounds
          </p>
        </div>

        {/* 3. Best Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best Score</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400">{overview.bestScore}%</span>
            <span className="text-xs font-semibold text-slate-400">Personal Best</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 truncate">
            Senior System Design mock
          </p>
        </div>

        {/* 4. Total Interviews */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Interviews</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{overview.totalInterviews}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +{overview.completedInterviews} done
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 truncate">
            {overview.completedInterviews} evaluated • {overview.totalInterviews - overview.completedInterviews} in progress
          </p>
        </div>

        {/* 5. Total Practice Time */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Practice Time</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white">{overview.totalPracticeFormatted}</span>
            <span className="text-xs font-bold text-amber-400 flex items-center">
              <Flame className="w-3.5 h-3.5 mr-0.5" />
              {overview.weeklyStreakDays}d streak
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 truncate">
            {overview.totalPracticeMinutes} minutes in AI simulator
          </p>
        </div>
      </div>

      {/* =========================================================================
          3. AI-GENERATED INSIGHTS
          - "You are improving consistently in..."
          - "Focus more on..."
          - "Your strongest skill is..."
         ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-indigo-400">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">AI-Generated Intelligence Insights</h2>
              <p className="text-xs text-slate-400">Synthesized by the evaluator engine based on your real answer patterns.</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold">
            Updated Today
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. You are improving consistently in... */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 shadow-lg space-y-2.5 relative group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Improving Consistently</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-extrabold">
                {aiInsights.improvingIn.delta}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              You are improving consistently in <span className="text-emerald-300">{aiInsights.improvingIn.skill}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {aiInsights.improvingIn.description}
            </p>
          </div>

          {/* 2. Focus more on... */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-lg space-y-2.5 relative group hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Priority Growth Area</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-extrabold">
                {aiInsights.focusMoreOn.delta}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Focus more on <span className="text-amber-300">{aiInsights.focusMoreOn.skill}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {aiInsights.focusMoreOn.description}
            </p>
          </div>

          {/* 3. Your strongest skill is... */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 shadow-lg space-y-2.5 relative group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Top Superpower</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[11px] font-extrabold">
                {aiInsights.strongestSkill.score}% Score
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Your strongest skill is <span className="text-indigo-300">{aiInsights.strongestSkill.skill}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {aiInsights.strongestSkill.description}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. CHARTS SECTION (5 INTERACTIVE CHARTS)
          Chart 1: Score progression
          Chart 2: Technical skill performance
          Chart 3: Communication performance
          Chart 4: Interview type performance
          Chart 5: Weekly practice activity
         ========================================================================= */}

      {/* ROW 1: Chart 1 (Score Progression) & Chart 5 (Weekly Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Score Progression (Col 1-8) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">1. Score Progression</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluation trajectory across your recent sessions vs target hiring threshold (80%).
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400 shrink-0">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-1 rounded-full bg-indigo-500 inline-block" />
                <span>Your Score</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-1 border-t border-dashed border-cyan-400 inline-block" />
                <span>Benchmark (80%)</span>
              </div>
            </div>
          </div>

          {/* SVG Score Progression Chart */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-950/80 rounded-2xl border border-slate-800/80 p-2 sm:p-4 overflow-hidden">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="progressionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Grid lines */}
              {[60, 70, 80, 90, 100].map((scoreLevel) => {
                const yPos = chartHeight - padY - ((scoreLevel - minScore) / (maxScore - minScore)) * (chartHeight - padY * 2);
                return (
                  <g key={scoreLevel}>
                    <line
                      x1={padX}
                      y1={yPos}
                      x2={chartWidth - padX}
                      y2={yPos}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={padX - 8}
                      y={yPos + 4}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="end"
                      fontWeight="500"
                    >
                      {scoreLevel}%
                    </text>
                  </g>
                );
              })}

              {/* Benchmark Reference Line (80%) */}
              <line
                x1={padX}
                y1={benchmarkY}
                x2={chartWidth - padX}
                y2={benchmarkY}
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={chartWidth - padX - 4}
                y={benchmarkY - 6}
                fill="#06b6d4"
                fontSize="9"
                textAnchor="end"
                fontWeight="700"
              >
                TARGET HIRE (80%)
              </text>

              {/* Area under curve */}
              {areaPath && (
                <path d={areaPath} fill="url(#progressionGradient)" />
              )}

              {/* Main Curve Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
              )}

              {/* Interactive Data points */}
              {points.map((pt, idx) => {
                const item = progressionData[idx];
                const isHovered = activeTooltip?.type === 'progression' && activeTooltip?.index === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() =>
                      setActiveTooltip({
                        type: 'progression',
                        index: idx,
                        title: item.title,
                        score: item.score,
                        date: item.date
                      })
                    }
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 4.5}
                      fill={isHovered ? '#38bdf8' : '#ffffff'}
                      stroke="#6366f1"
                      strokeWidth={isHovered ? 3.5 : 2.5}
                    />
                    {/* X-axis labels */}
                    <text
                      x={pt.x}
                      y={chartHeight - 10}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {item.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {activeTooltip?.type === 'progression' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/50 shadow-2xl text-xs flex items-center space-x-3 pointer-events-none z-10">
                <span className="font-bold text-white">{activeTooltip.title}</span>
                <span className="text-slate-400">({activeTooltip.date})</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-extrabold">
                  {activeTooltip.score}% Score
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 5: Weekly Practice Activity (Col 9-12) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">5. Weekly Practice Activity</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <Flame className="w-3.5 h-3.5 mr-0.5" />
                5d Streak
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Minutes dedicated to AI mock sessions this week.
            </p>
          </div>

          {/* Weekly Activity Bars */}
          <div className="space-y-2 pt-2">
            <div className="h-44 flex items-end justify-between gap-2 px-1">
              {charts.weeklyPracticeActivity.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(12, (item.minutes / maxWeeklyMin) * 100));
                const isHovered = activeTooltip?.type === 'weekly' && activeTooltip?.index === idx;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                    onMouseEnter={() =>
                      setActiveTooltip({
                        type: 'weekly',
                        index: idx,
                        day: item.day,
                        minutes: item.minutes,
                        sessions: item.sessions
                      })
                    }
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    {/* Tooltip text above bar */}
                    <span
                      className={`text-[10px] font-bold text-emerald-300 transition-opacity ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {item.minutes}m
                    </span>

                    {/* The bar */}
                    <div className="w-full max-w-[28px] h-32 bg-slate-950 rounded-xl overflow-hidden flex items-end p-0.5 border border-slate-800">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ${
                          isHovered
                            ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                            : 'bg-gradient-to-t from-indigo-600 to-emerald-400 group-hover:from-indigo-500 group-hover:to-cyan-300'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Weekly activity summary footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total this week</span>
              <span className="font-extrabold text-white">{weeklyTotalMins} mins ({weeklyAvgMins}m / day)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Chart 2 (Technical Skill Performance) & Chart 3 (Communication Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 2: Technical Skill Performance */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">2. Technical Skill Performance</h3>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" />
                <span>You</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 inline-block" />
                <span>Target</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Performance breakdown across core architectural domains vs industry senior benchmark.
          </p>

          <div className="space-y-4">
            {charts.technicalSkills.map((tech, idx) => {
              const delta = tech.score - tech.benchmark;
              const isPositive = delta >= 0;

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-200">{tech.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {tech.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{tech.score}%</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {isPositive ? `+${delta}%` : `${delta}%`}
                      </span>
                    </div>
                  </div>

                  {/* Dual comparative bar */}
                  <div className="relative w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    {/* User bar */}
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-700"
                      style={{ width: `${tech.score}%` }}
                    />
                    {/* Target benchmark pin */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white/70 shadow-sm"
                      style={{ left: `${tech.benchmark}%` }}
                      title={`Target Benchmark: ${tech.benchmark}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Communication Performance */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">3. Communication Performance</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
              92% Avg Fluency
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Articulation, conciseness, confidence, and STAR method compliance evaluated on verbal & written output.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {charts.communicationPerformance.map((comm, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 truncate pr-2">{comm.metric}</span>
                  <span className="text-xs font-black text-purple-400">{comm.score}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${comm.score}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-400 truncate">{comm.note}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 flex items-start space-x-2.5">
            <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-white">Communication Tip:</strong> Your STAR stories have high impact. To reach 95%+, conclude your stories with quantifiable business revenue or efficiency metrics.
            </span>
          </div>
        </div>
      </div>

      {/* ROW 3: Chart 4 (Interview Type Performance) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">4. Interview Type Performance</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative average score and pass rate across all 5 interview formats.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-1.5 rounded-full bg-indigo-500 inline-block" />
              <span>Average Score</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>Pass Rate</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {charts.interviewTypePerformance.map((typeItem, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{typeItem.type}</span>
                <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {typeItem.completedCount} rounds
                </span>
              </div>

              {/* Score bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Avg Score</span>
                  <span className="font-extrabold text-indigo-400">{typeItem.avgScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                    style={{ width: `${typeItem.avgScore}%` }}
                  />
                </div>
              </div>

              {/* Pass rate bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Pass Rate</span>
                  <span className="font-extrabold text-emerald-400">{typeItem.passRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${typeItem.passRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. SKILL BREAKDOWN (6 SPECIFIC SKILLS)
          - Technical
          - DSA
          - Communication
          - Problem Solving
          - System Design
          - Behavioral
         ========================================================================= */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">Comprehensive Skill Breakdown</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Granular mastery evaluation across all 6 core pillars required for top-tier tech offers.
            </p>
          </div>

          {/* Quick Skill Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            <button
              type="button"
              onClick={() => setSelectedSkillFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedSkillFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All (6)
            </button>
            {skillBreakdown.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSkillFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedSkillFilter === s.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedSkills.map((skill) => {
            const deltaScore = skill.score - skill.benchmark;
            const isAhead = deltaScore >= 0;

            return (
              <div
                key={skill.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Header with Icon, Name, and Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${skill.textColor}`}>
                        {renderSkillIcon(skill.icon, 'w-5 h-5')}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {skill.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {skill.tier} Tier
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-white block">{skill.score}%</span>
                      <span className="text-[10px] font-bold text-emerald-400">{skill.trend}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                    {skill.description}
                  </p>
                </div>

                {/* Progress bar & Benchmark comparison */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Bench: {skill.benchmark}%</span>
                    <span
                      className={`font-extrabold ${
                        isAhead ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isAhead ? `+${deltaScore}% vs Benchmark` : `${deltaScore}% vs Benchmark`}
                    </span>
                  </div>

                  <div className="relative w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-700`}
                      style={{ width: `${skill.score}%` }}
                    />
                    {/* Benchmark marker line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/80"
                      style={{ left: `${skill.benchmark}%` }}
                      title={`Target Benchmark: ${skill.benchmark}%`}
                    />
                  </div>

                  {/* Action button to practice this specific skill */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onStartNew}
                      className="w-full py-2 rounded-xl bg-slate-950 hover:bg-indigo-600/20 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>Practice {skill.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          6. BOTTOM CALL-TO-ACTION BANNER
         ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Ready to boost your interview readiness score?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our AI interviewer adapts dynamically in real-time, helping you eliminate weaknesses before your actual on-site rounds.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNew}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer shrink-0"
        >
          Start New Practice Interview
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;
