import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Check, Award } from 'lucide-react';

export const StarMethodGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  const starSteps = [
    {
      letter: 'S',
      title: 'Situation',
      desc: 'Set the context. Describe the specific challenge, project, or event you faced.',
      example: '"In our 3rd-year capstone project, our backend API was crashing under peak demo loads..."'
    },
    {
      letter: 'T',
      title: 'Task',
      desc: 'Clarify your responsibility. What was the exact goal you needed to achieve?',
      example: '"My role was to identify the performance bottleneck and optimize response times under 500ms..."'
    },
    {
      letter: 'A',
      title: 'Action',
      desc: 'Detail the concrete steps YOU took. Explain why you chose that approach.',
      example: '"I profiled query execution times, added Redis caching for frequent endpoints, and refactored N+1 queries..."'
    },
    {
      letter: 'R',
      title: 'Result',
      desc: 'Share the measurable outcome and what you learned. Quantify with metrics if possible.',
      example: '"Response times dropped by 70%, server throughput doubled, and our team scored top rank."'
    }
  ];

  return (
    <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/20 overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-indigo-900/20 hover:bg-indigo-900/30 text-indigo-300 font-medium transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>Behavioral Best Practice: STAR Method Guide (Situation, Task, Action, Result)</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-3 bg-slate-900/60 border-t border-indigo-500/10">
          <p className="text-slate-300">
            Top tech recruiters evaluate behavioral answers using the <strong>STAR Framework</strong>. Structure your answer using these 4 milestones for maximum score:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {starSteps.map((step) => (
              <div key={step.letter} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px]">
                    {step.letter}
                  </span>
                  <span className="font-semibold text-white">{step.title}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{step.desc}</p>
                <p className="text-indigo-300/80 italic text-[10px] mt-1">
                  Ex: {step.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StarMethodGuide;
