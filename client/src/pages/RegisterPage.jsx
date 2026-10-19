import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Briefcase,
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
  Check,
  Award,
  Terminal,
  Code
} from 'lucide-react';

export const RegisterPage = ({ setActivePage }) => {
  const { register, guestLogin } = useAuth();

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Frontend Developer');
  const [experienceLevel, setExperienceLevel] = useState('Fresher'); // 'Student' | 'Fresher' | '1-2 years' | '3+ years'
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & Loading States
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Experience Options requested
  const experienceOptions = [
    { id: 'Student', label: 'Student', sub: 'College / University' },
    { id: 'Fresher', label: 'Fresher', sub: '0 - 1 year / Entry' },
    { id: '1-2 years', label: '1-2 years', sub: 'Junior Engineer' },
    { id: '3+ years', label: '3+ years', sub: 'Mid to Senior' },
  ];

  // Target Role Options
  const roleOptions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Campus Fresher / General SDE',
    'DevOps & Cloud Architect',
    'Data Scientist / AI Engineer',
    'Mobile Developer (iOS/Android)',
  ];

  // Email format validator
  const isValidEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    if (!password) {
      return { score: 0, label: '', color: 'bg-slate-800', width: '0%' };
    }

    let score = 0;
    const hasMinLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (hasMinLength) score += 1;
    if (hasLowercase && hasUppercase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    switch (score) {
      case 1:
        return {
          score: 1,
          label: 'Weak',
          color: 'bg-rose-500',
          textColor: 'text-rose-400',
          width: '25%',
          hasMinLength,
          hasUpperLower: hasLowercase && hasUppercase,
          hasNumber,
          hasSpecial,
        };
      case 2:
        return {
          score: 2,
          label: 'Fair',
          color: 'bg-amber-500',
          textColor: 'text-amber-400',
          width: '50%',
          hasMinLength,
          hasUpperLower: hasLowercase && hasUppercase,
          hasNumber,
          hasSpecial,
        };
      case 3:
        return {
          score: 3,
          label: 'Good',
          color: 'bg-indigo-500',
          textColor: 'text-indigo-400',
          width: '75%',
          hasMinLength,
          hasUpperLower: hasLowercase && hasUppercase,
          hasNumber,
          hasSpecial,
        };
      case 4:
        return {
          score: 4,
          label: 'Strong',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-400',
          width: '100%',
          hasMinLength,
          hasUpperLower: hasLowercase && hasUppercase,
          hasNumber,
          hasSpecial,
        };
      default:
        return {
          score: 1,
          label: 'Weak',
          color: 'bg-rose-500',
          textColor: 'text-rose-400',
          width: '15%',
          hasMinLength,
          hasUpperLower: hasLowercase && hasUppercase,
          hasNumber,
          hasSpecial,
        };
    }
  }, [password]);

  // Form validation before submit
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com)';
    }

    if (!password) {
      newErrors.password = 'Please enter a password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Please agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        experienceLevel,
      });

      // Redirect user to onboarding after successful registration
      setActivePage('onboarding');
    } catch (err) {
      setServerError(err.message || 'Registration failed. A user with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Guest Demo Login
  const handleGuestLogin = async () => {
    setServerError('');
    setLoading(true);

    try {
      await guestLogin();
      // For demo, route to onboarding or dashboard
      setActivePage('onboarding');
    } catch (err) {
      setServerError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Signup Simulation
  const handleGoogleSignup = async () => {
    setServerError('');
    setGoogleLoading(true);

    setTimeout(async () => {
      try {
        await guestLogin();
        setActivePage('onboarding');
      } catch (err) {
        setServerError('Google signup simulation encountered an issue.');
      } finally {
        setGoogleLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">

        {/* =========================================================================
            LEFT COLUMN: REGISTRATION FORM
           ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Header & Logo */}
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
                  Create your account
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Start practicing with realistic AI interviewers tailored to your target role.
                </p>
              </div>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div
                role="alert"
                className="flex items-start space-x-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in slide-in-from-top-1"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-rose-200">Registration Error</p>
                  <p className="text-rose-300/90 leading-relaxed">{serverError}</p>
                </div>
              </div>
            )}

            {/* Google Signup UI */}
            <button
              type="button"
              onClick={handleGoogleSignup}
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
              <span>{googleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Or register with email
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name & Email (2-Column Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${
                        errors.name ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Jane Doe"
                      disabled={loading}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 transition-all ${
                        errors.name
                          ? 'bg-rose-950/20 border border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                          : 'bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-400 flex items-center space-x-1 pt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${
                        errors.email ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="name@company.com"
                      disabled={loading}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 transition-all ${
                        errors.email
                          ? 'bg-rose-950/20 border border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                          : 'bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400 flex items-center space-x-1 pt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password (2-Column Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${
                        errors.password ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      placeholder="••••••••••••"
                      disabled={loading}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 transition-all ${
                        errors.password
                          ? 'bg-rose-950/20 border border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                          : 'bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-indigo-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-400 flex items-center space-x-1 pt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Confirm Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${
                        errors.confirmPassword ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      placeholder="••••••••••••"
                      disabled={loading}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 transition-all ${
                        errors.confirmPassword
                          ? 'bg-rose-950/20 border border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
                          : 'bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-400 flex items-center space-x-1 pt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-bold ${passwordStrength.textColor}`}>
                      {passwordStrength.label}
                    </span>
                  </div>

                  {/* Visual Strength Meter Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>

                  {/* Requirements Badges */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-400">
                    <span className={`flex items-center space-x-1 ${passwordStrength.hasMinLength ? 'text-emerald-400' : ''}`}>
                      <Check className="w-3 h-3" />
                      <span>At least 8 chars</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${passwordStrength.hasUpperLower ? 'text-emerald-400' : ''}`}>
                      <Check className="w-3 h-3" />
                      <span>Upper & lowercase</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${passwordStrength.hasNumber ? 'text-emerald-400' : ''}`}>
                      <Check className="w-3 h-3" />
                      <span>At least one number</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${passwordStrength.hasSpecial ? 'text-emerald-400' : ''}`}>
                      <Check className="w-3 h-3" />
                      <span>Special symbol (!@#$)</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Target Job Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Target Job Role <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm cursor-pointer"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Experience Level: Student, Fresher, 1-2 years, 3+ years */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Experience Level <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {experienceOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setExperienceLevel(opt.id)}
                      disabled={loading}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        experienceLevel === opt.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{opt.label}</span>
                        {experienceLevel === opt.id && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms of Service Checkbox */}
              <div className="pt-1">
                <label className="flex items-start space-x-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: '' });
                    }}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer mt-0.5"
                  />
                  <span className="leading-relaxed">
                    I agree to the{' '}
                    <span className="text-indigo-400 hover:text-indigo-300 font-medium">Terms of Service</span>{' '}
                    and{' '}
                    <span className="text-indigo-400 hover:text-indigo-300 font-medium">Privacy Policy</span>, and
                    consent to AI voice and interview simulation.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-rose-400 flex items-center space-x-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.terms}</span>
                  </p>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Setting up your profile...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Guest Demo Shortcut Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-2">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-indigo-300 font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Want to test immediately?</span>
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

          {/* Login Link */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setActivePage('login')}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Sign In &rarr;
            </button>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DESKTOP VISUAL PANEL
            "Your next interview starts here."
           ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950 p-10 flex-col justify-between border-l border-slate-800 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-10 right-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Panel Text */}
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Personalized Prep Roadmap</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Start your journey to top tech offers.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create your account to unlock personalized mock interviews, instant speech synthesis, live code execution, and STAR rubric feedback.
            </p>
          </div>

          {/* Interactive Simulation Preview Mockup */}
          <div className="my-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 relative z-10 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-slate-200">Onboarding Assessment</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-indigo-300 font-mono">
                {role}
              </span>
            </div>

            {/* AI Interviewer prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                  AI
                </div>
                <span className="text-[11px] font-semibold text-indigo-300">Dr. Elena Vance</span>
              </div>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                "Welcome to the platform! Once registered, we'll configure your first interview questions tailored specifically to {role}."
              </p>
            </div>

            {/* Real-time score indicator */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Selected Level: {experienceLevel}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                Tailored Pool
              </span>
            </div>
          </div>

          {/* Social Proof Bottom */}
          <div className="space-y-3 relative z-10 pt-4 border-t border-slate-800/80 text-xs">
            <div className="flex items-center space-x-1 text-amber-400 text-xs">
              {'★'.repeat(5)}
              <span className="text-slate-300 font-bold pl-1.5">4.9 / 5</span>
              <span className="text-slate-500 font-normal">(15,000+ engineers)</span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              "The STAR behavioral grading and instant model answers completely changed how I speak in tech loops."
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>No credit card required &bull; 100% Free Starter Tier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
