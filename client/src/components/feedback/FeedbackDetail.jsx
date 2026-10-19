import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, BookOpen, User, Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export const FeedbackDetail = ({
  question,
  evaluation,
  candidateAnswer,
  candidateCode,
  idealAnswer,
  questionNumber = 1,
}) => {
  const [copied, setCopied] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);

  const handleCopyIdeal = () => {
    if (idealAnswer) {
      navigator.clipboard.writeText(idealAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strengths = evaluation?.strengths || ['Good foundational grasp of the problem'];
  const improvements = evaluation?.improvements || ['Add concrete metrics and edge-case handling'];
  const feedbackText = evaluation?.feedbackText || 'Good start. Incorporating the suggested structural improvements will elevate this answer.';

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header with question prompt and individual score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Question #{questionNumber} Review
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">
            {question?.questionText || 'Interview Question'}
          </h4>
        </div>

        {evaluation?.score !== undefined && (
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Question Score:</span>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {evaluation.score}/100
            </span>
          </div>
        )}
      </div>

      {/* AI Qualitative Feedback Paragraph */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">AI Evaluation Analysis</h5>
          <p className="text-sm text-slate-200 mt-1 leading-relaxed">{feedbackText}</p>
        </div>
      </div>

      {/* Strengths and Improvement Areas Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">Key Strengths</h5>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {strengths.map((s, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h5 className="text-xs font-bold uppercase tracking-wider">Areas for Growth</h5>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Candidate Answer Submitted */}
      {(candidateAnswer || candidateCode) && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>Your Submitted Answer:</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
            {candidateCode ? candidateCode : candidateAnswer}
          </div>
        </div>
      )}

      {/* Ideal Model Answer Accordion */}
      {idealAnswer && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden text-xs">
          <button
            onClick={() => setShowIdeal(!showIdeal)}
            className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 text-slate-200 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">
                View Top-Scoring Model Answer Reference
              </span>
            </div>
            {showIdeal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showIdeal && (
            <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Model answer curated for {question?.role || 'Top Tech'} interviews:
                </span>
                <button
                  onClick={handleCopyIdeal}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {idealAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackDetail;
