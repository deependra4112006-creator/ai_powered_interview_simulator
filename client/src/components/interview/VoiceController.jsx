import React from 'react';
import { Mic, MicOff, AlertCircle, Edit3, CheckCircle2 } from 'lucide-react';

export const VoiceController = ({
  isListening = false,
  transcript = '',
  interimTranscript = '',
  onStartListening,
  onStopListening,
  onTranscriptChange,
  isSupported = true,
  error = null,
}) => {
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Voice Answer Mode
          </span>
          {isListening && (
            <span className="flex items-center space-x-1 text-xs text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Recording Speech...</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Words: <strong className="text-slate-200">{wordCount}</strong></span>
        </div>
      </div>

      {/* Big Interactive Mic Action Button */}
      <div className="flex flex-col items-center justify-center py-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
        <button
          type="button"
          onClick={isListening ? onStopListening : onStartListening}
          className={`relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 ring-4 ring-rose-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 ring-4 ring-indigo-500/20 hover:scale-105'
          }`}
          title={isListening ? 'Click to Stop Speaking' : 'Click to Speak Answer'}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 animate-pulse" />
          ) : (
            <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
          )}

          {/* Pulse ring animation */}
          {isListening && (
            <span className="absolute -inset-2 rounded-full border-2 border-rose-500 animate-ping pointer-events-none" />
          )}
        </button>

        <p className="mt-3 text-xs font-medium text-slate-300">
          {isListening ? 'Listening to your microphone... Click when finished.' : 'Click to speak your answer'}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Speak clearly into your microphone as if in a live video interview.
        </p>
      </div>

      {/* Error alert if mic denied or unsupported */}
      {error && (
        <div className="flex items-start space-x-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Microphone Notice</p>
            <p className="text-rose-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Real-time Editable Transcript */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center space-x-1.5 font-medium">
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Captured Transcript (Editable):</span>
          </label>
          <span className="text-[11px] text-slate-500">
            You can edit text before submitting
          </span>
        </div>

        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Your spoken words will appear here in real-time... You can also type or edit directly."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm placeholder-slate-500 resize-y transition-colors"
          />

          {interimTranscript && (
            <div className="absolute bottom-2 left-4 text-xs text-cyan-400/80 italic pointer-events-none">
              ...{interimTranscript}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceController;
