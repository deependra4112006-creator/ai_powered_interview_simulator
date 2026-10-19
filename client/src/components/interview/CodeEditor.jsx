import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Code, Terminal, Loader2 } from 'lucide-react';
import api from '../../services/api';

export const CodeEditor = ({
  code = '',
  onChange,
  starterCode = '',
  testCases = [],
  language = 'javascript',
  onLanguageChange,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'tests'

  const lineCount = Math.max(12, code.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('tests');
    try {
      const res = await api.interviews.runCode({
        code,
        language,
        testCases,
      });
      if (res.success && res.result) {
        setTestResults(res.result);
      }
    } catch (err) {
      setTestResults({
        success: false,
        output: `Execution error: ${err.message}`,
        testResults: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset code to the original starter template?')) {
      onChange(starterCode || '');
      setTestResults(null);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="java">Java 17</option>
            <option value="cpp">C++ 20</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Running...' : 'Run Test Cases'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Results Tabs Header */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-4 text-xs">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'code'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Solution Code</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'tests'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Test Runner</span>
          {testResults && (
            <span
              className={`w-2 h-2 rounded-full ${
                testResults.passed ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
          )}
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'code' ? (
        <div className="flex flex-1 min-h-[340px] max-h-[480px] bg-slate-950 overflow-auto font-mono text-xs sm:text-sm">
          {/* Line Numbers */}
          <div className="select-none py-3 px-3 text-right bg-slate-950/80 text-slate-600 border-r border-slate-800/80 font-mono text-xs leading-6">
            {lineNumbers.map((num) => (
              <div key={num}>{num}</div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            spellCheck="false"
            className="flex-1 w-full p-3 bg-transparent text-emerald-300 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none focus:ring-0 placeholder-slate-600"
            placeholder="// Write your solution function here..."
          />
        </div>
      ) : (
        /* Test Runner Output View */
        <div className="p-4 bg-slate-950 min-h-[340px] max-h-[480px] overflow-auto space-y-4 text-xs font-mono">
          {!testResults ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 space-y-2">
              <Terminal className="w-8 h-8 opacity-40" />
              <p>Click "Run Test Cases" to compile and execute your code.</p>
            </div>
          ) : (
            <>
              {/* Summary Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  testResults.passed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {testResults.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  <div>
                    <span className="font-bold text-sm">
                      {testResults.passed ? 'All Test Cases Passed!' : 'Some Test Cases Failed'}
                    </span>
                    <p className="text-[11px] opacity-80 mt-0.5">{testResults.output}</p>
                  </div>
                </div>
              </div>

              {/* Individual Test Cases */}
              <div className="space-y-3">
                <h4 className="text-slate-400 uppercase font-semibold tracking-wider text-[11px]">
                  Test Case Breakdown:
                </h4>

                {testResults.testResults?.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">
                        {tc.description || `Case #${tc.testCaseIndex}`}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tc.passed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {tc.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block">Input:</span>
                        <code className="text-slate-300">{tc.input}</code>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 block">Expected Output:</span>
                        <code className="text-emerald-400">{tc.expectedOutput}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
