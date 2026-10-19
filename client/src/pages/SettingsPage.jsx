import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Settings,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Bell,
  Shield,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Save,
  Loader2,
  Mic,
  MessageSquare,
  Clock,
  Briefcase,
  Zap,
  Check,
  X,
  Volume2,
  Sliders,
  Layers,
  Database,
  ExternalLink
} from 'lucide-react';

export const SettingsPage = ({ setActivePage, onStartNew }) => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, themeMode, setThemeMode } = useTheme();

  // Active section for sidebar navigation
  const [activeSection, setActiveSection] = useState('account');

  // Account State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountFeedback, setAccountFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  // Interview Preferences State (persisted in localStorage)
  const [interviewPrefs, setInterviewPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewai_interview_prefs');
      return stored
        ? JSON.parse(stored)
        : {
            defaultType: 'technical',
            defaultDifficulty: 'medium',
            defaultDuration: '20',
            modePreference: 'voice' // 'voice' | 'text'
          };
    } catch {
      return {
        defaultType: 'technical',
        defaultDifficulty: 'medium',
        defaultDuration: '20',
        modePreference: 'voice'
      };
    }
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSavedToast, setPrefsSavedToast] = useState(false);

  // Notification Preferences State (persisted in localStorage)
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewai_notifications_prefs');
      return stored
        ? JSON.parse(stored)
        : {
            interviewReminders: true,
            weeklyProgressReport: true,
            newQuestionNotifications: false
          };
    } catch {
      return {
        interviewReminders: true,
        weeklyProgressReport: true,
        newQuestionNotifications: false
      };
    }
  });

  // Privacy Preferences State
  const [privacySettings, setPrivacySettings] = useState(() => {
    try {
      const stored = localStorage.getItem('interviewai_privacy_prefs');
      return stored
        ? JSON.parse(stored)
        : {
            anonymousDataSharing: true,
            storeAudioTranscripts: true,
            retentionPeriod: '30days'
          };
    } catch {
      return {
        anonymousDataSharing: true,
        storeAudioTranscripts: true,
        retentionPeriod: '30days'
      };
    }
  });

  // Destructive Actions & Modals State
  const [deleteHistoryModalOpen, setDeleteHistoryModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState('');
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [actionSuccessBanner, setActionSuccessBanner] = useState(null);

  // Sync user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Persist Interview Preferences
  useEffect(() => {
    try {
      localStorage.setItem('interviewai_interview_prefs', JSON.stringify(interviewPrefs));
    } catch (e) {
      console.warn('Error saving interview prefs:', e);
    }
  }, [interviewPrefs]);

  // Persist Notification Preferences
  useEffect(() => {
    try {
      localStorage.setItem('interviewai_notifications_prefs', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Error saving notifications:', e);
    }
  }, [notifications]);

  // Persist Privacy Preferences
  useEffect(() => {
    try {
      localStorage.setItem('interviewai_privacy_prefs', JSON.stringify(privacySettings));
    } catch (e) {
      console.warn('Error saving privacy prefs:', e);
    }
  }, [privacySettings]);

  // Handle Account Info Save
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setAccountFeedback({ type: 'error', message: 'Please provide your full name.' });
      return;
    }
    setSavingAccount(true);
    setAccountFeedback(null);
    try {
      await updateProfile({ name: name.trim() });
      setAccountFeedback({ type: 'success', message: 'Account details updated successfully.' });
      setTimeout(() => setAccountFeedback(null), 3500);
    } catch (err) {
      setAccountFeedback({ type: 'error', message: err.message || 'Error updating account.' });
    } finally {
      setSavingAccount(false);
    }
  };

  // Handle Password Update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (!newPassword || newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      const res = await api.auth.changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordFeedback({ type: 'success', message: 'Password changed successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordFeedback(null), 4000);
      }
    } catch (err) {
      setPasswordFeedback({ type: 'error', message: err.message || 'Error updating password.' });
    }
  };

  // Handle Interview Preferences Save
  const handleSaveInterviewPrefs = () => {
    setSavingPrefs(true);
    setTimeout(() => {
      setSavingPrefs(false);
      setPrefsSavedToast(true);
      setTimeout(() => setPrefsSavedToast(false), 3000);
    }, 300);
  };

  // Handle Delete History
  const handleConfirmDeleteHistory = async () => {
    setIsDeletingHistory(true);
    try {
      await api.interviews.clearHistory();
      setDeleteHistoryModalOpen(false);
      setActionSuccessBanner('Your entire interview history and scorecards have been wiped.');
      setTimeout(() => setActionSuccessBanner(null), 5000);
    } catch (err) {
      alert(`Error clearing history: ${err.message}`);
    } finally {
      setIsDeletingHistory(false);
    }
  };

  // Handle Delete Account
  const handleConfirmDeleteAccount = async () => {
    if (confirmDeleteInput.trim().toUpperCase() !== 'DELETE') return;
    setIsDeletingAccount(true);
    try {
      await api.auth.deleteAccount();
      setDeleteAccountModalOpen(false);
      logout();
      if (setActivePage) setActivePage('landing');
    } catch (err) {
      alert(`Error deleting account: ${err.message}`);
      setIsDeletingAccount(false);
    }
  };

  const navSections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Interview Preferences', icon: Sliders },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Settings className="w-3.5 h-3.5" />
            <span>Application Preferences & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure your interview defaults, interface appearance, notifications, and privacy preferences.
          </p>
        </div>

        {actionSuccessBanner && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessBanner}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            SIDEBAR NAVIGATION
           ========================================================================= */}
        <div className="lg:col-span-3 sticky top-24 space-y-1 bg-slate-900/60 p-2 rounded-2xl border border-slate-800 backdrop-blur-sm">
          {navSections.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? item.danger
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                      : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : item.danger
                    ? 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            MAIN SETTINGS SECTIONS
           ========================================================================= */}
        <div className="lg:col-span-9 space-y-8">
          {/* =======================================================================
              SECTION 1: ACCOUNT
             ======================================================================= */}
          <section id="account" className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Account Settings</h2>
                <p className="text-xs text-slate-400">Update your primary identity, email, and password credentials.</p>
              </div>
            </div>

            {/* Account Details Form */}
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {accountFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    accountFeedback.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {accountFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{accountFeedback.message}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingAccount}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                >
                  {savingAccount ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Account Details</span>
                </button>
              </div>
            </form>

            {/* Password Change Sub-section */}
            <div className="pt-5 border-t border-slate-800 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Change Password</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Ensure your account is protected with a secure password.</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">New Password (Min 6 chars)</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300">Confirm New Password</label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {passwordFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                      passwordFeedback.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {passwordFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{passwordFeedback.message}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* =======================================================================
              SECTION 2: INTERVIEW PREFERENCES
              - Default interview type
              - Default difficulty
              - Default duration
              - Voice/text preference
             ======================================================================= */}
          <section id="preferences" className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Interview Preferences</h2>
                  <p className="text-xs text-slate-400">Set default parameters automatically prefilled in new interview sessions.</p>
                </div>
              </div>

              {prefsSavedToast && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" />
                  <span>Preferences Saved</span>
                </span>
              )}
            </div>

            <div className="space-y-5">
              {/* Default Interview Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Default Interview Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'technical', label: 'Technical' },
                    { id: 'coding', label: 'Coding' },
                    { id: 'behavioral', label: 'Behavioral' },
                    { id: 'hr', label: 'HR Screening' },
                    { id: 'system_design', label: 'System Design' },
                    { id: 'mixed', label: 'Mixed Round' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInterviewPrefs((p) => ({ ...p, defaultType: type.id }))}
                      className={`p-3 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                        interviewPrefs.defaultType === type.id
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Difficulty */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Default Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'easy', label: 'Easy', color: 'text-emerald-400' },
                    { id: 'medium', label: 'Medium', color: 'text-amber-400' },
                    { id: 'hard', label: 'Hard', color: 'text-rose-400' }
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setInterviewPrefs((p) => ({ ...p, defaultDifficulty: diff.id }))}
                      className={`p-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        interviewPrefs.defaultDifficulty === diff.id
                          ? 'bg-slate-950 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span className={diff.color}>{diff.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Default Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['10', '20', '30', '45'].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setInterviewPrefs((p) => ({ ...p, defaultDuration: mins }))}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                        interviewPrefs.defaultDuration === mins
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mins} minutes</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice vs Text Preference */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Voice / Text Mode Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setInterviewPrefs((p) => ({ ...p, modePreference: 'voice' }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                      interviewPrefs.modePreference === 'voice'
                        ? 'bg-indigo-600/10 border-indigo-500/60 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>Voice Mode (Spoken AI Interview)</span>
                        {interviewPrefs.modePreference === 'voice' && (
                          <Check className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Speech-to-text audio responses with spoken AI follow-ups and realistic conversational pacing.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setInterviewPrefs((p) => ({ ...p, modePreference: 'text' }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                      interviewPrefs.modePreference === 'text'
                        ? 'bg-indigo-600/10 border-indigo-500/60 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>Text Mode (Written Responses)</span>
                        {interviewPrefs.modePreference === 'text' && (
                          <Check className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Standard keyboard input with formatted textareas and code editors for distraction-free typing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveInterviewPrefs}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Interview Preferences</span>
                </button>
              </div>
            </div>
          </section>

          {/* =======================================================================
              SECTION 3: APPEARANCE
              - Light mode
              - Dark mode
              - System default
             ======================================================================= */}
          <section id="appearance" className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Appearance & Theme</h2>
                <p className="text-xs text-slate-400">Customize the visual theme and contrast of the workspace.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Light mode */}
              <div
                onClick={() => setThemeMode('light')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  themeMode === 'light'
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg ring-1 ring-indigo-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Sun className="w-5 h-5" />
                  </div>
                  {themeMode === 'light' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Light Mode</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">High-contrast daytime clarity with crisp light backgrounds.</p>
                </div>
              </div>

              {/* Dark mode */}
              <div
                onClick={() => setThemeMode('dark')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  themeMode === 'dark'
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg ring-1 ring-indigo-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  {themeMode === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dark Mode</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Sleek obsidian palette reducing eye strain during long interview preps.</p>
                </div>
              </div>

              {/* System default */}
              <div
                onClick={() => setThemeMode('system')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  themeMode === 'system'
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg ring-1 ring-indigo-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Monitor className="w-5 h-5" />
                  </div>
                  {themeMode === 'system' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">System Default</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Automatically syncs with your operating system color scheme.</p>
                </div>
              </div>
            </div>
          </section>

          {/* =======================================================================
              SECTION 4: NOTIFICATIONS
              - Interview reminders
              - Weekly progress report
              - New question notifications
             ======================================================================= */}
          <section id="notifications" className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Notification Preferences</h2>
                <p className="text-xs text-slate-400">Manage communication alerts and practice encouragement.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Interview reminders */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Interview Reminders</h4>
                  <p className="text-xs text-slate-400">Receive timely nudges to maintain your active daily practice streak.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications((n) => ({ ...n, interviewReminders: !n.interviewReminders }))
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.interviewReminders ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.interviewReminders ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Weekly progress report */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Weekly Progress Report</h4>
                  <p className="text-xs text-slate-400">Summarized AI intelligence breakdown of skill improvements and weak spots.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications((n) => ({ ...n, weeklyProgressReport: !n.weeklyProgressReport }))
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.weeklyProgressReport ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.weeklyProgressReport ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* New question notifications */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">New Question Notifications</h4>
                  <p className="text-xs text-slate-400">Be informed whenever new high-frequency DSA or System Design questions are added.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications((n) => ({
                      ...n,
                      newQuestionNotifications: !n.newQuestionNotifications
                    }))
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    notifications.newQuestionNotifications ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications.newQuestionNotifications ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* =======================================================================
              SECTION 5: PRIVACY
              - Data preferences
              - Delete interview history
             ======================================================================= */}
          <section id="privacy" className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Privacy & Data Governance</h2>
                <p className="text-xs text-slate-400">Manage telemetry, encrypted speech transcript storage, and interview retention.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Data Preferences toggles */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Anonymous Data Analytics</h4>
                  <p className="text-xs text-slate-400">Allow anonymized performance data to improve model rubric scoring accuracy.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPrivacySettings((p) => ({
                      ...p,
                      anonymousDataSharing: !p.anonymousDataSharing
                    }))
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    privacySettings.anonymousDataSharing ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      privacySettings.anonymousDataSharing ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Encrypted Speech Transcript Storage</h4>
                  <p className="text-xs text-slate-400">Store verbal mock transcripts in encrypted cloud storage for historical review.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPrivacySettings((p) => ({
                      ...p,
                      storeAudioTranscripts: !p.storeAudioTranscripts
                    }))
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    privacySettings.storeAudioTranscripts ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      privacySettings.storeAudioTranscripts ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Delete Interview History Button */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
                    <Trash2 className="w-4 h-4 text-amber-400" />
                    <span>Delete Interview History</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Permanently delete all previous mock interviews, code submissions, and performance reports.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteHistoryModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  Delete History
                </button>
              </div>
            </div>
          </section>

          {/* =======================================================================
              SECTION 6: DANGER ZONE
              - Delete account
             ======================================================================= */}
          <section id="danger" className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-rose-500/20">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Danger Zone</h2>
                <p className="text-xs text-slate-400">Irreversible actions that permanently delete your profile and account.</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-rose-300">Delete Account</h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Once deleted, your account credentials, career profile, target settings, and completed scores are permanently destroyed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteInput('');
                  setDeleteAccountModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer shrink-0"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* =========================================================================
          CONFIRMATION MODAL 1: DELETE INTERVIEW HISTORY
         ========================================================================= */}
      {deleteHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Delete All Interview History?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to clear your interview history? This action will permanently delete all completed sessions, AI rubric evaluations, and progress charts.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              Note: Your candidate profile and target skills will remain intact.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingHistory}
                onClick={handleConfirmDeleteHistory}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
              >
                {isDeletingHistory && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete History</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRMATION MODAL 2: DELETE ACCOUNT (DANGER ZONE)
         ========================================================================= */}
      {deleteAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Account Permanently</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action is <strong className="text-rose-400">irreversible</strong>. All your interview data, candidate profile, subscription status, and scores will be permanently deleted immediately.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Type <strong className="text-white font-mono">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={confirmDeleteInput}
                onChange={(e) => setConfirmDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAccountModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingAccount || confirmDeleteInput.trim().toUpperCase() !== 'DELETE'}
                onClick={handleConfirmDeleteAccount}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
              >
                {isDeletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
