import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Mic,
  Code,
  Award,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart2,
  Users,
  ShieldCheck,
  Zap,
  Play,
  Volume2,
  VolumeX,
  Terminal,
  Check,
  ChevronRight,
  Star,
  Clock,
  Target,
  Layers,
  Brain,
  MessageSquare,
  Activity,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Compass
} from 'lucide-react';

export const LandingPage = ({ setActivePage, onStartSessionWithConfig }) => {
  const { guestLogin, isAuthenticated } = useAuth();

  // Hero interactive visual state
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [activeFeedbackPillar, setActiveFeedbackPillar] = useState('all');
  const [selectedReportCandidate, setSelectedReportCandidate] = useState(0);
  const [pricingCycle, setPricingCycle] = useState('annual'); // 'monthly' | 'annual'

  // Hero interactive demo scenarios
  const demoScenarios = [
    {
      id: 'system-design',
      title: '1. Architecture & API',
      role: 'Senior Full-Stack Engineer',
      round: 'Technical Architecture',
      question:
        'Could you explain how you would design an idempotent payment processing API to guarantee requests aren’t double-charged during transient network retries?',
      candidateAnswer:
        'I would mandate a client-supplied Idempotency-Key header, store it in Redis with an atomic SETNX lock and a 2-minute TTL, and verify the transaction state in Postgres inside a row-level locked transaction before contacting Stripe.',
      score: '94/100',
      badge: 'Strong Hire',
      strengths: ['Identified Idempotency Keys', 'Distributed Redis Locks', 'Row-level DB Isolation'],
    },
    {
      id: 'frontend',
      title: '2. Frontend React Internals',
      role: 'Lead Frontend Engineer',
      round: 'Core Architecture',
      question:
        'How does the React Fiber reconciliation algorithm work when rendering dynamic lists, and why can using an array index as a key corrupt local component state?',
      candidateAnswer:
        'Fiber creates a double-buffered work-in-progress tree. Reconciler matches elements by key and type. Using an array index means shifted elements preserve identity, causing uncontrolled inputs and memoized hooks to retain stale state from the previous item.',
      score: '96/100',
      badge: 'Strong Hire',
      strengths: ['Fiber Tree Diffing', 'Key Stability Insights', 'State Mutation Gotchas'],
    },
    {
      id: 'behavioral',
      title: '3. STAR Behavioral',
      role: 'Engineering Team Lead',
      round: 'Behavioral & Leadership',
      question:
        'Tell me about a time you handled a critical production incident where your team was divided on the root cause and rollback strategy.',
      candidateAnswer:
        'During a Black Friday spike, payment latency spiked 400%. Team members disagreed between a DB rollback and a CDN failover. I set up an incident bridge, reviewed Datadog p99 metrics showing connection exhaustion, executed the connection pool restart within 8 minutes, and followed up with a blameless post-mortem.',
      score: '92/100',
      badge: 'Hire',
      strengths: ['STAR Framework Compliant', 'Calm Incident Command', 'Blameless Post-Mortem'],
    },
  ];

  const currentScenario = demoScenarios[selectedScenarioIndex];

  // AI Voice speech simulator
  const handleToggleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isAiSpeaking) {
        window.speechSynthesis.cancel();
        setIsAiSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentScenario.question);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsAiSpeaking(false);
        utterance.onerror = () => setIsAiSpeaking(false);
        setIsAiSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsAiSpeaking(!isAiSpeaking);
      setTimeout(() => setIsAiSpeaking(false), 3000);
    }
  };

  // Launch interview helper
  const handleLaunchInterview = async (type = 'technical') => {
    if (isAuthenticated) {
      if (onStartSessionWithConfig) {
        onStartSessionWithConfig({ type });
      } else {
        setActivePage('setup');
      }
    } else {
      try {
        await guestLogin();
        if (onStartSessionWithConfig) {
          onStartSessionWithConfig({ type });
        } else {
          setActivePage('setup');
        }
      } catch (err) {
        setActivePage('register');
      }
    }
  };

  // Features data
  const featureList = [
    {
      icon: Brain,
      title: 'AI Interviewer',
      tag: 'Adaptive Voice & Mind',
      desc: 'Conduct realistic, human-like interviews with Dr. Elena Vance. Features adaptive follow-up probing, progressive hints, and multiple interviewer personas.',
      color: 'from-indigo-500 to-cyan-500',
      bullets: ['Adaptive contextual follow-ups', 'Bar Raiser & Supportive modes', 'Natural dialogue flow'],
    },
    {
      icon: Terminal,
      title: 'Technical Interviews',
      tag: 'Deep Architecture',
      desc: 'Master in-depth engineering concepts including system architecture, microservices, database optimizations, API design patterns, and distributed state.',
      color: 'from-blue-500 to-indigo-600',
      bullets: ['System scaling trade-offs', 'Database indexing & ACID', 'Framework internals'],
    },
    {
      icon: Users,
      title: 'HR Interviews',
      tag: 'Culture & Fit',
      desc: 'Ace screening rounds with real-world cultural fit questions, salary expectations, leadership philosophies, and behavioral alignment scenarios.',
      color: 'from-amber-500 to-orange-600',
      bullets: ['Recruiter screening simulation', 'Salary & expectation dialogues', 'Workplace scenario grading'],
    },
    {
      icon: Code,
      title: 'Coding Interviews',
      tag: 'Live Code Sandbox',
      desc: 'Write and test real code in an integrated multi-language editor (JS, Python, Java, C++) with live test case verification and Big-O complexity analysis.',
      color: 'from-emerald-500 to-teal-600',
      bullets: ['Multi-language compiler sandbox', 'Automated test suite validation', 'Big-O time & space breakdown'],
    },
    {
      icon: Mic,
      title: 'Voice Interviews',
      tag: 'Speech-to-Speech',
      desc: 'Experience natural spoken conversations powered by Web Speech API. Practice verbal fluency, eliminate filler words, and refine your speech pacing.',
      color: 'from-purple-500 to-pink-600',
      bullets: ['Real-time speech transcription', 'Speech pace & cadence feedback', 'Filler word reduction tracker'],
    },
    {
      icon: BarChart2,
      title: 'Instant Feedback',
      tag: 'Sub-3s Rubrics',
      desc: 'Receive immediate comprehensive scorecards with actionable ratings across 5 core competencies, constructive critiques, and top-tier model answers.',
      color: 'from-cyan-500 to-blue-500',
      bullets: ['0-100 rubric multi-pillar score', 'Exemplar model answers provided', 'Targeted areas for improvement'],
    },
  ];

  // How It Works Steps
  const howItWorksSteps = [
    {
      number: '01',
      step: 'Step 1: Choose your role',
      title: 'Select Your Target Position',
      desc: 'Choose from 20+ specialized software engineering, full-stack, frontend, backend, DevOps, data science, or campus placement graduate tracks.',
      tag: 'Frontend, Backend, SDE & more',
      icon: Target,
    },
    {
      number: '02',
      step: 'Step 2: Customize interview',
      title: 'Tailor Difficulty & Format',
      desc: 'Pick your preferred interview type (Technical, Coding, HR, System Design), select voice or text mode, and configure question depth and seniority level.',
      tag: 'Junior to Principal Levels',
      icon: Compass,
    },
    {
      number: '03',
      step: 'Step 3: Attend AI interview',
      title: 'Engage in Real-Time Simulation',
      desc: 'Speak naturally into your microphone or write code in the integrated sandbox. The AI interviewer listens, evaluates, and asks dynamic follow-ups.',
      tag: 'Web Speech & Live Execution',
      icon: Activity,
    },
    {
      number: '04',
      step: 'Step 4: Get feedback',
      title: 'Unlock Comprehensive Analysis',
      desc: 'Get an instant 5-pillar scorecard, complete with transcript breakdowns, delivery feedback, and exemplar model answers to fast-track your readiness.',
      tag: 'Actionable 5-Pillar Scorecard',
      icon: Award,
    },
  ];

  // Interview Types
  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical',
      subtitle: 'Architecture & CS Depth',
      difficulty: 'Intermediate to Advanced',
      duration: '25 - 45 min',
      color: 'from-indigo-500 to-cyan-500',
      sample: '"Explain how connection pooling and backpressure prevent microservice cascading failure under high concurrency."',
      topics: ['System Scalability', 'Database Internals', 'API Architecture', 'Distributed Caching'],
    },
    {
      id: 'hr',
      title: 'HR',
      subtitle: 'Recruiter & Cultural Fit',
      difficulty: 'All Experience Levels',
      duration: '15 - 30 min',
      color: 'from-amber-500 to-orange-500',
      sample: '"What key factors do you consider when prioritizing technical debt versus new product features under tight deadlines?"',
      topics: ['Culture Fit', 'Work Ethics', 'Career Trajectory', 'Cross-team Collaboration'],
    },
    {
      id: 'behavioral',
      title: 'Behavioral',
      subtitle: 'STAR Method Excellence',
      difficulty: 'Junior to Staff Engineer',
      duration: '20 - 35 min',
      color: 'from-pink-500 to-rose-600',
      sample: '"Describe a disagreement with a team lead over an architectural decision. How did you advocate your perspective and align?"',
      topics: ['Situation & Task', 'Action & Ownership', 'Quantifiable Results', 'Conflict Resolution'],
    },
    {
      id: 'coding',
      title: 'Coding',
      subtitle: 'Algorithms & Data Structures',
      difficulty: 'LeetCode Medium - Hard',
      duration: '30 - 60 min',
      color: 'from-emerald-500 to-teal-600',
      sample: '"Implement an LRU Cache with O(1) get and put operations using a doubly linked list and hash map with full test coverage."',
      topics: ['Data Structures', 'Algorithmic Complexity', 'Live Execution', 'Edge Case Handling'],
    },
    {
      id: 'system_design',
      title: 'System Design',
      subtitle: 'Large Scale Distributed Systems',
      difficulty: 'Mid to Principal Engineer',
      duration: '35 - 50 min',
      color: 'from-purple-500 to-indigo-600',
      sample: '"Design a global distributed rate limiter capable of supporting 200,000 requests/sec across multi-region deployments."',
      topics: ['Load Balancing', 'Data Partitioning', 'Message Queues', 'High Availability'],
    },
  ];

  // Candidate Performance Report Samples for Section 7
  const reportCandidates = [
    {
      name: 'Alex Chen',
      role: 'Senior Full Stack SDE Track',
      overallScore: 91,
      recommendation: 'Strong Hire',
      date: 'Today • 28 min session',
      pillars: {
        communication: {
          score: 94,
          label: 'Communication',
          summary: 'Extremely articulate delivery. Structured answers with clear executive summary followed by technical specifics.',
          feedback: 'Minimal filler words (0.4/min). Vocal cadence is steady and persuasive.',
        },
        technicalKnowledge: {
          score: 95,
          label: 'Technical Knowledge',
          summary: 'Demonstrated deep understanding of distributed transactions, idempotency semantics, and database isolation levels.',
          feedback: 'Correctly cited Redis SETNX atomic locking and Postgres FOR UPDATE row locks.',
        },
        problemSolving: {
          score: 88,
          label: 'Problem Solving',
          summary: 'Methodical decomposition of failure scenarios, network timeouts, and duplicate webhook delivery.',
          feedback: 'Could proactively highlight dead-letter queue strategies for corrupted payloads.',
        },
        confidence: {
          score: 87,
          label: 'Confidence',
          summary: 'Maintained steady composure and defended architectural trade-offs without defensive hesitation.',
          feedback: 'Excellent response when challenged with high-traffic edge cases.',
        },
        answerQuality: {
          score: 92,
          label: 'Answer Quality',
          summary: 'Directly hit all rubric core objectives. Provided practical, production-tested solutions.',
          feedback: 'Top 5% answer quality compared to platform benchmark candidates.',
        },
      },
      strengths: [
        'Precise architectural terminology (idempotency, distributed lock leases, ACID)',
        'Clear STAR method structure in behavioral examples',
        'Proactive edge-case coverage for network retry storms',
      ],
      growthAreas: [
        'Mention exponential backoff with jitter when discussing downstream retry logic',
        'State estimated operational costs when proposing dual-region Redis caches',
      ],
      modelAnswerExcerpt:
        '“To ensure complete idempotency in financial transactions: 1) Client sends Idempotency-Key header; 2) Worker tries Redis SET key token NX PX 120000; 3) If lock acquired, query Postgres transactions table; 4) Execute Stripe charge and update Postgres atomically; 5) Store Stripe response in Redis cache for 24h.”',
    },
    {
      name: 'Priya Sharma',
      role: 'Frontend React Specialist Track',
      overallScore: 89,
      recommendation: 'Strong Hire',
      date: 'Yesterday • 32 min session',
      pillars: {
        communication: {
          score: 92,
          label: 'Communication',
          summary: 'Crisp verbal descriptions of complex React Fiber virtual DOM diffing concepts.',
          feedback: 'Uses concise analogies that make architectural concepts immediately understandable.',
        },
        technicalKnowledge: {
          score: 93,
          label: 'Technical Knowledge',
          summary: 'In-depth mastery of React reconciler, batching updates, and memory leak prevention in useEffect.',
          feedback: 'Accurately articulated why array indices as keys break memoized child tree state.',
        },
        problemSolving: {
          score: 86,
          label: 'Problem Solving',
          summary: 'Strong debugging instincts when tracing layout thrashing and unnecessary re-renders.',
          feedback: 'Recommended React DevTools Profiler and Chrome Performance timeline.',
        },
        confidence: {
          score: 84,
          label: 'Confidence',
          summary: 'Comfortable speaking through live coding logic and explaining trade-offs.',
          feedback: 'Take a brief 3-second breath before tackling surprise follow-up questions.',
        },
        answerQuality: {
          score: 90,
          label: 'Answer Quality',
          summary: 'Comprehensive answers adhering directly to industry frontend hiring standards.',
          feedback: 'Includes modern React 19 concurrent feature best practices.',
        },
      },
      strengths: [
        'Deep mastery of React rendering pipeline and Virtual DOM diffing',
        'Clear explanations of memoization and bundle optimization',
        'Strong focus on web accessibility (a11y) and Core Web Vitals',
      ],
      growthAreas: [
        'Discuss Server-Side Rendering (SSR) hydration mismatch edge cases',
        'Elaborate more on bundle analysis tools like Webpack Bundle Analyzer',
      ],
      modelAnswerExcerpt:
        '“When dynamic lists mutate, keys allow React to identify which items have changed, been added, or removed. Using an array index causes React to assume the item identity matches its position, leading to subtle state retention in child inputs during re-sorting.”',
    },
  ];

  const currentReport = reportCandidates[selectedReportCandidate];

  return (
    <div className="space-y-28 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* =========================================================================
          SECTION 2: HERO SECTION
          Headline: "Practice Interviews. Build Confidence. Get Hired."
          Subheadline: "AI-powered realistic interviews with instant feedback and personalized performance analysis."
          Buttons: Start Free Interview | Explore Features
          Modern visual showing AI interviewer / chat interface
         ========================================================================= */}
      <section id="hero" className="relative pt-6 sm:pt-12 text-center space-y-8">
        {/* Glow backdrop aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hero badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>The Next-Gen AI Interview Simulator for Tech Careers</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          Practice Interviews.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            Build Confidence.
          </span>{' '}
          Get Hired.
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          AI-powered realistic interviews with instant feedback and personalized performance analysis.
        </p>

        {/* Hero CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => handleLaunchInterview('technical')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Start Free Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-4 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer"
          >
            <span>Explore Features</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </a>

          <button
            onClick={() => handleLaunchInterview('technical')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-sm bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1-Click Instant Demo</span>
          </button>
        </div>

        {/* Quick Trust Ticker */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400 font-medium">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Credit Card Required</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Web Speech Voice & Audio</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant STAR Rubric Evaluation</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Live Coding Sandbox</span>
          </span>
        </div>

        {/* =========================================================================
            HERO VISUAL: MODERN AI INTERVIEWER / CHAT INTERFACE
           ========================================================================= */}
        <div className="pt-8 max-w-5xl mx-auto text-left">
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl overflow-hidden">
            {/* Top Bar of the Simulation Window */}
            <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-semibold text-slate-200">
                    Live Session: {currentScenario.role}
                  </span>
                </div>
              </div>

              {/* Scenario Selector Tabs */}
              <div className="flex items-center space-x-1 pt-2 sm:pt-0">
                {demoScenarios.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setSelectedScenarioIndex(idx);
                      if (isAiSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        setIsAiSpeaking(false);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      selectedScenarioIndex === idx
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {sc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Interview Container */}
            <div className="p-5 sm:p-7 space-y-6">
              {/* Interviewer Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-3.5">
                  {/* AI Avatar with pulse ring */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                      <Brain className="w-6 h-6" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">Dr. Elena Vance</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Lead AI Interviewer
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span>Round: {currentScenario.round}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-mono">03:42 elapsed</span>
                    </p>
                  </div>
                </div>

                {/* Voice / Audio Controls */}
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={handleToggleSpeak}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                    title="Synthesize and play the AI question"
                  >
                    {isAiSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Mute Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Hear AI Voice</span>
                      </>
                    )}
                  </button>

                  <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Speech Engine Active</span>
                  </div>
                </div>
              </div>

              {/* Chat Conversation Thread */}
              <div className="space-y-4">
                {/* AI Interviewer Question Message */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-1">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-indigo-300">Dr. Elena Vance</span>
                      <span>Just now</span>
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-950 border border-indigo-950/60 shadow-lg text-sm text-slate-100 leading-relaxed font-sans">
                      <p>{currentScenario.question}</p>
                    </div>

                    {/* Audio Wave Visualizer Simulation */}
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/30 border border-indigo-800/30 w-fit text-xs text-indigo-300">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      <div className="flex items-center space-x-0.5 h-3">
                        <span className={`w-0.5 bg-indigo-400 rounded-full ${isAiSpeaking ? 'animate-wave-bar' : 'h-2'}`} />
                        <span className={`w-0.5 bg-indigo-400 rounded-full ${isAiSpeaking ? 'animate-wave-bar delay-75' : 'h-3'}`} />
                        <span className={`w-0.5 bg-indigo-400 rounded-full ${isAiSpeaking ? 'animate-wave-bar delay-150' : 'h-1.5'}`} />
                        <span className={`w-0.5 bg-indigo-400 rounded-full ${isAiSpeaking ? 'animate-wave-bar delay-300' : 'h-2.5'}`} />
                        <span className={`w-0.5 bg-indigo-400 rounded-full ${isAiSpeaking ? 'animate-wave-bar delay-100' : 'h-2'}`} />
                      </div>
                      <span className="text-[11px] font-mono pl-1">
                        {isAiSpeaking ? 'Synthesizing voice...' : 'Natural Speech Synthesis'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Response Message */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 mt-1">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-emerald-400">You (Candidate &bull; Spoken Response)</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                        🎙️ Voice Transcribed
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-900 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
                      <p>{currentScenario.candidateAnswer}</p>
                    </div>
                  </div>
                </div>

                {/* Instant AI Rubric Feedback Floating Card */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-indigo-950/30 border border-emerald-500/30 shadow-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Instant AI Evaluation:
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {currentScenario.score}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {currentScenario.badge}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Verified Strengths:</span>
                    {currentScenario.strengths.map((str, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] bg-slate-900 text-slate-200 border border-slate-700"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{str}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TRUST / STATISTICS SECTION
          Show:
          - AI-powered interviews
          - Multiple interview types
          - Instant feedback
          - Personalized analytics
         ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Serious Career Growth
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            From university placement exams to senior engineering bar raisers, see why thousands of engineers trust InterviewAI.
          </p>
        </div>

        {/* 4 Required Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1: AI-Powered Interviews */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                100,000+
              </div>
              <h3 className="font-bold text-sm text-indigo-300 mt-1">AI-Powered Interviews</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Realistic, dynamic interview sessions conducted with real-time speech and code execution.
              </p>
            </div>
          </div>

          {/* Stat 2: Multiple Interview Types */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                5+ Types
              </div>
              <h3 className="font-bold text-sm text-cyan-300 mt-1">Multiple Interview Types</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tailored rounds for Technical, HR, Behavioral, Live Coding, and System Design tracks.
              </p>
            </div>
          </div>

          {/* Stat 3: Instant Feedback */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                &lt; 3 Seconds
              </div>
              <h3 className="font-bold text-sm text-emerald-300 mt-1">Instant Feedback</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Sub-3-second rubric evaluation across 5 critical dimensions with model answers.
              </p>
            </div>
          </div>

          {/* Stat 4: Personalized Analytics */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all shadow-xl space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                98.4%
              </div>
              <h3 className="font-bold text-sm text-purple-300 mt-1">Personalized Analytics</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Candidates report noticeable confidence gains with custom skill radars and progress tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof / Target Companies Badges */}
        <div className="pt-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 p-6 sm:p-8 text-center space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Engineered to Prepare Candidates for Top Tech Hiring Bars
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 text-sm font-semibold opacity-80">
            <span className="hover:text-white transition-colors">Google</span>
            <span className="hover:text-white transition-colors">Amazon</span>
            <span className="hover:text-white transition-colors">Microsoft</span>
            <span className="hover:text-white transition-colors">Meta</span>
            <span className="hover:text-white transition-colors">Netflix</span>
            <span className="hover:text-white transition-colors">Stripe</span>
            <span className="hover:text-white transition-colors">Uber</span>
          </div>

          {/* Candidate Testimonial Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The AI interviewer felt exactly like my Amazon AWS bar raiser. The real-time STAR breakdown gave me the confidence to ace my final loop."
              </p>
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-200">Sarah K.</span> &bull; Software Engineer at Amazon
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "As a fresher, interview anxiety was my biggest hurdle. Practicing 10 coding and technical rounds on InterviewAI helped me secure 3 campus offers."
              </p>
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-200">Rahul M.</span> &bull; Campus Graduate (Tier-1 College)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The instant rubric and model answers are mind-blowing. In 3 seconds, you understand exactly how a Staff Engineer would structure the answer."
              </p>
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-200">David P.</span> &bull; Frontend Lead at FinTech
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURES SECTION
          Cards:
          - AI Interviewer
          - Technical Interviews
          - HR Interviews
          - Coding Interviews
          - Voice Interviews
          - Instant Feedback
         ========================================================================= */}
      <section id="features" className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>State of the Art Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Comprehensive Interview Readiness
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Everything you need to turn high-stakes interview stress into effortless, polished performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="relative p-7 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl space-y-4 group transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-950/50"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                    {feature.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  {feature.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HOW IT WORKS
          Step 1: Choose your role
          Step 2: Customize interview
          Step 3: Attend AI interview
          Step 4: Get feedback
         ========================================================================= */}
      <section id="how-it-works" className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Seamless 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            From role selection to actionable feedback in under fifteen minutes.
          </p>
        </div>

        {/* Step-by-Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {howItWorksSteps.map((stepItem, sIdx) => {
            const Icon = stepItem.icon;
            return (
              <div
                key={sIdx}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-extrabold text-indigo-400/80">
                    {stepItem.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    {stepItem.step}
                  </div>
                  <h3 className="font-bold text-base text-white">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-block px-2.5 py-1 rounded text-[10px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {stepItem.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick launch banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-700/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-white text-base">Want to experience all 4 steps in action?</h4>
            <p className="text-xs text-slate-300">Launch a test interview session instantly with zero setup time.</p>
          </div>
          <button
            onClick={() => handleLaunchInterview('technical')}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            Launch Interview Simulator &rarr;
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INTERVIEW TYPES
          Show cards for:
          - Technical
          - HR
          - Behavioral
          - Coding
          - System Design
         ========================================================================= */}
      <section id="interview-types" className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Role-Specific Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Specialized Interview Types
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Prepare with tailored rubrics built to mimic actual industry bar raiser interviews.
          </p>
        </div>

        {/* 5 Interview Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewTypes.map((type) => (
            <div
              key={type.id}
              className="relative p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl space-y-5 flex flex-col justify-between group transition-all hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${type.color}`}>
                    {type.title}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{type.duration}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                    {type.title} Interview
                  </h3>
                  <p className="text-xs text-slate-400">{type.subtitle}</p>
                </div>

                {/* Sample Question */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    Sample Question:
                  </span>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    {type.sample}
                  </p>
                </div>

                {/* Topics Tags */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400">Core Evaluated Areas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {type.topics.map((top, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleLaunchInterview(type.id)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all cursor-pointer group-hover:bg-indigo-600 group-hover:text-white"
                >
                  <span>Practice {type.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Bonus All-In-One Full Loop Mock Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                  Full Hiring Loop
                </span>
                <span className="text-[11px] font-mono text-indigo-300 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Customizable</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-white">Full SDE Mock Loop</h3>
                <p className="text-xs text-slate-300">Multi-round simulation combining all 5 formats</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Test your endurance and adaptability by taking technical architecture, live coding, and behavioral STAR rounds back-to-back just like an on-site interview day.
              </p>

              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Comprehensive Hiring Committee Scorecard</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-indigo-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>Overall Bar Raiser Hiring Decision</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLaunchInterview('technical')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Start Full Hiring Mock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: AI FEEDBACK PREVIEW
          Create a sample performance report showing:
          - Communication
          - Technical Knowledge
          - Problem Solving
          - Confidence
          - Answer Quality
         ========================================================================= */}
      <section id="feedback-preview" className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Interactive Evaluation Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Feedback & Performance Report Preview
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            After every interview, receive instant multi-dimensional grading with quantitative benchmarks and actionable advice.
          </p>
        </div>

        {/* Performance Report Container */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8 backdrop-blur-xl">
          {/* Report Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Sample Performance Report
                </span>
                <span className="text-xs text-slate-400 font-mono">{currentReport.date}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Candidate: {currentReport.name}
              </h3>
              <p className="text-xs text-slate-400">{currentReport.role}</p>
            </div>

            {/* Candidate Toggle Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 pr-1">Switch Sample:</span>
              {reportCandidates.map((cand, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => setSelectedReportCandidate(cIdx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedReportCandidate === cIdx
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Overall Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800">
            <div className="md:col-span-4 flex items-center space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-500/20 shrink-0">
                <span className="text-2xl font-black">{currentReport.overallScore}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider -mt-1">/ 100</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Overall Recommendation
                </span>
                <h4 className="text-xl font-extrabold text-white">{currentReport.recommendation}</h4>
                <p className="text-xs text-slate-400">92nd percentile among candidate cohort</p>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-wrap gap-2 justify-start md:justify-end">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase">Speech Pacing</span>
                <p className="font-bold text-white">138 words / min (Optimal)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase">Filler Words</span>
                <p className="font-bold text-emerald-400">0.4 per minute (Minimal)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase">STAR Compliance</span>
                <p className="font-bold text-indigo-300">100% Framework Verified</p>
              </div>
            </div>
          </div>

          {/* The 5 Key Required Rubric Dimensions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>5-Pillar Competency Analysis</span>
              </h4>
              <span className="text-xs text-slate-400">Normalized 0 - 100 Scoring</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pillar 1: Communication */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">1. Communication</span>
                  <span className="font-extrabold text-sm text-cyan-400">
                    {currentReport.pillars.communication.score} / 100
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${currentReport.pillars.communication.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReport.pillars.communication.summary}
                </p>
                <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                  "{currentReport.pillars.communication.feedback}"
                </div>
              </div>

              {/* Pillar 2: Technical Knowledge */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">2. Technical Knowledge</span>
                  <span className="font-extrabold text-sm text-indigo-400">
                    {currentReport.pillars.technicalKnowledge.score} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${currentReport.pillars.technicalKnowledge.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReport.pillars.technicalKnowledge.summary}
                </p>
                <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                  "{currentReport.pillars.technicalKnowledge.feedback}"
                </div>
              </div>

              {/* Pillar 3: Problem Solving */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">3. Problem Solving</span>
                  <span className="font-extrabold text-sm text-emerald-400">
                    {currentReport.pillars.problemSolving.score} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    style={{ width: `${currentReport.pillars.problemSolving.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReport.pillars.problemSolving.summary}
                </p>
                <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                  "{currentReport.pillars.problemSolving.feedback}"
                </div>
              </div>

              {/* Pillar 4: Confidence */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">4. Confidence</span>
                  <span className="font-extrabold text-sm text-amber-400">
                    {currentReport.pillars.confidence.score} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${currentReport.pillars.confidence.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReport.pillars.confidence.summary}
                </p>
                <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                  "{currentReport.pillars.confidence.feedback}"
                </div>
              </div>

              {/* Pillar 5: Answer Quality */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 md:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">5. Answer Quality</span>
                  <span className="font-extrabold text-sm text-pink-400">
                    {currentReport.pillars.answerQuality.score} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                    style={{ width: `${currentReport.pillars.answerQuality.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReport.pillars.answerQuality.summary}
                </p>
                <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                  "{currentReport.pillars.answerQuality.feedback}"
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Targeted Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <h5 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identified Core Strengths</span>
              </h5>
              <ul className="space-y-2 text-xs text-slate-200">
                {currentReport.strengths.map((st, sIdx) => (
                  <li key={sIdx} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <h5 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
                <Flame className="w-4 h-4" />
                <span>Actionable Areas for Improvement</span>
              </h5>
              <ul className="space-y-2 text-xs text-slate-200">
                {currentReport.growthAreas.map((gr, gIdx) => (
                  <li key={gIdx} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{gr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Answer Excerpt Preview */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              AI Exemplar Model Answer (Staff Engineer Benchmark):
            </span>
            <p className="text-xs text-slate-300 italic leading-relaxed font-sans">
              {currentReport.modelAnswerExcerpt}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRICING SECTION (Linked from Navbar "Pricing" & Footer)
         ========================================================================= */}
      <section id="pricing" className="space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Transparent Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Plans for Every Career Stage
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Get started for free or upgrade for unlimited bar raiser sessions and full rubric analytics.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center space-x-3 pt-3">
            <span className={`text-xs font-semibold ${pricingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setPricingCycle(pricingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 relative border border-slate-700 cursor-pointer transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-indigo-500 transition-transform ${
                  pricingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${pricingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              Annual
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Save 35%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Free Starter */}
          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-white">Free Starter</h3>
                <p className="text-xs text-slate-400 mt-1">Perfect for college students & freshers starting out.</p>
              </div>

              <div className="text-3xl font-extrabold text-white">
                $0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>5 Free full-length mock interviews</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Technical & HR interview tracks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant 0-100 rubric scoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Speech-to-text voice recognition</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleLaunchInterview('technical')}
              className="w-full py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Tier 2: Pro Candidate (Highlighted) */}
          <div className="p-7 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-950/60 space-y-6 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md">
              Most Popular
            </span>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-white">Pro Candidate</h3>
                <p className="text-xs text-indigo-300/80 mt-1">For active job seekers targeting top tech companies.</p>
              </div>

              <div className="text-3xl font-extrabold text-white">
                {pricingCycle === 'annual' ? '$12' : '$19'}{' '}
                <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong>Unlimited</strong> AI mock interviews</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>All 5 interview types (inc. System Design)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live multi-language code runner</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full 5-pillar performance breakdown</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exemplar model answers for every question</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActivePage('register')}
              className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Tier 3: University / Enterprise */}
          <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-white">Campus & Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">For colleges, bootcamps, and career accelerators.</p>
              </div>

              <div className="text-3xl font-extrabold text-white">
                Custom <span className="text-xs text-slate-400 font-normal">/ student pool</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cohort management & bulk licenses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Custom college question banks & rubrics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Placement cell analytics dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dedicated training & support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActivePage('register')}
              className="w-full py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              Contact Campus Team
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: CTA SECTION
          "Ready for your next interview?"
          Button: Start Your Interview
         ========================================================================= */}
      <section className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-700/40 p-8 sm:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Land Offers Faster</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready for your next interview?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Stop guessing how you perform. Practice with the realistic AI interview simulator that gives you instant feedback and turns interview anxiety into unbreakable confidence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleLaunchInterview('technical')}
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-white via-slate-100 to-indigo-100 text-slate-950 hover:bg-white shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              Start Your Interview
            </button>

            <button
              onClick={() => handleLaunchInterview('technical')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              ⚡ Instant Guest Demo
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Free starter tier &bull; No credit card required &bull; 2-minute setup
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
