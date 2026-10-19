import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Brain,
  ShieldCheck,
  Star,
  Volume2,
  Check
} from 'lucide-react';

export const LoginPage = ({ setActivePage }) => {
  const { login, guestLogin } = useAuth();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & Feedback State
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Email format validator
  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Validate form before submission
  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    // Empty email check
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      valid = false;
    } else if (!isValidEmail(email)) {
      // Invalid email check
      setEmailError('Please enter a valid email address (e.g., name@example.com)');
      valid = false;
    }

    // Empty password check
    if (!password) {
      setPasswordError('Please enter your password');
      valid = false;
    }

    return valid;
  };

  // Handle standard login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setLoginError('');

    try {
      await login(email.trim(), password);
      setActivePage('dashboard');
    } catch (err) {
      setLoginError(
        err.message || 'Invalid email or password. Please verify your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle 1-Click Guest Demo Login
  const handleGuestLogin = async () => {
    setLoginError('');
    setEmailError('');
    setPasswordError('');
    setLoading(true);

    try {
      await guestLogin();
      setActivePage('dashboard');
    } catch (err) {
      setLoginError(err.message || 'Unable to start demo session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login Simulation
  const handleGoogleLogin = async () => {
    setLoginError('');
    setGoogleLoading(true);

    // Simulate Google OAuth handshake with guest account
    setTimeout(async () => {
      try {
        await guestLogin();
        setActivePage('dashboard');
      } catch (err) {
        setLoginError('Google sign-in encountered an issue. Try standard email login or instant demo.');
      } finally {
        setGoogleLoading(false);
      }
    }, 800);
  };

  // Handle Forgot Password modal submission
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !isValidEmail(forgotEmail)) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotPasswordModal(false);
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* =========================================================================
            LEFT COLUMN: LOGIN FORM PANEL
           ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Brand Logo & Header */}
            <div className="space-y-3">
              <div
                className="flex items-center space-x-2.5 cursor-pointer w-fit group"
                onClick={() => setActivePage('landing')}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                    Interview<span className="text-indigo-400">AI</span>
                  </span>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-indigo-400/80 -mt-1">
                    AI Interview Simulator
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Enter your credentials to continue your AI mock interview practice.
                </p>
              </div>
            </div>

            {/* Login Failure Alert Banner */}
            {loginError && (
              <div
                role="alert"
                className="flex items-start space-x-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in slide-in-from-top-1"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-rose-200">Authentication Failed</p>
                  <p className="text-rose-300/90 leading-relaxed">{loginError}</p>
                </div>
              </div>
            )}

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-950 hover:bg-slate-800/80 text-slate-200 border border-slate-700/80 hover:border-slate-600 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Or sign in with email
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${
                      emailError ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onBlur={() => {
                      if (!email.trim()) {
                        setEmailError('Please enter your email address');
                      } else if (!isValidEmail(email)) {
                        setEmailError('Please enter a valid email address (e.g., name@example.com)');
                      }
                    }}
                    placeholder="name@company.com"
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 transition-all ${
                      emailError
                        ? 'bg-rose-950/20 border border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                        : 'bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-rose-400 flex items-center space-x-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModal(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${
                      passwordError ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    onBlur={() => {
                      if (!password) {
                        setPasswordError('Please enter your password');
                      }
                    }}
                    placeholder="••••••••••••"
                    disabled={loading}
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 transition-all ${
                      passwordError
                        ? 'bg-rose-950/20 border border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                        : 'bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />

                  {/* Show/Hide Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-rose-400 flex items-center space-x-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              {/* Login Button with Loading State */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to InterviewAI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Instant Demo Shortcut Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-2">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-indigo-300 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Fast Evaluation Mode</span>
              </div>
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>⚡ 1-Click Instant Demo Login (Alex Chen)</span>
              </button>
            </div>
          </div>

          {/* Link to Sign Up */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setActivePage('register')}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Sign Up for Free &rarr;
            </button>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DESKTOP VISUAL PANEL
            "Your next interview starts here."
           ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950 p-10 flex-col justify-between border-l border-slate-800 relative overflow-hidden">
          {/* Ambient decorative glow */}
          <div className="absolute top-10 right-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tag & Visual Headline */}
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Realistic AI Bar Raiser Simulation</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your next interview starts here.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Practice real-world technical architecture, live coding sandboxes, and STAR behavioral interviews with instant multi-pillar scorecards.
            </p>
          </div>

          {/* Simulated Active AI Session Mockup Card */}
          <div className="my-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 relative z-10 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-slate-200">Active Simulation: SDE Loop</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-indigo-300 font-mono">
                Round 2 of 4
              </span>
            </div>

            {/* AI Interviewer prompt snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                  AI
                </div>
                <span className="text-[11px] font-semibold text-indigo-300">Dr. Elena Vance</span>
              </div>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                "How would you design an idempotent payment processing API to handle network retries without double charging?"
              </p>
            </div>

            {/* Real-time score snippet */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Rubric Score: 95/100</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                Strong Hire
              </span>
            </div>
          </div>

          {/* Trust and Social Proof Bottom Footer */}
          <div className="space-y-3 relative z-10 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center space-x-1 text-amber-400 text-xs">
              {'★'.repeat(5)}
              <span className="text-slate-300 font-bold pl-1.5">4.9 / 5</span>
              <span className="text-slate-500 font-normal">(15,000+ candidates)</span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              "Felt exactly like my AWS bar raiser. Helped me identify weak STAR responses before the real loop."
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enterprise-grade encryption & privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FORGOT PASSWORD MODAL
         ========================================================================= */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Reset Password</h3>
              <button
                type="button"
                onClick={() => setForgotPasswordModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your account email address and we'll send you instructions to reset your password.
            </p>

            {forgotSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Password reset instructions sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
