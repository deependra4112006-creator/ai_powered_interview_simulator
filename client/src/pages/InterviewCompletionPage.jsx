import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Briefcase,
  RotateCcw,
  LayoutDashboard,
  ArrowRight,
  Brain,
  Loader2,
  Award,
  ShieldCheck,
  Check,
  FileText,
  UserCheck
} from 'lucide-react';

export const InterviewCompletionPage = ({
  session: initialSession,
  onViewReport,
  onPracticeAgain,
  onGoDashboard
}) => {
  // Safe session normalization with high-quality fallback
  const session = initialSession || {
    title: 'Software Engineer Technical Interview',
    role: 'Software Engineer',
    experienceLevel: 'Intermediate',
    interviewMode: 'technical',
    totalDurationSeconds: 1120, // ~18m 40s
    questions: [
      { id: '1', questionText: 'Tell me about yourself and your background.' },
      { id: '2', questionText: 'Designing scalable architecture.' },
      { id: '3', questionText: 'Overcoming a challenging bug.' },
      { id: '4', questionText: 'Team disagreements and resolution.' },
      { id: '5', questionText: 'Future engineering goals.' }
    ],
    answers: [{}, {}, {}, {}, {}],
    overallFeedback: {
      overallScore: 89,
      recommendation: 'Strong Hire'
    }
  };

  // Processing state: "AI is analyzing your interview..."
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  // Analysis pipeline steps
  const analysisSteps = [
    'Transcribing voice responses and code submissions...',
    'Calibrating technical accuracy against rubric benchmarks...',
    'Evaluating communication poise and STAR methodology...',
    'Synthesizing personalized AI executive report...'
  ];

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.6 }
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.6 }
        });
      }, 400);
    } catch (e) {}
  }, []);

  // Simulated AI analysis progress progression (completes in ~2.8s)
  useEffect(() => {
    const timer = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsAnalysisComplete(true);
          return 100;
        }
        const next = prev + Math.floor(12 + Math.random() * 15);
        if (next >= 100) {
          setIsAnalysisComplete(true);
          return 100;
        }
        return next;
      });
    }, 280);

    return () => clearInterval(timer);
  }, []);

  // Update step index based on progress percentage
  useEffect(() => {
    if (analysisProgress < 25) setCurrentStepIndex(0);
    else if (analysisProgress < 55) setCurrentStepIndex(1);
    else if (analysisProgress < 85) setCurrentStepIndex(2);
    else setCurrentStepIndex(3);
  }, [analysisProgress]);

  // Derived metrics for summary cards
  const totalQuestions = session.questions?.length || 5;
  const answeredCount = session.answers?.length || totalQuestions;
  
  const durationSeconds = session.totalDurationSeconds || 1120;
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  const formattedDuration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const interviewType = (
    session.interviewMode
      ? session.interviewMode.charAt(0).toUpperCase() + session.interviewMode.slice(1)
      : 'Technical'
  );

  const role = session.role || 'Software Engineer';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
        
        {/* Ambient background glow aura */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* =========================================================================
            HEADER & MESSAGE
            - "Interview Completed 🎉"
            - "Your interview has been submitted successfully."
           ========================================================================= */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Submission Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
            <span>Interview Completed</span>
            <span className="inline-block animate-bounce">🎉</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
            Your interview has been submitted successfully.
          </p>
        </div>

        {/* =========================================================================
            SUMMARY GRID
            - Questions answered
            - Duration
            - Interview type
            - Role
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
          
          {/* 1. Questions Answered */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 transition-transform hover:scale-[1.02]">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Questions</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
              {answeredCount} / {totalQuestions}
            </div>
            <p className="text-[10px] text-slate-500">100% Completed</p>
          </div>

          {/* 2. Duration */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 transition-transform hover:scale-[1.02]">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Duration</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
              {formattedDuration}
            </div>
            <p className="text-[10px] text-slate-500">Recorded Session</p>
          </div>

          {/* 3. Interview Type */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 transition-transform hover:scale-[1.02]">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Round Type</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-cyan-300 truncate">
              {interviewType}
            </div>
            <p className="text-[10px] text-slate-500">AI Simulation</p>
          </div>

          {/* 4. Role */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 transition-transform hover:scale-[1.02]">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
              <Briefcase className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Target Role</span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white truncate" title={role}>
              {role}
            </div>
            <p className="text-[10px] text-slate-500">Evaluated Candidate</p>
          </div>

        </div>

        {/* =========================================================================
            PROCESSING ANIMATION: "AI is analyzing your interview..."
           ========================================================================= */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
                {!isAnalysisComplete && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                {isAnalysisComplete ? 'AI Analysis Complete ✨' : 'AI is analyzing your interview...'}
              </h3>
            </div>

            <span className="text-xs font-mono text-indigo-400 font-bold">
              {analysisProgress}%
            </span>
          </div>

          {/* Fluid Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isAnalysisComplete
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 animate-pulse'
              }`}
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          {/* Current Step Description */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-2">
              {!isAnalysisComplete ? (
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              <span className="text-slate-300">
                {isAnalysisComplete
                  ? 'Evaluation synthesis ready. Click below to inspect your detailed scorecard.'
                  : analysisSteps[currentStepIndex]}
              </span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Dr. Elena Vance AI
            </span>
          </div>
        </div>

        {/* =========================================================================
            ACTION BUTTONS:
            - "View Performance Report" (Primary)
            - "Practice Again"
            - "Back to Dashboard"
           ========================================================================= */}
        <div className="space-y-3 relative z-10 pt-2">
          
          {/* Primary CTA: View Performance Report */}
          <button
            type="button"
            onClick={onViewReport}
            className={`w-full flex items-center justify-center space-x-2.5 py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white shadow-xl transition-all cursor-pointer ${
              isAnalysisComplete
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-indigo-600/80 hover:bg-indigo-600 opacity-90'
            }`}
          >
            <Sparkles className="w-5 h-5 text-cyan-200" />
            <span>View Performance Report</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary Actions: Practice Again & Back to Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onPracticeAgain}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>Practice Again</span>
            </button>

            <button
              type="button"
              onClick={onGoDashboard}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Back to Dashboard</span>
            </button>
          </div>

        </div>

        {/* Security & Authenticity Trust Badge */}
        <div className="text-center pt-2 relative z-10 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Confidential Assessment &bull; Enterprise Rubric Grading &bull; Saved to Account</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default InterviewCompletionPage;
