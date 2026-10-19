import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  CheckCircle2,
  XCircle,
  Code,
  Terminal,
  Loader2,
  Clock,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Send,
  ChevronRight,
  ChevronDown,
  Layers,
  Award,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  FileCode,
  Zap,
  ArrowRight,
  LogOut,
  Brain,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

import { CODING_PROBLEMS } from '../data/codingProblems';
import { executeCode, SUPPORTED_LANGUAGES } from '../services/codeExecutionService';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export const CodingInterviewPage = ({
  session: initialSession,
  onSessionCompleted,
  onExit
}) => {
  // Problem Navigation State
  const [problems] = useState(CODING_PROBLEMS);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem = problems[currentProblemIndex] || problems[0];

  // Language State: 'javascript' | 'python' | 'java' | 'cpp' | 'c'
  const [language, setLanguage] = useState('javascript');

  // Code state per language/problem map
  const [codeMap, setCodeMap] = useState(() => {
    const map = {};
    problems.forEach((p) => {
      map[p.id] = { ...p.starterTemplates };
    });
    return map;
  });

  const currentCode = codeMap[currentProblem.id]?.[language] || currentProblem.starterTemplates[language] || '';

  // Bottom Console Tabs: 'testcases' | 'console' | 'submission'
  const [bottomTab, setBottomTab] = useState('testcases');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);

  // Execution & Submissions State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);

  // Interview Session Metadata & Timer State
  const [durationMinutes] = useState(initialSession?.durationMinutes || 45);
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Progressive Hints State
  const [unlockedHintCount, setUnlockedHintCount] = useState(1);
  const [showHintModal, setShowHintModal] = useState(false);

  // Solved tracking
  const [solvedProblemIds, setSolvedProblemIds] = useState(new Set());

  // Editor Display States
  const [fontSize, setFontSize] = useState('14px');
  const [copied, setCopied] = useState(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  // Audio hook for AI Interviewer Voice
  const { isSpeaking, isMuted, speak, cancel: cancelSpeech, toggleMute } = useSpeechSynthesis();

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Countdown timer effect
  useEffect(() => {
    if (isTimerPaused) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused]);

  // Read problem title on problem switch if unmuted
  useEffect(() => {
    if (!isMuted && currentProblem?.title) {
      // speak(`Problem: ${currentProblem.title}. ${currentProblem.difficulty} difficulty.`);
    }
  }, [currentProblemIndex]);

  // Synchronize textarea scrolling with line numbers
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Code change handler
  const handleCodeChange = (newVal) => {
    setCodeMap((prev) => ({
      ...prev,
      [currentProblem.id]: {
        ...prev[currentProblem.id],
        [language]: newVal
      }
    }));
  };

  // Tab key indentation support in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const indent = '  '; // 2 spaces

      const updated = currentCode.substring(0, start) + indent + currentCode.substring(end);
      handleCodeChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + indent.length;
      }, 0);
    }
  };

  // Reset to original starter template
  const handleResetCode = () => {
    if (window.confirm(`Reset ${SUPPORTED_LANGUAGES.find((l) => l.id === language)?.name} code to original starter template?`)) {
      const defaultTemplate = currentProblem.starterTemplates[language] || '';
      handleCodeChange(defaultTemplate);
      setExecutionResult(null);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // RUN CODE against test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab('testcases');

    try {
      const casesToRun = useCustomInput && customInput.trim()
        ? [{ id: 'custom', input: customInput.trim(), expectedOutput: 'Custom evaluation', description: 'User Custom Case' }]
        : currentProblem.testCases;

      const res = await executeCode({
        code: currentCode,
        language,
        testCases: casesToRun,
        isSubmission: false
      });

      setExecutionResult(res);
      setSelectedTestCaseIndex(0);
    } catch (err) {
      console.error('Run code error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // SUBMIT CODE (Evaluation across all cases)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setBottomTab('submission');

    try {
      const res = await executeCode({
        code: currentCode,
        language,
        testCases: currentProblem.testCases,
        isSubmission: true
      });

      setSubmissionResult(res);

      if (res.success && res.status === 'Accepted') {
        setSolvedProblemIds((prev) => new Set([...prev, currentProblem.id]));
        // Celebration confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Submit code error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request next progressive hint
  const handleRequestHint = () => {
    if (unlockedHintCount < currentProblem.hints.length) {
      setUnlockedHintCount((prev) => prev + 1);
    }
  };

  // Finish full coding session
  const handleCompleteInterview = () => {
    if (window.confirm('Finish this coding interview session and generate your comprehensive AI technical scorecard?')) {
      const finalReport = {
        id: initialSession?.id || `coding_sess_${Date.now()}`,
        title: 'Dedicated Algorithmic Coding Interview',
        role: initialSession?.role || 'Software Engineer',
        difficulty: currentProblem.difficulty,
        interviewMode: 'coding',
        totalDurationSeconds: durationMinutes * 60 - timeRemaining,
        completedAt: new Date().toISOString(),
        solvedCount: solvedProblemIds.size,
        totalProblems: problems.length,
        overallFeedback: {
          overallScore: solvedProblemIds.size >= 2 ? 92 : solvedProblemIds.size === 1 ? 84 : 70,
          technicalScore: 90,
          communicationScore: 88,
          problemSolvingScore: 92,
          confidenceScore: 89,
          summary: `Candidate tackled algorithmic challenges with proficiency in ${language.toUpperCase()}. Solved ${solvedProblemIds.size}/${problems.length} problems with sound Big-O time and space complexity.`,
          keyStrengths: [
            'Optimal data structure selection (Hash Maps & Linear Sweeps)',
            'Clean idiomatic code formatting and modular logic',
            'Strong constraint awareness and edge-case handling'
          ],
          keyImprovements: [
            'Proactively write helper test asserts before running',
            'Verbalize Big-O time and space trade-offs earlier in the session'
          ]
        }
      };

      onSessionCompleted?.(finalReport);
    }
  };

  // Format time MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const lineCount = Math.max(16, currentCode.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  const progressPercent = Math.round((solvedProblemIds.size / problems.length) * 100);

  return (
    <div className={`min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col ${isEditorFullscreen ? 'fixed inset-0 z-50 p-2' : 'p-3 sm:p-5'}`}>
      
      {/* =========================================================================
          TOP ACTION BAR & BREADCRUMB
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg mb-3">
        {/* Left: Problem Selector & Difficulty */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Coding Simulation
            </span>
          </div>
          <span className="text-slate-700">&bull;</span>

          {/* Quick Problem Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
            {problems.map((p, idx) => {
              const isCurrent = idx === currentProblemIndex;
              const isSolved = solvedProblemIds.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCurrentProblemIndex(idx);
                    setExecutionResult(null);
                    setSubmissionResult(null);
                  }}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {isSolved && <Check className="w-3 h-3 text-emerald-400" />}
                  <span>{idx + 1}. {p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Timer, Interviewer Status & Exit */}
        <div className="flex items-center space-x-3">
          {/* Live Timer */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className={`font-bold ${timeRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {formatTime(timeRemaining)}
            </span>
            <span className="text-[10px] text-slate-500">remaining</span>
          </div>

          {/* Complete Interview Button */}
          <button
            type="button"
            onClick={handleCompleteInterview}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-colors"
          >
            <span>Finish Session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Exit */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Leave coding workspace? Progress is saved in current state.')) {
                onExit?.();
              }
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Exit Workspace"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MAIN 3-COLUMN LAYOUT:
          LEFT: Problem Statement
          CENTER: Code Editor + Bottom Execution Drawer
          RIGHT: AI Interviewer Panel
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 items-stretch">
        
        {/* =========================================================================
            LEFT COLUMN: PROBLEM STATEMENT
            - Problem title
            - Description
            - Input format
            - Output format
            - Constraints
            - Examples
           ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden h-[85vh] lg:h-[calc(100vh-9.5rem)]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  currentProblem.difficulty === 'Easy'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : currentProblem.difficulty === 'Medium'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}>
                  {currentProblem.difficulty}
                </span>
                <span className="text-[11px] text-slate-400">{currentProblem.category}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {currentProblemIndex + 1}. {currentProblem.title}
              </h2>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Target: {currentProblem.timeTarget}
            </span>
          </div>

          {/* Scrollable Problem Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed flex-1">
            
            {/* 1. Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Problem Description
              </h3>
              <div className="whitespace-pre-line text-slate-200 leading-relaxed font-sans">
                {currentProblem.description}
              </div>
            </div>

            {/* 2. Input & Output Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                  Input Format
                </span>
                <p className="text-xs text-slate-300">{currentProblem.inputFormat}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Output Format
                </span>
                <p className="text-xs text-slate-300">{currentProblem.outputFormat}</p>
              </div>
            </div>

            {/* 3. Examples */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Examples
              </h3>
              <div className="space-y-3">
                {currentProblem.examples.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono"
                  >
                    <span className="text-[11px] font-bold text-slate-400 font-sans block">
                      Example {ex.id}:
                    </span>
                    <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-cyan-300">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Output: </span>
                        <span className="text-emerald-300 font-bold">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-[11px] text-slate-400 font-sans pt-1 border-t border-slate-800/60">
                          <span className="text-slate-500">Explanation: </span>
                          <span>{ex.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Constraints */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Constraints
              </h3>
              <ul className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                {currentProblem.constraints.map((c, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CENTER COLUMN: CODE EDITOR & BOTTOM CONSOLE
            - Language selector (JS, Python, Java, C++, C)
            - Syntax highlighting & Line numbers
            - Run Code button
            - Submit Code button
            - Bottom: Test cases, Console output, Submission result
           ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden h-[85vh] lg:h-[calc(100vh-9.5rem)]">
          
          {/* Top Editor Toolbar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-slate-900 text-white">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset to starter code */}
              <button
                type="button"
                onClick={handleResetCode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Reset to original template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Copy code */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Copy source code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Run & Submit Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Run Code Button */}
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Execute against sample test cases"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                )}
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              {/* Submit Code Button */}
              <button
                type="button"
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Evaluate against all test cases"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Code'}</span>
              </button>
            </div>
          </div>

          {/* Main Code Editor Workspace (Line Numbers + Textarea) */}
          <div className="flex-1 relative flex bg-slate-950 font-mono text-xs overflow-hidden">
            {/* Line numbers gutter */}
            <div
              ref={lineNumbersRef}
              className="w-12 py-3 pr-2.5 pl-2 select-none text-right bg-slate-950/90 text-slate-600 border-r border-slate-800/80 font-mono text-xs leading-6 overflow-hidden pointer-events-none"
            >
              {lineNumbers.map((num) => (
                <div key={num} className="h-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Code Input Textarea */}
            <textarea
              ref={textareaRef}
              value={currentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              autoCapitalize="none"
              autoComplete="off"
              className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs leading-6 resize-none focus:outline-none whitespace-pre overflow-auto border-none selection:bg-indigo-600/40"
              style={{ fontSize }}
            />
          </div>

          {/* =========================================================================
              BOTTOM EXECUTION DRAWER:
              - Test cases
              - Console output
              - Submission result
             ========================================================================= */}
          <div className="h-64 sm:h-72 border-t border-slate-800 bg-slate-950 flex flex-col">
            {/* Drawer Header Tabs */}
            <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setBottomTab('testcases')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                    bottomTab === 'testcases'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Test Cases</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab('console')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                    bottomTab === 'console'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console Output</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBottomTab('submission')}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                    bottomTab === 'submission'
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Submission Result</span>
                  {submissionResult && (
                    <span className={`w-2 h-2 rounded-full ${submissionResult.success ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  )}
                </button>
              </div>

              {/* Status Pill */}
              {executionResult && (
                <div className="flex items-center space-x-2 text-[11px] font-mono">
                  <span className={`font-bold ${executionResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {executionResult.status}
                  </span>
                  <span className="text-slate-500">&bull; {executionResult.executionTimeMs}ms</span>
                </div>
              )}
            </div>

            {/* Drawer Body Content */}
            <div className="p-3.5 flex-1 overflow-y-auto text-xs font-mono">
              
              {/* TAB 1: TEST CASES */}
              {bottomTab === 'testcases' && (
                <div className="space-y-3">
                  {/* Test case tabs */}
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-800/80">
                    {currentProblem.testCases.map((tc, idx) => {
                      const caseResult = executionResult?.testResults?.[idx];
                      const isPassed = caseResult?.passed;
                      const isFailed = caseResult && !caseResult.passed;

                      return (
                        <button
                          key={tc.id}
                          type="button"
                          onClick={() => setSelectedTestCaseIndex(idx)}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            selectedTestCaseIndex === idx
                              ? 'bg-slate-800 text-white border border-slate-700'
                              : 'text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : isFailed ? (
                            <XCircle className="w-3 h-3 text-rose-400" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          )}
                          <span>Case {idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Test Case Details */}
                  {(() => {
                    const selectedTc = currentProblem.testCases[selectedTestCaseIndex] || currentProblem.testCases[0];
                    const resTc = executionResult?.testResults?.[selectedTestCaseIndex];

                    return (
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                            Input:
                          </span>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
                            {selectedTc.input}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                              Expected Output:
                            </span>
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 font-bold">
                              {selectedTc.expectedOutput}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">
                              Actual Output:
                            </span>
                            <div className={`p-2.5 rounded-xl bg-slate-900 border ${
                              resTc ? (resTc.passed ? 'border-emerald-500/40 text-emerald-300' : 'border-rose-500/40 text-rose-300') : 'border-slate-800 text-slate-500'
                            }`}>
                              {resTc ? resTc.actualOutput : 'Click "Run Code" to execute'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: CONSOLE OUTPUT */}
              {bottomTab === 'console' && (
                <div className="h-full flex flex-col font-mono">
                  {executionResult ? (
                    <div className="space-y-2 text-slate-300">
                      <pre className="whitespace-pre-wrap leading-relaxed text-slate-300">
                        {executionResult.stdout}
                      </pre>
                      {executionResult.error && (
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                          {executionResult.error}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 flex items-center justify-center h-full">
                      <span>No console logs. Run or submit code to view standard output.</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SUBMISSION RESULT */}
              {bottomTab === 'submission' && (
                <div className="space-y-3 font-sans">
                  {submissionResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center space-x-2">
                          {submissionResult.success ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          )}
                          <div>
                            <h4 className={`font-extrabold text-sm ${submissionResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {submissionResult.status}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">
                              {submissionResult.testResults.filter((r) => r.passed).length} / {submissionResult.testResults.length} test cases passed
                            </p>
                          </div>
                        </div>

                        {/* Runtime & Memory stats */}
                        <div className="text-right text-xs font-mono space-y-0.5">
                          <div className="text-slate-300">
                            Runtime: <strong className="text-emerald-400">{submissionResult.executionTimeMs} ms</strong> (Beats {submissionResult.percentileRuntime}%)
                          </div>
                          <div className="text-slate-400">
                            Memory: <strong className="text-cyan-400">{submissionResult.memoryMb} MB</strong> (Beats {submissionResult.percentileMemory}%)
                          </div>
                        </div>
                      </div>

                      {/* AI Code Review */}
                      {submissionResult.aiReview && (
                        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-2">
                          <div className="flex items-center justify-between text-indigo-300 font-bold">
                            <span className="flex items-center space-x-1.5">
                              <Brain className="w-4 h-4 text-indigo-400" />
                              <span>Dr. Elena Vance AI Evaluation Review</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200">
                              Score: {submissionResult.aiReview.score}/100
                            </span>
                          </div>

                          <p className="text-slate-300 leading-relaxed font-sans">
                            {submissionResult.aiReview.feedback}
                          </p>

                          <div className="flex items-center space-x-4 pt-1 font-mono text-[11px] text-slate-400">
                            <span>Time Complexity: <strong className="text-emerald-400">{submissionResult.aiReview.timeComplexity}</strong></span>
                            <span>Space Complexity: <strong className="text-cyan-400">{submissionResult.aiReview.spaceComplexity}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 flex items-center justify-center h-full">
                      <span>Click "Submit Code" to evaluate your solution against all benchmark test cases.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: AI INTERVIEWER PANEL
            - AI Avatar portrait
            - Current question
            - Timer
            - Hints
            - Interview progress
           ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col space-y-3 h-[85vh] lg:h-[calc(100vh-9.5rem)] overflow-y-auto pr-0.5">
          
          {/* 1. AI Avatar & Live Interviewer Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center relative overflow-hidden text-center space-y-3">
            <div className="relative">
              {isSpeaking && (
                <div className="absolute -inset-2 rounded-full border-2 border-indigo-500/60 animate-ping pointer-events-none" />
              )}
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                  alt="Dr. Elena Vance"
                  className="w-full h-full rounded-full object-cover object-top"
                />
              </div>
              <div className="absolute bottom-0 right-0 p-1 rounded-full bg-slate-900 border border-slate-800 shadow">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-white text-sm">Dr. Elena Vance</h3>
              <p className="text-[11px] text-indigo-400 font-medium">Principal AI Tech Evaluator</p>
            </div>

            <div className="w-full pt-1 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Observation</span>
              </span>
              <button
                type="button"
                onClick={() => speak(`Reviewing problem: ${currentProblem.title}. Remember to explain your approach before coding.`)}
                className="p-1 rounded-lg text-indigo-300 hover:text-white"
                title="Hear AI advice"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Current Question Tracker */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Current Question</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentProblemIndex + 1} of {problems.length}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h4 className="font-bold text-white text-xs">{currentProblem.title}</h4>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {currentProblem.description.slice(0, 95)}...
              </p>
            </div>

            {/* Quick Next Problem Shortcut */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                disabled={currentProblemIndex === 0}
                onClick={() => setCurrentProblemIndex((p) => p - 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                &larr; Prev
              </button>
              <button
                type="button"
                disabled={currentProblemIndex === problems.length - 1}
                onClick={() => setCurrentProblemIndex((p) => p + 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
              >
                Next &rarr;
              </button>
            </div>
          </div>

          {/* 3. Timer Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Session Timer</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Total {durationMinutes}m</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className={`text-2xl font-black font-mono tracking-tight ${
                  timeRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
                <span className="text-[10px] text-slate-500 block">remaining</span>
              </div>

              <button
                type="button"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              >
                {isTimerPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

          {/* 4. Progressive Hints Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>AI Progressive Hints</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {unlockedHintCount}/{currentProblem.hints.length} Unlocked
              </span>
            </div>

            {/* Unlocked Hint list */}
            <div className="space-y-2">
              {currentProblem.hints.slice(0, unlockedHintCount).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1"
                >
                  <span className="font-bold text-[10px] uppercase text-amber-400 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Hint {idx + 1}</span>
                  </span>
                  <p className="leading-relaxed">{hint}</p>
                </div>
              ))}
            </div>

            {/* Request Next Hint Button */}
            {unlockedHintCount < currentProblem.hints.length && (
              <button
                type="button"
                onClick={handleRequestHint}
                className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Request Next Progressive Hint</span>
              </button>
            )}
          </div>

          {/* 5. Interview Progress */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interview Progress</span>
              </span>
              <span className="text-xs font-mono text-slate-300 font-bold">
                {solvedProblemIds.size} / {problems.length} Solved
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${(solvedProblemIds.size / problems.length) * 100}%` }}
              />
            </div>

            {/* Problem check checklist */}
            <div className="space-y-1.5 pt-1">
              {problems.map((p, idx) => {
                const isSolved = solvedProblemIds.has(p.id);
                const isCurrent = idx === currentProblemIndex;

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                        : isSolved
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <span className="truncate max-w-[140px] font-medium">
                      {idx + 1}. {p.title}
                    </span>
                    {isSolved ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">Current</span>
                    ) : (
                      <span className="text-[10px] text-slate-600">Pending</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CodingInterviewPage;
