import { Sparkles, Heart, Shield, Cpu, ExternalLink } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  const scrollTo = (sectionId) => {
    if (setActivePage) {
      setActivePage('landing');
    }
    setTimeout(() => {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <div
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => scrollTo('top')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Interview<span className="text-indigo-400">AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier AI-powered interview simulator built to empower software engineers, college students, and career changers with realistic interview practice and instant actionable feedback.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI Evaluation Engine Active</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 rounded-full px-3 py-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Web Speech & Heuristics</span>
              </div>
            </div>
          </div>

          {/* Landing Sections Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3.5">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => scrollTo('features')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('interview-types')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Interview Types
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('feedback-preview')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  AI Feedback Report
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('pricing')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Interview Types */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3.5">Interview Types</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => scrollTo('interview-types')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Technical Architecture
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('interview-types')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  HR Screening
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('interview-types')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Behavioral (STAR Method)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('interview-types')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Live Coding Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('interview-types')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  System Design & Scale
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3.5">Get Started</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage?.('register')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Create Free Account
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage?.('login')} className="hover:text-indigo-400 transition-colors cursor-pointer text-left">
                  Login to Account
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('top')} className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer text-left flex items-center space-x-1 font-medium">
                  <span>Start Free Interview</span>
                  <span>&rarr;</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} InterviewAI Platform. Built for ambitious engineers.</p>
          <div className="mt-3 sm:mt-0 flex items-center space-x-4">
            <button
              onClick={() => scrollTo('top')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
