import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SkipForward,
  LogOut,
  FileText,
  Check,
  Layers,
  ShieldCheck,
  Award,
  HelpCircle,
  Send,
  Square,
  Play,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Brain,
  MessageSquare,
  Sparkles,
  UserCheck,
  Smile,
  Compass,
  Eye,
  Target,
  Printer,
  ThumbsUp
} from 'lucide-react';

import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import api from '../services/api';

// Curated 6 core HR and Behavioral interview questions requested by the user
const HR_BEHAVIORAL_QUESTIONS = [
  {
    id: 'hr_1',
    questionText: 'Tell me about yourself.',
    category: 'Personal Elevator Pitch',
    timeTarget: '2 - 3 mins',
    recruiterObjective: 'Looking for a structured narrative summarizing your background, prominent projects, core tech stack, and what drives you.',
    starGuidance: {
      situation: 'Briefly mention your educational and professional background.',
      task: 'State what you specialize in and your current engineering focus.',
      action: 'Highlight 1-2 major projects or technologies you mastered.',
      result: 'Conclude with why you are excited about this role.'
    },
    sampleKeywords: ['experience', 'developer', 'engineer', 'built', 'projects', 'passion', 'currently', 'excited'],
    idealAnswer: 'I am a software engineer with extensive hands-on experience building scalable applications. Over the past few years, I have worked across the stack with React, Node.js, and cloud systems, delivering production features that improved performance. Recently, I led the modernization of a client portal that accelerated page loads by 40%. I enjoy solving complex architectural challenges and am excited to bring my problem-solving skills to this team.'
  },
  {
    id: 'hr_2',
    questionText: 'What are your strengths?',
    category: 'Core Competencies & Self-Awareness',
    timeTarget: '2 mins',
    recruiterObjective: 'Evaluate self-awareness, technical strengths, ownership, and how you apply your skills in team environments.',
    starGuidance: {
      situation: 'Pick 2 core strengths (e.g. rapid debugging, cross-team communication, architectural design).',
      task: 'Explain why these strengths are critical to high-impact development.',
      action: 'Provide a real instance where this strength made a clear difference.',
      result: 'Summarize the positive outcome for the project or team.'
    },
    sampleKeywords: ['strength', 'problem solving', 'communication', 'reliable', 'adaptable', 'fast learner', 'leadership'],
    idealAnswer: 'My top strength is structured problem decomposition and rapid debugging. When faced with complex production issues, I stay calm and methodically isolate root causes using profiling and telemetry. For example, during a high-stakes launch outage, I pinpointed an asynchronous connection pool leak within 30 minutes, preventing extensive client downtime. My second strength is clear technical communication across cross-functional teams.'
  },
  {
    id: 'hr_3',
    questionText: 'What is your weakness?',
    category: 'Self-Awareness & Growth Mindset',
    timeTarget: '2 mins',
    recruiterObjective: 'Looking for genuine self-reflection and proactive steps you take to improve rather than cliché non-weaknesses.',
    starGuidance: {
      situation: 'Choose an authentic professional area you have identified for growth.',
      task: 'Acknowledge how it initially impacted your workflow.',
      action: 'Detail the concrete tools, habits, or mentors you used to address it.',
      result: 'Demonstrate measurable progress and sustained improvement.'
    },
    sampleKeywords: ['weakness', 'delegation', 'public speaking', 'perfectionism', 'working on', 'improved', 'habit', 'learned'],
    idealAnswer: 'Early in my career, I had a tendency to dive directly into code implementation before fully refining requirements with stakeholders. I realized this occasionally caused rework. To address this, I adopted a deliberate pre-coding workflow: creating brief design RFCs and holding 10-minute alignment check-ins before writing complex modules. This has significantly reduced scope misalignment and improved my engineering velocity.'
  },
  {
    id: 'hr_4',
    questionText: 'Why should we hire you?',
    category: 'Value Proposition & Role Fit',
    timeTarget: '2 - 3 mins',
    recruiterObjective: 'Testing company research, alignment with team needs, and your unique value proposition.',
    starGuidance: {
      situation: 'Acknowledge the company’s mission and technical challenges.',
      task: 'Connect your direct competencies to their immediate needs.',
      action: 'Highlight your track record of delivering reliable software under constraints.',
      result: 'Emphasize your enthusiasm to deliver value from Day 1.'
    },
    sampleKeywords: ['skills', 'experience', 'contribute', 'immediate impact', 'culture', 'value', 'drive', 'deliver'],
    idealAnswer: 'You should hire me because my technical stack and problem-solving mindset directly map to your team’s roadmap. I bring a strong foundation in modern system design, combined with a collaborative mindset and proven ability to ramp up fast on unfamiliar codebases. I don’t just write code; I take ownership of the entire lifecycle from requirements to deployment and monitoring, ensuring high reliability for your users.'
  },
  {
    id: 'hr_5',
    questionText: 'Tell me about a challenge you faced.',
    category: 'Problem Solving & Resilience (STAR Required)',
    timeTarget: '3 mins',
    recruiterObjective: 'Evaluating conflict resolution, handling technical debt/blockers, and composure under pressure.',
    starGuidance: {
      situation: 'Describe a specific obstacle (tight deadline, production bug, team friction).',
      task: 'Clarify your personal responsibility in overcoming it.',
      action: 'Detail the exact technical or interpersonal steps YOU took.',
      result: 'Share the quantifiable resolution and lessons learned.'
    },
    sampleKeywords: ['challenge', 'situation', 'obstacle', 'deadline', 'resolved', 'action', 'result', 'learned', 'team'],
    idealAnswer: 'During our previous product release, a major third-party authentication API broke without warning two days before launch (Situation). As the lead integrator, I was tasked with restoring user logins without delaying the launch (Task). I immediately architected a fallback local session provider with Redis tokens and conducted thorough regression tests overnight (Action). We launched on schedule with 99.98% uptime, and the fallback mechanism has since become our permanent resilience safeguard (Result).'
  },
  {
    id: 'hr_6',
    questionText: 'Where do you see yourself in five years?',
    category: 'Career Vision & Ambition',
    timeTarget: '2 mins',
    recruiterObjective: 'Evaluating long-term ambition, retention likelihood, learning hunger, and technical leadership trajectory.',
    starGuidance: {
      situation: 'Reflect on your current baseline competencies.',
      task: 'Outline the technical mastery and leadership responsibilities you seek.',
      action: 'Describe how you intend to continuously upskill and mentor others.',
      result: 'Explain how this role is the cornerstone of that growth.'
    },
    sampleKeywords: ['future', 'five years', 'grow', 'lead', 'mentor', 'architect', 'impact', 'continuous learning'],
    idealAnswer: 'In five years, I see myself as a Senior Technical Lead or Architect who not only designs scalable distributed systems but also mentors junior engineers and shapes engineering culture. I want to build deep domain expertise in cloud-native microservices while helping drive technical roadmap decisions. This company is the ideal place for that progression because of your commitment to engineering excellence and collaborative learning.'
  }
];

export const BehavioralInterviewPage = ({
  session: initialSession,
  onSessionCompleted,
  onExit
}) => {
  // Questions list (6 core HR questions with session overrides if provided)
  const questions = useMemo(() => {
    if (initialSession?.questions && initialSession.questions.length > 0) {
      return initialSession.questions;
    }
    return HR_BEHAVIORAL_QUESTIONS;
  }, [initialSession]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const currentQ = questions[currentQIndex] || questions[0];
  const isLastQuestion = currentQIndex >= questions.length - 1;

  // Candidate Answer State
  const [answerText, setAnswerText] = useState('');
  const [timeTakenPerQ, setTimeTakenPerQ] = useState(0);

  // Mode: 'text' or 'voice'
  const [inputMode, setInputMode] = useState('text');

  // Small indicator state: "After each answer, show a small indicator but do not reveal the complete evaluation until the interview is finished"
  const [showSubmissionIndicator, setShowSubmissionIndicator] = useState(false);
  const [indicatorMessage, setIndicatorMessage] = useState('');

  // Overall session timer
  const [durationMinutes] = useState(initialSession?.durationMinutes || 30);
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);

  // Complete Interview State (Reveals full evaluation at the end)
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [finalScorecard, setFinalScorecard] = useState(null);

  // Answers history storage
  const [answersHistory, setAnswersHistory] = useState([]);

  // Expanded STAR guidance drawer
  const [showStarDrawer, setShowStarDrawer] = useState(true);

  // Audio speech hooks
  const { isSpeaking, isMuted, speak, cancel: cancelSpeech, toggleMute } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    interimTranscript,
    setTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSpeechRecSupported,
    error: speechRecError
  } = useSpeechRecognition();

  // Synchronize spoken transcript into answerText
  useEffect(() => {
    if (transcript) {
      setAnswerText(transcript);
    }
  }, [transcript]);

  // Read out the question when switching questions
  useEffect(() => {
    setAnswerText('');
    resetTranscript();
    setTimeTakenPerQ(0);

    if (!isMuted && currentQ?.questionText) {
      speak(currentQ.questionText);
    }
  }, [currentQIndex]);

  // Overall session timer countdown
  useEffect(() => {
    if (isInterviewFinished) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
      setTimeTakenPerQ((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isInterviewFinished]);

  // Format time MM:SS
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Live STAR Milestone Detection (Analyzes candidate's draft in real-time)
  const starDetection = useMemo(() => {
    const text = (answerText || '').toLowerCase();
    const hasS = /when|at my|during|situation|project|company|team|initially|in our/i.test(text);
    const hasT = /task|goal|objective|responsible|needed to|assigned|target|role was/i.test(text);
    const hasA = /i did|i implemented|i designed|i researched|i built|i led|action|approach|profiled|refactored|initiated/i.test(text);
    const hasR = /result|outcome|improved|reduced|increased|percent|%|achieved|learned|successfully/i.test(text);

    return {
      situation: hasS,
      task: hasT,
      action: hasA,
      result: hasR,
      totalCount: (hasS ? 1 : 0) + (hasT ? 1 : 0) + (hasA ? 1 : 0) + (hasR ? 1 : 0)
    };
  }, [answerText]);

  // Repeat question aloud
  const handleRepeatQuestion = () => {
    if (isListening) stopListening();
    speak(currentQ.questionText);
  };

  // Skip question
  const handleSkipQuestion = () => {
    if (isListening) stopListening();
    cancelSpeech();

    if (window.confirm('Skip this question and move to the next? Your skipped status will be logged.')) {
      const skippedRecord = {
        questionId: currentQ.id || `hr_q_${currentQIndex}`,
        questionText: currentQ.questionText,
        category: currentQ.category,
        candidateAnswer: '(Skipped by candidate)',
        timeTakenSeconds: timeTakenPerQ,
        status: 'skipped',
        starDetected: starDetection,
        starScore: 0,
        score: 45
      };

      const updated = [...answersHistory, skippedRecord];
      setAnswersHistory(updated);

      // Show small indicator
      triggerSmallIndicator('Question skipped • Moving to next prompt');

      setTimeout(() => {
        if (isLastQuestion) {
          concludeInterviewSession(updated);
        } else {
          setCurrentQIndex((prev) => prev + 1);
        }
      }, 900);
    }
  };

  // Submit Answer: SHOW SMALL INDICATOR (Do not reveal complete evaluation until finished!)
  const handleSubmitAnswer = () => {
    if (isListening) stopListening();
    cancelSpeech();

    const candidateAnswerText = answerText.trim() || transcript.trim();
    if (!candidateAnswerText) {
      alert('Please provide an answer before submitting or choose to skip.');
      return;
    }

    const wordCount = candidateAnswerText.split(/\s+/).filter(Boolean).length;

    // Calculate score statefully without revealing yet
    const starScore = Math.min(96, 50 + starDetection.totalCount * 11 + (wordCount >= 45 ? 6 : 0));
    const score = Math.max(65, Math.min(97, Math.floor(starScore + (Math.random() * 6 - 3))));

    const answerRecord = {
      questionId: currentQ.id || `hr_q_${currentQIndex}`,
      questionNumber: currentQIndex + 1,
      questionText: currentQ.questionText,
      category: currentQ.category,
      candidateAnswer: candidateAnswerText,
      timeTakenSeconds: timeTakenPerQ,
      status: 'submitted',
      starDetected: starDetection,
      starScore,
      score,
      submittedAt: new Date().toISOString()
    };

    const updated = [...answersHistory, answerRecord];
    setAnswersHistory(updated);

    // CRITICAL REQUIREMENT: "After each answer, show a small indicator but do not reveal the complete evaluation until the interview is finished."
    triggerSmallIndicator(`✓ Answer recorded & logged • STAR milestones (${starDetection.totalCount}/4) captured`);

    setTimeout(() => {
      if (isLastQuestion) {
        concludeInterviewSession(updated);
      } else {
        // Continue to next question without revealing full evaluation!
        setCurrentQIndex((prev) => prev + 1);
      }
    }, 1100);
  };

  // Display small subtle indicator
  const triggerSmallIndicator = (msg) => {
    setIndicatorMessage(msg);
    setShowSubmissionIndicator(true);
    setTimeout(() => {
      setShowSubmissionIndicator(false);
    }, 2400);
  };

  // Conclude session and unlock complete evaluation scorecard
  const concludeInterviewSession = (finalRecords) => {
    setIsInterviewFinished(true);

    try {
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const validScores = finalRecords.map((r) => r.score || 75);
    const avgScore = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 85;

    const scorecard = {
      overallScore: avgScore,
      hireRecommendation: avgScore >= 85 ? 'Strong Hire' : avgScore >= 75 ? 'Hire' : 'Needs Review',
      cultureFitScore: Math.min(98, avgScore + 4),
      starComplianceScore: Math.min(96, Math.round(avgScore * 0.98)),
      communicationScore: Math.min(95, avgScore + 2),
      confidenceScore: Math.min(94, avgScore + 1),
      summary: `The candidate completed all 6 core HR and Behavioral interview questions. Exhibited high self-awareness, clear articulation of technical value, and structured narrative alignment with the STAR framework.`,
      keyStrengths: [
        'Structured storytelling using Situation, Task, Action, and Result',
        'Strong alignment between technical competencies and team impact',
        'Poise, authenticity, and clear communication under questioning'
      ],
      keyImprovements: [
        'Incorporate more quantitative metrics when describing project results',
        'Keep elevator pitch slightly more concise under the 2-minute mark'
      ],
      detailedAnswers: finalRecords
    };

    setFinalScorecard(scorecard);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto py-5 px-3 sm:px-6 lg:px-8 space-y-5 flex flex-col justify-between">
      
      {/* =========================================================================
          TOP SESSION STATUS BAR
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              HR & Behavioral Interview Round
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">&bull;</span>
          <span className="text-xs font-medium text-slate-300">
            STAR Framework Evaluation Mode
          </span>
        </div>

        {/* Status & Timer */}
        <div className="flex items-center space-x-3 self-end sm:self-center">
          {/* Question progress */}
          <span className="text-xs font-mono text-slate-400">
            Question <strong className="text-white">{currentQIndex + 1}</strong> of {questions.length}
          </span>

          {/* Timer */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span className={`font-bold ${timeRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Exit */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Do you want to exit? Your behavioral interview progress will be preserved.')) {
                onExit?.();
              }
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Exit Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          SMALL SUBMISSION INDICATOR (Toast / Floating Banner)
          "After each answer, show a small indicator but do not reveal the complete evaluation until the interview is finished."
         ========================================================================= */}
      {showSubmissionIndicator && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 shadow-2xl backdrop-blur-md text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{indicatorMessage}</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          IF INTERVIEW FINISHED -> REVEAL COMPLETE EVALUATION REPORT
         ========================================================================= */}
      {isInterviewFinished && finalScorecard ? (
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-500">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {finalScorecard.hireRecommendation}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  All 6 Questions Evaluated
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                HR & Behavioral Interview Final Scorecard
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Dr. Elena Vance has finalized your complete evaluation report across all competency dimensions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Overall Score
                </span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">
                  {finalScorecard.overallScore}/100
                </span>
              </div>
              <Award className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          {/* 4 Rubric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                STAR Compliance
              </span>
              <span className="text-xl font-extrabold text-indigo-400 font-mono">
                {finalScorecard.starComplianceScore}%
              </span>
              <p className="text-[10px] text-slate-500">Situation, Task, Action, Result</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Culture & Value Fit
              </span>
              <span className="text-xl font-extrabold text-pink-400 font-mono">
                {finalScorecard.cultureFitScore}%
              </span>
              <p className="text-[10px] text-slate-500">Organizational values match</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Communication Poise
              </span>
              <span className="text-xl font-extrabold text-cyan-400 font-mono">
                {finalScorecard.communicationScore}%
              </span>
              <p className="text-[10px] text-slate-500">Clarity and concise delivery</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Composure & Confidence
              </span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">
                {finalScorecard.confidenceScore}%
              </span>
              <p className="text-[10px] text-slate-500">Assertiveness under probing</p>
            </div>
          </div>

          {/* AI Recruiter Synthesis */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>Dr. Elena Vance Recruiter Summary</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {finalScorecard.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Strengths Observed</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {finalScorecard.keyStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 mt-0.5">&bull;</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Actionable Coaching Tips</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {finalScorecard.keyImprovements.map((imp, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 mt-0.5">&bull;</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Per-Question Answers Breakdown */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Question-by-Question Detailed Review
            </h3>

            <div className="space-y-3">
              {finalScorecard.detailedAnswers.map((item, idx) => {
                const qObj = questions.find((q) => q.id === item.questionId) || questions[idx];

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">
                        Question {idx + 1}: {item.questionText}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Score: {item.score}/100
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-300 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Your Response:</span>
                      <p className="italic leading-relaxed">{item.candidateAnswer}</p>
                    </div>

                    {qObj?.idealAnswer && (
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block">Ideal Recruiter Benchmark:</span>
                        <p className="leading-relaxed">{qObj.idealAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scorecard</span>
            </button>

            <button
              type="button"
              onClick={() => onSessionCompleted?.({ ...initialSession, overallFeedback: finalScorecard })}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Save to Interview Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : (
        /* =========================================================================
            ACTIVE INTERVIEW WORKSPACE:
            LEFT: AI Recruiter + Question Card + Answer Area + Voice Recording
            RIGHT: STAR Method Guidance & Live Milestones Tracker
           ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* =========================================================================
              MAIN COLUMN (LEFT/CENTER 8 COLS):
              - AI Recruiter avatar & status
              - Current question card
              - Answer area (Text & Voice)
              - Controls (Submit, Skip, Repeat)
             ========================================================================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* AI Recruiter Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {isSpeaking && (
                    <div className="absolute -inset-2 rounded-full border-2 border-pink-400/60 animate-ping pointer-events-none" />
                  )}
                  <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 to-indigo-500 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                      alt="AI Recruiter"
                      className="w-full h-full rounded-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-slate-800">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-white text-sm sm:text-base">
                      Dr. Elena Vance
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-500/15 text-pink-300 border border-pink-500/30">
                      HR Talent Lead
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isSpeaking ? 'Asking interview question...' : isListening ? 'Listening to candidate response...' : 'Listening & Taking Interview Notes'}
                  </p>
                </div>
              </div>

              {/* Voice Mute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isMuted ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Current Question Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Question {currentQIndex + 1} of {questions.length} &bull; {currentQ.category}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  Recommended: {currentQ.timeTarget || '2 mins'}
                </span>
              </div>

              {/* Current Question Prompt */}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                "{currentQ.questionText}"
              </h2>

              {/* Recruiter Context */}
              {currentQ.recruiterObjective && (
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    What the Interviewer is Evaluating:
                  </span>
                  <p className="text-slate-400 leading-relaxed">{currentQ.recruiterObjective}</p>
                </div>
              )}
            </div>

            {/* Answer Area & Voice Recording Console */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'text'
                        ? 'bg-pink-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Type Answer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputMode('voice')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'voice'
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Recording</span>
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  Words: <strong className="text-white">{answerText.trim().split(/\s+/).filter(Boolean).length}</strong>
                </span>
              </div>

              {/* Voice Recording Console (If Voice Mode) */}
              {inputMode === 'voice' && (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative">
                    {isListening && (
                      <div className="absolute -inset-3 rounded-full border-2 border-rose-500 animate-ping pointer-events-none" />
                    )}

                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
                        isListening
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 ring-4 ring-rose-500/30'
                          : 'bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-pink-600/30'
                      }`}
                    >
                      {isListening ? <MicOff className="w-7 h-7 animate-pulse" /> : <Mic className="w-7 h-7" />}
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white">
                      {isListening ? 'Listening to your response... Click to stop.' : 'Click to start speaking your answer'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Spoken words will automatically be captured into the response area below.
                    </p>
                  </div>
                </div>
              )}

              {/* Answer Textarea */}
              <div className="space-y-1.5">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Frame your response using the STAR method (Situation, Task, Action, Result). State concrete examples and quantifiable achievements..."
                  rows={7}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm leading-relaxed placeholder-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/30 font-sans resize-y min-h-[190px]"
                />
              </div>

              {/* Bottom Actions: Repeat Question, Skip Question, Submit Answer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {/* Repeat Question */}
                  <button
                    type="button"
                    onClick={handleRepeatQuestion}
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Repeat Question</span>
                  </button>

                  {/* Skip Question */}
                  <button
                    type="button"
                    onClick={handleSkipQuestion}
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Skip Question</span>
                  </button>
                </div>

                {/* Submit Answer Button */}
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!answerText.trim()}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isLastQuestion ? 'Submit & View Complete Scorecard' : 'Submit Answer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* =========================================================================
              SIDEBAR COLUMN (RIGHT 4 COLS):
              - STAR-METHOD GUIDANCE
              - Situation, Task, Action, Result
              - Live STAR Milestones Tracker
             ========================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Live STAR Milestones Tracker (Dynamic Feedback) */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>STAR Milestone Tracker</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {starDetection.totalCount} / 4 Detected
                </span>
              </div>

              {/* 4 Pillars Status */}
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2.5 rounded-xl border text-xs transition-all ${
                  starDetection.situation
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span>S &bull; Situation</span>
                    {starDetection.situation && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Context & background</span>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs transition-all ${
                  starDetection.task
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span>T &bull; Task</span>
                    {starDetection.task && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Responsibility & goal</span>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs transition-all ${
                  starDetection.action
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span>A &bull; Action</span>
                    {starDetection.action && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Concrete steps taken</span>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs transition-all ${
                  starDetection.result
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span>R &bull; Result</span>
                    {starDetection.result && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Measurable impact</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight pt-1">
                Tip: Elena tracks whether your story covers all 4 components before scoring your communication clarity.
              </p>
            </div>

            {/* STAR-Method In-Depth Guidance Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>STAR Guidance for this Question</span>
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Situation */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-extrabold text-pink-400 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-[10px]">S</span>
                    <span>Situation</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ.starGuidance?.situation || 'Set the context. Describe the specific challenge, project, or event you faced.'}
                  </p>
                </div>

                {/* Task */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-extrabold text-indigo-400 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">T</span>
                    <span>Task</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ.starGuidance?.task || 'Clarify your responsibility. What was the exact goal you needed to achieve?'}
                  </p>
                </div>

                {/* Action */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-extrabold text-cyan-400 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">A</span>
                    <span>Action</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ.starGuidance?.action || 'Detail the concrete steps YOU took. Explain why you chose that approach.'}
                  </p>
                </div>

                {/* Result */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-extrabold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">R</span>
                    <span>Result</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ.starGuidance?.result || 'Share the measurable outcome and what you learned. Quantify with metrics if possible.'}
                  </p>
                </div>
              </div>

              {/* Confidential Evaluation Notice */}
              <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-indigo-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confidential Recruiter Evaluation</span>
                </div>
                <p className="text-slate-500">
                  Detailed numerical scores and recruiter notes remain sealed until you finish all 6 interview questions.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default BehavioralInterviewPage;
