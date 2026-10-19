import React from 'react';
import { History, ArrowRight, Play, CheckCircle2, Clock, Award } from 'lucide-react';

export const RecentInterviews = ({ sessions = [], onViewSession, onStartNew }) => {
  if (sessions.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">No interview sessions yet</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Start your first AI mock interview to receive real-time question prompts and instant rubric evaluations.
        </p>
        <button
          onClick={onStartNew}
          className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start First Interview</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Recent Mock Interviews</span>
        </h3>
      </div>

      <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {sessions.slice(0, 5).map((session) => {
          const score = session.overallFeedback?.overallScore || 0;
          const isCompleted = session.status === 'completed';
          const durationMins = Math.round((session.totalDurationSeconds || 300) / 60);

          return (
            <div
              key={session._id || session.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">{session.title}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-0.5">
                  <span>Role: <strong className="text-slate-300">{session.role}</strong></span>
                  <span>&bull;</span>
                  <span className="capitalize">Mode: {session.interviewMode}</span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{durationMins} mins</span>
                  </span>
                  <span>&bull;</span>
                  <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-center">
                {isCompleted ? (
                  <div className="text-right">
                    <span className="block text-lg font-extrabold text-indigo-400">
                      {score}/100
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {session.overallFeedback?.recommendation || 'Score'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400 font-medium">
                    Question {session.currentQuestionIndex + 1} of {session.questions?.length || 3}
                  </span>
                )}

                <button
                  onClick={() => onViewSession(session)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-transparent transition-all"
                >
                  <span>{isCompleted ? 'View Report' : 'Resume'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentInterviews;
