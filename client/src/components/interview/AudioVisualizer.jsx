import React from 'react';

export const AudioVisualizer = ({ isActive = false, color = 'indigo' }) => {
  const bars = [14, 28, 42, 20, 36, 48, 24, 38, 18, 44, 30, 16];

  return (
    <div className="flex items-center justify-center space-x-1.5 h-12 px-4 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
      {bars.map((height, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-t from-indigo-500 to-cyan-400 animate-pulse'
              : 'bg-slate-700 h-2'
          }`}
          style={{
            height: isActive ? `${Math.max(8, (height * (0.6 + Math.random() * 0.7)))}px` : '4px',
            animationDelay: `${(i * 0.1).toFixed(1)}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
