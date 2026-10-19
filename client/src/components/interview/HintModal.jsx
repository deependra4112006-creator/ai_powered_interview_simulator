import React from 'react';
import { Lightbulb, X, HelpCircle } from 'lucide-react';

export const HintModal = ({ isOpen, onClose, hint, hintNumber = 1, totalHints = 3 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Interviewer Hint</h3>
            <p className="text-xs text-amber-400 font-medium">
              Hint #{hintNumber} of {totalHints}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-200 mb-5">
          {hint || 'Focus on the underlying algorithmic trade-offs and edge case constraints.'}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>* Tip: Asking for hints in real interviews shows collaborative communication!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
