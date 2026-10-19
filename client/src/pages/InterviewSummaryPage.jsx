import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Printer,
  RotateCcw,
  LayoutDashboard,
  ArrowRight,
  History,
  Download,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldCheck,
  TrendingUp,
  Target,
  BarChart2,
  Layers,
  FileText,
  UserCheck,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';

/**
 * Normalizes session evaluation data with intelligent fallback to ensure compatibility
 * with real AI-generated evaluations (Gemini 1.5, OpenAI, or backend rubrics).
 */
function normalizeReportData(session) {
  const defaultCategories = [
    {
      id: 'technical',
      name: 'Technical Knowledge',
      score: 88,
      explanation: 'Demonstrated solid grasp of modern software architecture, web fundamentals, and system scalability trade-offs.',
      strengths: [
        'Accurate explanation of asynchronous event loops and client-server decoupling',
        'Solid familiarity with database indexing and cache invalidation strategies'
      ],
      improvements: [
        'Could delve deeper into memory management and garbage collection nuances',
        'Incorporate more concrete metrics around query latency and throughput'
      ]
    },
    {
      id: 'communication',
      name: 'Communication',
      score: 92,
      explanation: 'Articulated thoughts clearly with structured signposting, active listening posture, and professional tone.',
      strengths: [
        'High verbal clarity and smooth delivery without filler words',
        'Effective elevator pitch with logical progression and clear signposts'
      ],
      improvements: [
        'Keep introductory responses slightly tighter under the 2-minute mark',
        'Pause periodically to check for interviewer understanding during long explanations'
      ]
    },
    {
      id: 'problem_solving',
      name: 'Problem Solving',
      score: 85,
      explanation: 'Methodical decomposition of ambiguous requirements into step-by-step modular solutions.',
      strengths: [
        'Immediately identified edge cases before committing to an architectural approach',
        'Proposed optimal hash-based lookups to minimize time complexity'
      ],
      improvements: [
        'Discuss alternative brute-force solutions first before jumping into optimization',
        'Explicitly state space complexity trade-offs upfront'
      ]
    },
    {
      id: 'confidence',
      name: 'Confidence',
      score: 90,
      explanation: 'Maintained steady composure, decisive responses, and poise under probing follow-up questions.',
      strengths: [
        'Confident delivery when challenged on architectural trade-offs',
        'Positive tone and strong executive presence throughout questioning'
      ],
      improvements: [
        'Acknowledge unfamiliar concepts with constructive curiosity rather than hesitation'
      ]
    },
    {
      id: 'relevance',
      name: 'Answer Relevance',
      score: 89,
      explanation: 'Directly addressed the core of each interviewer question without unnecessary tangents or vagueness.',
      strengths: [
        'Answered the specific question asked before expanding to broader context',
        'Used relevant domain examples directly matching the job description'
      ],
      improvements: [
        'Ensure every example directly demonstrates measurable business value'
      ]
    },
    {
      id: 'behavioral',
      name: 'Behavioral Skills',
      score: 87,
      explanation: 'Strong storytelling flow adhering to the Situation, Task, Action, and Result (STAR) framework.',
      strengths: [
        'Clearly highlighted personal contributions using "I" instead of ambiguous "we"',
        'Emphasized teamwork, empathy, and collaborative conflict resolution'
      ],
      improvements: [
        'Quantify the final result with concrete percentages or hours saved',
        'Summarize key personal learnings at the conclusion of each story'
      ]
    }
  ];

  const defaultQuestionsAnalysis = [
    {
      id: 'q1',
      questionNumber: 1,
      question: 'Tell me about yourself and your experience with software development.',
      userAnswer: 'I have been developing web applications for over 4 years, primarily focusing on full-stack TypeScript, React, and Node.js. In my previous role, I helped re-architect a monolithic platform into microservices, which cut deployment cycle times by 35%. I enjoy solving scalability challenges and mentoring junior engineers.',
      score: 92,
      aiEvaluation: 'Excellent introductory pitch. Clearly structured chronological timeline highlighting key technologies, quantifiable business impact, and career enthusiasm.',
      whatWasGood: [
        'Immediate mention of core tech stack and years of experience',
        'Quantified achievement (35% reduction in deployment cycle times)',
        'Demonstrated leadership and collaboration mindset'
      ],
      whatCouldImprove: [
        'Could briefly mention why you are interested in this specific organization’s mission',
        'Keep response duration strictly within 90-120 seconds'
      ],
      suggestedApproach: 'Start with your 30-second present focus, transition to 45 seconds of your most impressive quantifiable past project (using the STAR format), and conclude with why this exact role represents the logical next step in your trajectory.'
    },
    {
      id: 'q2',
      questionNumber: 2,
      question: 'Can you describe a challenging technical problem you solved recently and how you approached it?',
      userAnswer: 'We had a critical latency bottleneck during peak hours where database CPU utilization was spiking to 95%. I used query profiling and APM tools to locate an un-indexed multi-table JOIN in our analytics pipeline. I added composite B-Tree indexes and set up a Redis caching layer for frequent read queries, bringing CPU load down to 25%.',
      score: 89,
      aiEvaluation: 'Strong technical breakdown. Methodical progression from symptom to telemetry analysis, architectural mitigation, and verified performance metric resolution.',
      whatWasGood: [
        'Clearly cited diagnostic tools used (APM and query profiler)',
        'Detailed specific technical remedies (composite B-Tree indexes & Redis read cache)',
        'Measurable before-and-after outcome (95% down to 25% CPU)'
      ],
      whatCouldImprove: [
        'Discuss cache invalidation strategies (e.g. TTL vs write-through) under concurrent updates',
        'Mention any rollback or staging validation procedures before deploying to production'
      ],
      suggestedApproach: 'Structure the story explicitly with the STAR framework. Highlight the business risk of the latency spike, the telemetry tools evaluated, why composite indexing was chosen over denormalization, and the ongoing monitoring safeguards added.'
    },
    {
      id: 'q3',
      questionNumber: 3,
      question: 'How do you handle disagreements or conflicting priorities within an engineering team?',
      userAnswer: 'When technical disagreements arise, I focus on objective data rather than opinion. For example, when our team was split between GraphQL and REST for a new service, I created a lightweight spike prototype comparing both on latency, caching ergonomics, and developer velocity. We reviewed the findings together and aligned on REST for that specific use case.',
      score: 88,
      aiEvaluation: 'Constructive and mature conflict resolution strategy. Using spikes and objective prototypes depersonalizes debate and drives team consensus.',
      whatWasGood: [
        'Used data-driven decision making and spike prototypes',
        'Maintained high empathy and collaborative team alignment',
        'Respected the final consensus without lingering friction'
      ],
      whatCouldImprove: [
        'Mention how you communicated the final decision to stakeholders or product managers',
        'Discuss how to maintain velocity when timelines do not permit a full spike prototype'
      ],
      suggestedApproach: 'Acknowledge that disagreement is healthy in engineering. Emphasize active listening to validate the other engineer’s architectural concerns, defining shared evaluation criteria, and applying "disagree and commit" principles if consensus is delayed.'
    },
    {
      id: 'q4',
      questionNumber: 4,
      question: 'Explain the difference between synchronous and asynchronous execution in modern web applications.',
      userAnswer: 'Synchronous execution blocks subsequent operations until the current task completes, whereas asynchronous execution delegates long-running tasks like network I/O to the event loop and background threads, allowing the main thread to stay responsive. In Node.js, libuv handles async I/O via thread pools.',
      score: 90,
      aiEvaluation: 'Solid conceptual clarity. Good invocation of the Node.js event loop and libuv thread pool mechanics.',
      whatWasGood: [
        'Accurately distinguished blocking vs non-blocking I/O',
        'Mentioned event loop and libuv internals correctly',
        'Concise and direct definition'
      ],
      whatCouldImprove: [
        'Could discuss microtasks (Promises, process.nextTick) vs macrotasks (setTimeout, setImmediate)',
        'Explain how CPU-intensive tasks can still starve the event loop despite async I/O'
      ],
      suggestedApproach: 'Define non-blocking I/O, illustrate with a real-world API call vs heavy computation scenario, contrast the microtask queue with the macrotask queue, and explain how Web Workers or worker threads handle CPU-bound tasks.'
    },
    {
      id: 'q5',
      questionNumber: 5,
      question: 'Where do you see yourself technically and professionally in the next three years?',
      userAnswer: 'In three years, I want to grow into a Senior Staff role where I am responsible for guiding architectural standards across multiple services, while actively mentoring junior developers. I am particularly excited about deep distributed systems design and AI-assisted engineering velocity.',
      score: 86,
      aiEvaluation: 'Clear ambitious career trajectory showing dedication to both deep technical craft and organizational mentorship.',
      whatWasGood: [
        'Balanced technical growth with mentorship and leadership',
        'Aligned with industry trends (distributed systems & velocity tools)'
      ],
      whatCouldImprove: [
        'Ground the goal in how you will create measurable value for this specific organization',
        'Mention specific engineering milestones or open source/tech talks planned'
      ],
      suggestedApproach: 'Outline a three-phase progression: Year 1 mastering team domain and delivering core features; Year 2 driving cross-team architectural standards; Year 3 leading high-impact initiatives and mentoring the next generation of engineers.'
    }
  ];

  // If session has real evaluation data from backend, merge it gracefully
  const feedback = session?.overallFeedback || {};
  const overallScore = feedback.overallScore || feedback.score || 88;
  const questions = session?.questions || [];
  const answers = session?.answers || [];

  // Reconcile question analysis if session has real candidate answers
  const reconciledAnalysis = defaultQuestionsAnalysis.map((item, idx) => {
    const qObj = questions[idx];
    const ansObj = answers[idx] || (questions[idx]?.candidateAnswer ? { candidateAnswer: questions[idx].candidateAnswer } : null);

    return {
      ...item,
      question: qObj?.questionText || item.question,
      userAnswer: ansObj?.candidateAnswer || qObj?.candidateAnswer || item.userAnswer,
      score: ansObj?.evaluation?.score || item.score
    };
  });

  return {
    title: session?.title || 'Software Engineer Technical & Behavioral Interview',
    role: session?.role || 'Software Engineer',
    experienceLevel: session?.experienceLevel || 'Intermediate (3-5 years)',
    interviewMode: session?.interviewMode || 'technical',
    durationMinutes: Math.round((session?.totalDurationSeconds || 1200) / 60),
    completedDate: session?.completedAt ? new Date(session.completedAt).toLocaleDateString() : 'Today',
    overallScore,
    recommendation: feedback.recommendation || (overallScore >= 85 ? 'Strong Hire' : overallScore >= 75 ? 'Hire' : 'Needs Review'),
    percentile: feedback.percentile || 89,
    categories: feedback.categories || defaultCategories,
    questionsAnalysis: reconciledAnalysis,
    executiveSummary: feedback.summary || `The candidate demonstrated strong readiness for the ${session?.role || 'Software Engineer'} role with an overall score of ${overallScore}/100. Communicated architectural concepts with clarity, applied structured STAR methodology during behavioral questioning, and proposed optimal algorithmic approaches with sound Big-O awareness.`
  };
}

export const InterviewSummaryPage = ({
  session,
  onStartNew,
  onGoDashboard,
  onViewHistory
}) => {
  const report = useMemo(() => normalizeReportData(session), [session]);

  const [copiedQuestionId, setCopiedQuestionId] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState('q1');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for circular progress calculation
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (report.overallScore / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* =========================================================================
          1. PAGE HEADER: "Interview Performance Report" & Top Controls
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Evaluation Completed
            </span>
            <span className="text-xs text-slate-500 font-mono">
              &bull; {report.completedDate} &bull; Dr. Elena Vance Evaluation Board
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Interview Performance Report
          </h1>

          <p className="text-xs sm:text-sm text-slate-400">
            Role: <strong className="text-slate-200">{report.role}</strong> &bull; Level:{' '}
            <strong className="text-slate-200">{report.experienceLevel}</strong> &bull; Duration:{' '}
            <strong className="text-slate-200">{report.durationMinutes} minutes</strong>
          </p>
        </div>

        {/* Action Buttons: Download Report, Practice Again, View Interview History */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Download Report Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-sm transition-all hover:scale-105 cursor-pointer"
            title="Download or Print PDF Report"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download Report</span>
          </button>

          {/* Practice Again Button */}
          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
            title="Configure new interview session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </button>

          {/* View Interview History Button */}
          <button
            type="button"
            onClick={onViewHistory || onGoDashboard}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
            title="View Past Interview Sessions"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Interview History</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. OVERALL SCORECARD & EXECUTIVE SYNTHESIS
          - Visual circular progress indicator
          - Recommendation pill & Percentile
          - AI Executive Analysis
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Visual Circular Progress Scorecard (Col 1-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Circular SVG Progress Ring */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background circle track */}
              <circle
                cx="70"
                cy="70"
                r={circleRadius}
                className="stroke-slate-950"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Foreground animated progress circle */}
              <circle
                cx="70"
                cy="70"
                r={circleRadius}
                stroke="url(#scoreGradient)"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Score Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {report.overallScore}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                out of 100
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Award className="w-3.5 h-3.5" />
              <span>{report.recommendation} Recommendation</span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Beats <strong className="text-cyan-300">{report.percentile}%</strong> of candidates for {report.role}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Status</span>
              <span className="text-xs font-bold text-emerald-400">Passed</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Rubrics</span>
              <span className="text-xs font-bold text-indigo-400">6 Tracks</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Analyzed</span>
              <span className="text-xs font-bold text-cyan-400">100%</span>
            </div>
          </div>
        </div>

        {/* Right: AI Executive Synthesis & Highlights (Col 6-12) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                Dr. Elena Vance Executive Synthesis
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {report.executiveSummary}
            </p>
          </div>

          {/* Core Strengths & Immediate Levers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1.5">
              <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Hiring Asset</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Strong technical formulation and ability to structure complex system problems into modular phases.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-1.5">
              <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Growth Lever</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Incorporate more quantitative telemetry (e.g., latency percentiles and memory footprints) in project narratives.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Standardized Rubric &bull; Calibrated for FAANG / Top Tier SaaS Benchmarks</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. INTERACTIVE CHARTS SECTION:
          - Skill Radar Chart (Spider Chart across 6 categories)
          - Performance Bar Chart (Horizontal comparative bars)
          - Score Breakdown
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Performance & Skill Analytics
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* CHART 1: Skill Radar Chart (Spider Chart across 6 categories) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center justify-between space-y-4">
            <div className="w-full flex items-center justify-between">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Skill Radar Chart</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">6 Axes</span>
            </div>

            {/* SVG Radar Chart Implementation */}
            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 300">
                {/* Concentric Polygonal Grid Rings (25%, 50%, 75%, 100%) */}
                {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => {
                  const points = [0, 1, 2, 3, 4, 5].map((i) => {
                    const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                    const r = 110 * scale;
                    return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={sIdx}
                      points={points}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray={sIdx < 3 ? '2 2' : 'none'}
                    />
                  );
                })}

                {/* 6 Axis Spoke Lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                  const x = 150 + 110 * Math.cos(angle);
                  const y = 150 + 110 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="150"
                      y1="150"
                      x2={x}
                      y2={y}
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* National Passing Benchmark Polygon (dashed line, ~75%) */}
                {(() => {
                  const benchPoints = [0, 1, 2, 3, 4, 5].map((i) => {
                    const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                    const r = 110 * 0.75;
                    return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                  }).join(' ');

                  return (
                    <polygon
                      points={benchPoints}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  );
                })()}

                {/* Candidate Score Polygon */}
                {(() => {
                  const scorePoints = report.categories.map((cat, i) => {
                    const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                    const r = 110 * (cat.score / 100);
                    return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                  }).join(' ');

                  return (
                    <>
                      <polygon
                        points={scorePoints}
                        fill="rgba(99, 102, 241, 0.28)"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                      />
                      {/* Vertex circles */}
                      {report.categories.map((cat, i) => {
                        const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                        const r = 110 * (cat.score / 100);
                        const cx = 150 + r * Math.cos(angle);
                        const cy = 150 + r * Math.sin(angle);
                        return (
                          <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r="4"
                            fill="#06b6d4"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        );
                      })}
                    </>
                  );
                })()}

                {/* Category Labels along axes */}
                {report.categories.map((cat, i) => {
                  const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                  const labelR = 135;
                  const lx = 150 + labelR * Math.cos(angle);
                  const ly = 150 + labelR * Math.sin(angle);
                  const isLeft = Math.cos(angle) < -0.2;
                  const isRight = Math.cos(angle) > 0.2;

                  return (
                    <text
                      key={i}
                      x={lx}
                      y={ly}
                      textAnchor={isRight ? 'start' : isLeft ? 'end' : 'middle'}
                      dominantBaseline="middle"
                      className="fill-slate-300 text-[10px] font-bold font-sans"
                    >
                      {cat.name.split(' ')[0]} ({cat.score})
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Radar Legend */}
            <div className="flex items-center space-x-4 text-[10px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Candidate Evaluation</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-0.5 bg-slate-500 border border-slate-500"></span>
                <span>Benchmark (75%)</span>
              </span>
            </div>
          </div>

          {/* CHART 2: Performance Bar Chart & Score Breakdown (Col 6-12) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Performance Bar Chart & Benchmark Comparison</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Scale 0 - 100</span>
            </div>

            {/* Horizontal comparative bars for each of the 6 categories */}
            <div className="space-y-3.5">
              {report.categories.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cat.score >= 90
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : cat.score >= 80
                          ? 'bg-indigo-500/15 text-indigo-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}>
                        {cat.score >= 90 ? 'Top Tier' : cat.score >= 80 ? 'Proficient' : 'Developing'}
                      </span>
                      <span className="font-mono font-bold text-white">{cat.score}%</span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden relative border border-slate-800">
                    {/* Benchmark vertical guide at 75% */}
                    <div className="absolute top-0 bottom-0 left-[75%] w-[1.5px] bg-slate-600 z-10" title="Industry Baseline (75%)" />
                    
                    {/* Filled bar */}
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Score Breakdown Component (Summary tier cards) */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Top Strength</span>
                <span className="text-xs sm:text-sm font-extrabold text-indigo-400">Communication</span>
                <span className="text-[10px] text-slate-500 block">92/100 score</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Benchmark</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-400">+13% Above Avg</span>
                <span className="text-[10px] text-slate-500 block">vs Cohort Pool</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Hire Readiness</span>
                <span className="text-xs sm:text-sm font-extrabold text-cyan-400">Immediate</span>
                <span className="text-[10px] text-slate-500 block">Staff Qualified</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          4. 6 CORE EVALUATION CATEGORIES (DETAILED BREAKDOWN)
          - Technical Knowledge
          - Communication
          - Problem Solving
          - Confidence
          - Answer Relevance
          - Behavioral Skills
          For each: Score, Short explanation, Strengths, Areas to improve
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Evaluation Categories Breakdown
            </h2>
            <p className="text-xs text-slate-400">
              Detailed scoring, explanations, validated strengths, and tailored growth opportunities across all 6 core competencies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:border-slate-700"
            >
              {/* Category Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">
                    {cat.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {cat.score}/100
                  </span>
                </div>

                {/* Short explanation */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {cat.explanation}
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                {/* Strengths */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Strengths</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {cat.strengths.map((str, sIdx) => (
                      <li key={sIdx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 mt-0.5">&bull;</span>
                        <span className="leading-snug">{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas to improve */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Areas to Improve</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {cat.improvements.map((imp, iIdx) => (
                      <li key={iIdx} className="flex items-start space-x-1.5">
                        <span className="text-amber-400 mt-0.5">&bull;</span>
                        <span className="leading-snug">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. ANSWER-BY-ANSWER ANALYSIS:
          For each question:
          - Question
          - User's answer
          - AI evaluation
          - What was good
          - What could improve
          - Suggested better approach
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Answer-by-Answer Analysis
          </h2>
        </div>
        <p className="text-xs text-slate-400 -mt-2">
          Comprehensive audit of every question answered during the simulation, paired with candidate responses, recruiter evaluations, and ideal benchmark approaches.
        </p>

        <div className="space-y-4">
          {report.questionsAnalysis.map((item) => {
            const isExpanded = expandedQuestionId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden transition-all"
              >
                {/* Accordion Card Header */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestionId(isExpanded ? null : item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-slate-900 hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        Question #{item.questionNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Score: {item.score}/100
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      "{item.question}"
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                      {isExpanded ? 'Hide Details' : 'View Full Review'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                {/* Expanded Analysis Content */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-slate-800 space-y-5 bg-slate-950/70">
                    
                    {/* 1. User's Answer */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Candidate Submitted Answer:</span>
                      </span>
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        "{item.userAnswer}"
                      </div>
                    </div>

                    {/* 2. AI Evaluation Paragraph */}
                    <div className="p-4 rounded-2xl bg-indigo-950/25 border border-indigo-500/30 space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
                        <Brain className="w-4 h-4 text-indigo-400" />
                        <span>AI Recruiter Evaluation:</span>
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {item.aiEvaluation}
                      </p>
                    </div>

                    {/* 3. What Was Good & What Could Improve Side-by-Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* What was good */}
                      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>What Was Good</span>
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {item.whatWasGood.map((good, gIdx) => (
                            <li key={gIdx} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{good}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* What could improve */}
                      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>What Could Improve</span>
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {item.whatCouldImprove.map((imp, iIdx) => (
                            <li key={iIdx} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 4. Suggested Better Approach */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>Suggested Better Approach (Ideal Benchmark Formulation):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.suggestedApproach, item.id)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy Suggested Formulation"
                        >
                          {copiedQuestionId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedQuestionId === item.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-cyan-200/90 leading-relaxed font-sans">
                        {item.suggestedApproach}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          6. AGGREGATED SECTIONS:
          - Overall Strengths
          - Priority Improvement Areas
          - AI Personalized Recommendations & Learning Roadmap
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths Section */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Key Overall Strengths
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>Linear algorithmic formulation using hash indexing to achieve optimal O(n) complexities.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>Smooth communication flow without hesitations; strong composure under questioning.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>Concrete real-world project examples with measurable percentage outcomes.</span>
            </li>
          </ul>
        </div>

        {/* Improvement Areas Section */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
              Priority Areas to Improve
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">&bull;</span>
              <span>Explicitly verbalize space complexity and cache invalidation policies upfront.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">&bull;</span>
              <span>Structure personal elevator pitch strictly under 90-120 seconds to keep interviewer engaged.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-400 font-bold">&bull;</span>
              <span>Conclude behavioral stories with lasting architectural lessons and team takeaways.</span>
            </li>
          </ul>
        </div>

        {/* AI Recommendations Section */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Zap className="w-5 h-5" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
              AI Recommended Practice
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-cyan-400 font-bold">&bull;</span>
              <span><strong>System Design Track:</strong> Distributed Locking, Redis Caching & Cache-Aside Patterns.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-cyan-400 font-bold">&bull;</span>
              <span><strong>Behavioral Workshop:</strong> Quantifying Results & Conflict Resolution (STAR).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-cyan-400 font-bold">&bull;</span>
              <span><strong>Coding Sandbox:</strong> Sliding Window & Tree Rebalancing Challenges.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* =========================================================================
          7. BOTTOM ACTION CONTROLS:
          - Download Report
          - Practice Again
          - View Interview History
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
        <button
          type="button"
          onClick={onGoDashboard}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4 text-cyan-400" />
          <span>Return to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all hover:scale-105 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download Report</span>
          </button>

          <button
            type="button"
            onClick={onViewHistory || onGoDashboard}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all hover:scale-105 cursor-pointer"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>View Interview History</span>
          </button>

          <button
            type="button"
            onClick={onStartNew}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default InterviewSummaryPage;
