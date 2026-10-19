import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Sparkles,
  Mic,
  FileText,
  Code,
  Users,
  Cpu,
  Layers,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Target,
  Briefcase,
  Flame,
  Brain,
  Plus,
  X,
  HelpCircle,
  ShieldCheck,
  Award
} from 'lucide-react';

export const InterviewSetupPage = ({ onSessionCreated, prefilledConfig }) => {
  const { user } = useAuth();

  // Form Field States matching prompt requirements
  const [role, setRole] = useState(prefilledConfig?.role || user?.role || 'Frontend Developer');
  const [customRole, setCustomRole] = useState('');
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);

  // Interview Type: Technical, HR, Behavioral, Coding, System Design, Mixed
  const [interviewType, setInterviewType] = useState(prefilledConfig?.type || prefilledConfig?.interviewMode || 'Technical');

  // Difficulty: Easy, Medium, Hard
  const [difficulty, setDifficulty] = useState(prefilledConfig?.difficulty || 'Medium');

  // Experience Level: Fresher, Junior, Intermediate, Experienced
  const [experienceLevel, setExperienceLevel] = useState(
    prefilledConfig?.experienceLevel || user?.experienceLevel || 'Fresher'
  );

  // Interview Duration: 10 minutes, 20 minutes, 30 minutes, 45 minutes
  const [duration, setDuration] = useState('20 minutes');

  // Number of Questions: 5, 10, 15, 20
  const [questionCount, setQuestionCount] = useState(prefilledConfig?.questionCount || 5);

  // Interview Mode: Text, Voice
  const [interviewMode, setInterviewMode] = useState(
    prefilledConfig?.voiceMode ? 'Voice' : prefilledConfig?.interactionMode === 'voice' ? 'Voice' : 'Voice'
  );

  // Skills / Topics
  const [skills, setSkills] = useState(
    prefilledConfig?.skills?.length
      ? prefilledConfig.skills
      : user?.skills?.length
      ? user.skills
      : ['JavaScript', 'React', 'CSS', 'System Design']
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Job Role Options
  const roleOptions = [
    { id: 'Software Engineer', label: 'Software Engineer', icon: '💻', desc: 'Core CS, algorithms, data structures & clean design' },
    { id: 'Frontend Developer', label: 'Frontend Developer', icon: '🎨', desc: 'React, modern JS, DOM diffing & web performance' },
    { id: 'Backend Developer', label: 'Backend Developer', icon: '⚙️', desc: 'Node.js, Python, PostgreSQL, caching & API design' },
    { id: 'Full Stack Developer', label: 'Full Stack Developer', icon: '🚀', desc: 'End-to-end web apps, client & server architecture' },
    { id: 'Data Analyst', label: 'Data Analyst', icon: '📊', desc: 'SQL queries, analytics schemas & business metrics' },
    { id: 'Data Scientist', label: 'Data Scientist', icon: '🧠', desc: 'Machine learning, statistics, Python & data modeling' },
    { id: 'DevOps Engineer', label: 'DevOps Engineer', icon: '☁️', desc: 'Docker, Kubernetes, CI/CD pipelines & Linux systems' },
  ];

  // Interview Types requested: Technical, HR, Behavioral, Coding, System Design, Mixed
  const interviewTypes = [
    {
      id: 'Technical',
      title: 'Technical',
      icon: Cpu,
      desc: 'Architecture, language internals, database indexing & concurrency',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'HR',
      title: 'HR',
      icon: Users,
      desc: 'Culture fit, career aspirations, salary expectations & soft skills',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'Behavioral',
      title: 'Behavioral',
      icon: Award,
      desc: 'STAR method (Situation, Task, Action, Result) leadership grading',
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 'Coding',
      title: 'Coding',
      icon: Code,
      desc: 'Live code editor, algorithmic problem solving & Big-O test runner',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'System Design',
      title: 'System Design',
      icon: Layers,
      desc: 'Distributed systems, load balancing, sharding & scalability trade-offs',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'Mixed',
      title: 'Mixed',
      icon: Sparkles,
      desc: 'Full-loop simulation blending technical, coding & behavioral questions',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  // Difficulty Options
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  // Experience Level Options requested: Fresher, Junior, Intermediate, Experienced
  const experienceOptions = [
    { id: 'Fresher', label: 'Fresher', sub: '0 - 1 year / College' },
    { id: 'Junior', label: 'Junior', sub: '1 - 2 years experience' },
    { id: 'Intermediate', label: 'Intermediate', sub: '3 - 5 years experience' },
    { id: 'Experienced', label: 'Experienced', sub: '5+ years / Senior Lead' },
  ];

  // Interview Duration Options: 10 minutes, 20 minutes, 30 minutes, 45 minutes
  const durationOptions = ['10 minutes', '20 minutes', '30 minutes', '45 minutes'];

  // Number of Questions Options: 5, 10, 15, 20
  const questionCountOptions = [5, 10, 15, 20];

  // Curated Popular Skills for 1-Click Toggle
  const popularSkillsCatalog = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'SQL',
    'DSA',
    'System Design',
    'HTML',
    'CSS',
    'TypeScript',
    'Docker',
    'REST APIs',
    'Git',
    'Redis',
    'Microservices',
  ];

  // Add custom skill/topic
  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setCustomSkillInput('');
    }
  };

  // Toggle skill from catalog
  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Handle Start Interview Submit
  const handleStartInterview = async () => {
    setError('');
    setLoading(true);

    // Map interviewType to backend interviewMode
    let backendMode = 'technical';
    const lowerType = interviewType.toLowerCase();
    if (lowerType === 'hr') backendMode = 'hr';
    else if (lowerType === 'behavioral') backendMode = 'behavioral';
    else if (lowerType === 'coding') backendMode = 'coding';
    else if (lowerType === 'system design') backendMode = 'technical';
    else if (lowerType === 'mixed') backendMode = 'mixed';

    try {
      const res = await api.interviews.createSession({
        role,
        experienceLevel,
        interviewMode: backendMode,
        interactionMode: interviewMode.toLowerCase(),
        skills,
        questionCount,
        difficulty,
        durationMinutes: parseInt(duration, 10) || 20,
        title: `${role} (${interviewType} - ${difficulty})`,
      });

      if (res.success && res.session) {
        onSessionCreated(res.session);
      } else {
        setError('Failed to generate interview questions. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Error creating interview session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* =========================================================================
          PAGE HEADER
          Title: "Customize Your Interview"
         ========================================================================= */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Session Configurator</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Customize Your Interview
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Tailor your job role, round type, difficulty, duration, and skills. Dr. Elena Vance will calibrate questions to your exact preferences.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto flex items-center space-x-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* =========================================================================
          MAIN GRID: FORM CONTROLS (LEFT) + REAL-TIME SUMMARY CARD (RIGHT)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: FORM CONFIGURATION (Col 1-8)
           ========================================================================= */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
          
          {/* Section 1: Job Role */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Job Role</span>
              </label>
              <span className="text-[11px] text-slate-400">Selected: <strong className="text-white">{role}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {roleOptions.map((r) => {
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id);
                      setShowCustomRoleInput(false);
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/40 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{r.icon}</span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white mt-1.5">{r.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Role Input */}
            <div className="pt-1">
              {!showCustomRoleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomRoleInput(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enter other custom role</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 max-w-md p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. AI Engineer, Site Reliability Engineer"
                    className="flex-1 bg-transparent border-none text-white text-xs px-2 focus:outline-none placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customRole.trim()) {
                        setRole(customRole.trim());
                      }
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Interview Type */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Interview Type</span>
              </label>
              <span className="text-[11px] text-slate-400">Selected: <strong className="text-white">{interviewType}</strong></span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {interviewTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = interviewType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInterviewType(t.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/40 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${t.color} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                        {t.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3 & 4: Difficulty & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Difficulty</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {difficultyOptions.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      difficulty === diff
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Experience Level</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {experienceOptions.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperienceLevel(exp.id)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      experienceLevel === exp.id
                        ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{exp.label}</div>
                    <div className="text-[9px] text-slate-400 truncate">{exp.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5 & 6: Duration & Number of Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Interview Duration: 10 min, 20 min, 30 min, 45 min */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Interview Duration</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      duration === d
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions: 5, 10, 15, 20 */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Number of Questions</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {questionCountOptions.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 7: Interview Mode (Text vs Voice) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
              <Mic className="w-3.5 h-3.5" />
              <span>Interview Mode</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Voice Mode */}
              <div
                onClick={() => setInterviewMode('Voice')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  interviewMode === 'Voice'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/40 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${interviewMode === 'Voice' ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white">Voice Mode (Spoken)</h4>
                    <p className="text-[11px] text-slate-400">Speaks questions aloud & records microphone</p>
                  </div>
                </div>
                {interviewMode === 'Voice' && <Check className="w-4 h-4 text-indigo-400" />}
              </div>

              {/* Text Mode */}
              <div
                onClick={() => setInterviewMode('Text')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  interviewMode === 'Text'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500/40 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${interviewMode === 'Text' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white">Text Mode (Written)</h4>
                    <p className="text-[11px] text-slate-400">Read questions on-screen and type answers</p>
                  </div>
                </div>
                {interviewMode === 'Text' && <Check className="w-4 h-4 text-indigo-400" />}
              </div>
            </div>
          </div>

          {/* Section 8: Skills / Topics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>Skills / Focus Topics ({skills.length} Selected)</span>
              </label>
              <span className="text-[11px] text-slate-400">Tap to toggle or add custom</span>
            </div>

            {/* Popular Skills Pills */}
            <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              {popularSkillsCatalog.map((sk) => {
                const isSelected = skills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm border border-indigo-400'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{sk}</span>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Skill / Topic Form */}
            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Enter custom topic (e.g. GraphQL, Next.js, Redux)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                Add Topic
              </button>
            </form>

            {/* Active Selected Topics */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-indigo-950/70 text-indigo-300 border border-indigo-800/50"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(sk)}
                    className="hover:text-rose-400 text-slate-400 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: REAL-TIME SUMMARY CARD (Col 9-12)
            Show a summary card before starting.
            Button: "Start Interview"
           ========================================================================= */}
        <div className="lg:col-span-4 sticky top-6 space-y-5">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6 relative overflow-hidden backdrop-blur-xl">
            {/* Ambient Accent Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-sm text-white">Interview Summary</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Ready to Launch
              </span>
            </div>

            {/* AI Interviewer Persona Card */}
            <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Dr. Elena Vance</h4>
                <p className="text-[11px] text-indigo-400">Lead AI Bar Raiser</p>
                <p className="text-[10px] text-slate-400">Web Speech & STAR Rubrics Active</p>
              </div>
            </div>

            {/* Spec Highlights Table */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Target Role:</span>
                <span className="font-bold text-white text-right truncate max-w-[170px]">{role}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Interview Type:</span>
                <span className="font-bold text-indigo-300">{interviewType}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Difficulty:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-300' : difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Experience Level:</span>
                <span className="font-semibold text-slate-200">{experienceLevel}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Duration & Questions:</span>
                <span className="font-semibold text-slate-200">{duration} &bull; {questionCount} Qs</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400">Interview Mode:</span>
                <span className="font-bold text-cyan-400 flex items-center space-x-1">
                  {interviewMode === 'Voice' ? <Mic className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  <span>{interviewMode} Mode</span>
                </span>
              </div>
            </div>

            {/* Focus Skills Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Focus Topics:</span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* PRIMARY BUTTON: "Start Interview" */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartInterview}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Simulation Session...</span>
                  </>
                ) : (
                  <>
                    <span>Start Interview</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Bottom Trust Note */}
            <p className="text-center text-[10px] text-slate-500 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>Full Rubric &bull; Instant Evaluation &bull; Real-time AI</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupPage;
