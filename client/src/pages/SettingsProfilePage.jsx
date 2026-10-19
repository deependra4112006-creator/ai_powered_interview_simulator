import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import api from '../services/api';
import {
  User,
  Settings,
  Cpu,
  Database,
  Moon,
  Sun,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Save,
  Key,
  Shield,
  Loader2
} from 'lucide-react';

export const SettingsProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { speak } = useSpeechSynthesis();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Frontend Developer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Fresher / Entry Level');
  const [skills, setSkills] = useState(user?.skills || ['React', 'JavaScript', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // System Settings state
  const [systemSettings, setSystemSettings] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const res = await api.settings.getSystemSettings();
        if (res.success) {
          setSystemSettings(res);
        }
      } catch (err) {
        console.warn('Error fetching system settings:', err);
      }
    };
    fetchSystem();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSaved(false);
    try {
      await updateProfile({
        name,
        role,
        experienceLevel,
        skills,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    setTestingKey(true);
    setTestResult(null);
    try {
      const res = await api.settings.testLLM(apiKeyInput.trim(), 'gemini');
      setTestResult({
        success: res.success,
        message: res.message,
      });
      if (res.success && res.aiEngine) {
        setSystemSettings((prev) => ({ ...prev, aiEngine: res.aiEngine }));
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message,
      });
    } finally {
      setTestingKey(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Profile & AI System Settings</span>
        </h1>
        <p className="text-xs text-slate-400">
          Manage your career target preferences, database status, and optional live LLM API keys.
        </p>
      </div>

      {/* Candidate Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Candidate Profile</h3>
              <p className="text-xs text-slate-400">Personalized mock interview targeting</p>
            </div>
          </div>

          {profileSaved && (
            <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved Successfully</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Default Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Campus Fresher / General SDE">Campus Fresher / SDE</option>
                <option value="DevOps / Cloud Engineer">DevOps & Cloud</option>
                <option value="Data Scientist / AI Engineer">Data Science & AI</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Experience Seniority</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500"
              >
                <option value="Fresher / Entry Level">Fresher / Intern (0-1 yrs)</option>
                <option value="Junior (1-3 yrs)">Junior Developer (1-3 yrs)</option>
                <option value="Mid-Level (3-5 yrs)">Mid-Level Developer (3-5 yrs)</option>
                <option value="Senior (5+ yrs)">Senior / Lead Engineer (5+ yrs)</option>
              </select>
            </div>
          </div>

          {/* Skill tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Key Focus Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add skill (e.g. Next.js, Redux, Docker)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-950 text-indigo-300 border border-slate-800"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="hover:text-rose-400 text-slate-500 font-bold ml-1"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI Engine & LLM Architecture Information */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">AI Engine Architecture</h3>
            <p className="text-xs text-slate-400">Structured service layer for realistic simulation or live LLM</p>
          </div>
        </div>

        {/* Current Status Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active AI Provider
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {systemSettings?.aiEngine?.provider || 'Simulation Engine'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {systemSettings?.aiEngine?.status || 'High-fidelity offline heuristic evaluation engine with persistent storage.'}
          </p>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block">How to connect a Live LLM API:</span>
            <p>1. Open <code className="text-indigo-300">server/.env</code></p>
            <p>2. Set <code className="text-indigo-300">GEMINI_API_KEY=your_key</code> or <code className="text-indigo-300">OPENAI_API_KEY=your_key</code></p>
            <p>3. Restart server or test connection dynamically below.</p>
          </div>
        </div>

        {/* Dynamic Live LLM Tester */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>Test Google Gemini API Key Dynamically:</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleTestApiKey}
              disabled={testingKey || !apiKeyInput.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {testingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify & Connect</span>}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                testResult.success
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Database & UI Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Database Status Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Database Mode</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-400 font-bold">Operational</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Storage Engine:</span>
              <span className="text-slate-200 font-medium">
                {systemSettings?.database?.mode || 'Persistent Local JSON (MongoDB Offline Fallback)'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Data seamlessly persists across server reboots in both local MongoDB and local storage mode.
          </p>
        </div>

        {/* Voice & Theme Preferences */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Volume2 className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Interface & Audio</h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-300">Theme Appearance</span>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span className="capitalize">{theme} Mode</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => speak('Hello Alex. Your speech synthesis is properly calibrated for realistic mock interviews.')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Test Interviewer Voice Output</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfilePage;
