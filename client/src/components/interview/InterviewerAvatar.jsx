import React from 'react';
import { Volume2, VolumeX, Mic, Sparkles, Loader2 } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

export const InterviewerAvatar = ({
  isSpeaking = false,
  isListening = false,
  isEvaluating = false,
  isMuted = false,
  onToggleMute,
  onSpeakQuestion,
  questionText = '',
}) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background ambient glow effect */}
      <div
        className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          isSpeaking
            ? 'bg-indigo-500/20 opacity-100'
            : isListening
            ? 'bg-cyan-500/20 opacity-100'
            : 'bg-indigo-500/5 opacity-50'
        }`}
      />

      {/* Avatar portrait with animated outer rings */}
      <div className="relative mb-4">
        {/* Animated pulsating ring when speaking */}
        {isSpeaking && (
          <div className="absolute -inset-3 rounded-full border-2 border-indigo-500/50 animate-ping pointer-events-none" />
        )}
        {/* Animated pulsating ring when listening */}
        {isListening && (
          <div className="absolute -inset-3 rounded-full border-2 border-cyan-400/60 animate-pulse pointer-events-none" />
        )}

        <div
          className={`w-28 h-28 rounded-full p-1 bg-gradient-to-tr transition-all duration-300 relative ${
            isSpeaking
              ? 'from-indigo-500 via-purple-500 to-cyan-400 shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-500/20'
              : isListening
              ? 'from-cyan-400 via-teal-500 to-indigo-500 shadow-lg shadow-cyan-500/40 ring-4 ring-cyan-500/20'
              : isEvaluating
              ? 'from-amber-400 to-orange-500 ring-4 ring-amber-500/20'
              : 'from-slate-700 to-slate-800'
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
            alt="AI Interviewer"
            className="w-full h-full rounded-full object-cover object-top filter contrast-105"
          />
        </div>

        {/* Status indicator bubble */}
        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border-2 border-slate-800 shadow">
          {isEvaluating ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : isSpeaking ? (
            <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
          ) : isListening ? (
            <Mic className="w-4 h-4 text-cyan-400 animate-bounce" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-400" />
          )}
        </div>
      </div>

      {/* Interviewer identity info */}
      <div className="text-center mb-3">
        <h3 className="font-bold text-white text-base tracking-tight">Dr. Elena Vance</h3>
        <p className="text-xs text-indigo-400 font-medium">Principal AI Interviewer &bull; Tech Staff</p>
      </div>

      {/* Live State Badge */}
      <div className="mb-4">
        {isEvaluating ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyzing your response...</span>
          </span>
        ) : isSpeaking ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 animate-pulse">
            <Volume2 className="w-3 h-3" />
            <span>Elena is speaking question...</span>
          </span>
        ) : isListening ? (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
            <Mic className="w-3 h-3 text-cyan-400" />
            <span>Listening to your answer...</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Awaiting your answer</span>
          </span>
        )}
      </div>

      {/* Audio Waveform Visualizer */}
      <div className="w-full mb-4">
        <AudioVisualizer isActive={isSpeaking || isListening} />
      </div>

      {/* Voice Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSpeakQuestion}
          disabled={isSpeaking}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors disabled:opacity-50"
          title="Listen to question again"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? 'Reading...' : 'Replay Question'}</span>
        </button>

        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
            isMuted
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700'
          }`}
          title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default InterviewerAvatar;
