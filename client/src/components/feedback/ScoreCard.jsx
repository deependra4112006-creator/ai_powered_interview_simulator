import React from 'react';
import { Award, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

export const ScoreCard = ({
  score = 0,
  technicalDepth = 0,
  clarity = 0,
  problemSolving = 0,
  timeEfficiency = 0,
  recommendation = 'Practice Completed',
  title = 'Overall Performance Score',
}) => {
  const getScoreColor = (val) => {
    if (val >= 85) return 'from-emerald-500 to-teal-400 text-emerald-400 border-emerald-500/30';
    if (val >= 70) return 'from-indigo-500 to-cyan-400 text-indigo-400 border-indigo-500/30';
    if (val >= 55) return 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/30';
    return 'from-rose-500 to-orange-400 text-rose-400 border-rose-500/30';
  };

  const getRecBadge = (rec) => {
    if (rec?.includes('Strong')) {
      return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', text: 'Strong Hire' };
    }
    if (rec?.includes('Hire')) {
      return { bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', text: 'Hire' };
    }
    return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', text: rec || 'Further Prep Needed' };
  };

  const badge = getRecBadge(recommendation);

  const metrics = [
    { label: 'Technical Depth', value: technicalDepth || score },
    { label: 'Communication Clarity', value: clarity || score },
    { label: 'Problem Solving', value: problemSolving || score },
    { label: 'Time Efficiency', value: timeEfficiency || 85 },
  ];

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        {/* Score Radial Visual */}
        <div className="flex items-center space-x-5">
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-slate-950 border-4 border-indigo-500/20 shadow-inner">
            <div className="text-center">
              <span className={`text-3xl font-extrabold tracking-tight bg-gradient-to-tr ${getScoreColor(score)} bg-clip-text text-transparent`}>
                {score}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {score >= 85 ? 'Exceptional Readiness' : score >= 70 ? 'Solid Competitive Answer' : 'Developing Potential'}
            </h3>
            <div className="mt-2">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                <Award className="w-3.5 h-3.5" />
                <span>{badge.text}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium truncate">{m.label}</span>
              <span className="font-bold text-slate-200">{m.value}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(5, m.value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreCard;
