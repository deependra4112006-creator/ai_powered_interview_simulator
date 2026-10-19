import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Brain,
  Code,
  Users,
  Terminal,
  Award,
  Zap,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Target,
  Layers,
  Check,
  Plus,
  X,
  FileText,
  Clock,
  Sparkle,
  Compass
} from 'lucide-react';

export const OnboardingPage = ({ setActivePage, onStartSessionWithConfig }) => {
  const { user, updateProfile } = useAuth();

  // Current Step: 1 to 5
  const [step, setStep] = useState(1);

  // Step 1: Target Role
  const [targetRole, setTargetRole] = useState(user?.role || 'Frontend Developer');
  const [customRole, setCustomRole] = useState('');
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);

  // Step 2: Experience Level
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Fresher');

  // Step 3: Skills
  const defaultInitialSkills = user?.skills?.length
    ? user.skills
    : ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'SQL', 'DSA'];
  const [selectedSkills, setSelectedSkills] = useState(defaultInitialSkills);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Step 4: Interview Goals
  const [interviewGoal, setInterviewGoal] = useState('Job interview');

  // Loading state for saving profile
  const [saving, setSaving] = useState(false);

  // Available Roles for Step 1
  const roleList = [
    {
      id: 'Software Engineer',
      title: 'Software Engineer',
      desc: 'General SDE, core computer science, algorithmic problem solving & clean code',
      icon: Terminal,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'Frontend Developer',
      title: 'Frontend Developer',
      desc: 'UI/UX architecture, React/Vue/JS, browser DOM performance & CSS styling',
      icon: Code,
      color: 'from-indigo-500 to-cyan-500',
    },
    {
      id: 'Backend Developer',
      title: 'Backend Developer',
      desc: 'Scalable APIs, database schemas, server architecture & microservices',
      icon: Layers,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'Full Stack Developer',
      title: 'Full Stack Developer',
      desc: 'End-to-end web applications, frontend clients & backend services',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'Data Analyst',
      title: 'Data Analyst',
      desc: 'SQL data warehousing, metrics interpretation, dashboards & business logic',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'Data Scientist',
      title: 'Data Scientist',
      desc: 'Machine learning, statistics, Python modeling & data pipeline design',
      icon: Award,
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 'DevOps Engineer',
      title: 'DevOps Engineer',
      desc: 'CI/CD deployment pipelines, cloud infrastructure, Docker, Kubernetes & Linux',
      icon: Target,
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  // Available Experience Options for Step 2
  const experienceOptions = [
    {
      id: 'Student',
      title: 'Student',
      sub: 'College or university student building foundational knowledge',
      icon: GraduationCap,
      focus: 'Core OOP, standard algorithms, data structures & campus placement basics',
    },
    {
      id: 'Fresher',
      title: 'Fresher',
      sub: 'Recent graduate or 0 - 1 year of professional experience',
      icon: Sparkles,
      focus: 'Entry-level coding tests, foundational framework concepts & behavioral enthusiasm',
    },
    {
      id: '1-2 years',
      title: '1 - 2 years',
      sub: 'Junior engineer looking to accelerate career growth',
      icon: Briefcase,
      focus: 'Production code quality, debugging, real-world APIs & collaborative ownership',
    },
    {
      id: '3-5 years',
      title: '3 - 5 years',
      sub: 'Mid-level engineer building robust, scalable systems',
      icon: TrendingUp,
      focus: 'System architecture, performance optimization, trade-offs & senior team leadership',
    },
    {
      id: '5+ years',
      title: '5+ years',
      sub: 'Senior / Staff engineer leading high-scale initiatives',
      icon: Award,
      focus: 'Large-scale distributed systems, system design, bar raiser rigor & org impact',
    },
  ];

  // Skills Catalog for Step 3
  const availableSkills = [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'SQL',
    'DSA',
    'System Design',
    'TypeScript',
    'Next.js',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'Git',
    'GraphQL',
    'REST APIs',
    'AWS',
  ];

  // Interview Goals for Step 4
  const goalOptions = [
    {
      id: 'Placement preparation',
      title: 'Placement preparation',
      desc: 'Master campus recruitment drives with structured answers and core CS concepts.',
      icon: GraduationCap,
      badge: 'Campus Drive Focus',
      color: 'from-indigo-500 to-cyan-500',
    },
    {
      id: 'Internship',
      title: 'Internship',
      desc: 'Prepare for competitive software engineering and tech summer internships.',
      icon: Sparkles,
      badge: 'Internship Ready',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'Job interview',
      title: 'Job interview',
      desc: 'High-stakes tech loops targeting top tech, high-growth startups, and unicorns.',
      icon: Briefcase,
      badge: 'Offer Hunter',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'Technical improvement',
      title: 'Technical improvement',
      desc: 'Level up coding execution, Big-O analysis, and architectural design depth.',
      icon: Code,
      badge: 'Skills Deep Dive',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'HR preparation',
      title: 'HR preparation',
      desc: 'Refine communication, STAR behavioral stories, leadership principles, and salary talks.',
      icon: Users,
      badge: 'Behavioral & Culture',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  // Toggle skill selection
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add custom skill
  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
      setCustomSkillInput('');
    }
  };

  // Remove skill
  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  // Presets for quick skills selection
  const applySkillPreset = (presetType) => {
    if (presetType === 'frontend') {
      setSelectedSkills(['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Next.js', 'REST APIs', 'Git']);
    } else if (presetType === 'backend') {
      setSelectedSkills(['Node.js', 'Python', 'SQL', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'System Design']);
    } else if (presetType === 'campus') {
      setSelectedSkills(['DSA', 'Java', 'C++', 'Python', 'SQL', 'System Design', 'Git', 'HTML', 'CSS']);
    }
  };

  // Complete onboarding and start practicing
  const handleStartPracticing = async () => {
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({
          role: targetRole,
          experienceLevel,
          skills: selectedSkills,
        });
      }
    } catch (err) {
      console.warn('Profile update warning:', err);
    } finally {
      setSaving(false);
    }

    // Map goal to interview format
    let interviewType = 'technical';
    if (interviewGoal === 'HR preparation') {
      interviewType = 'hr';
    } else if (interviewGoal === 'Placement preparation' || interviewGoal === 'Technical improvement') {
      interviewType = 'technical';
    } else if (interviewGoal === 'Job interview') {
      interviewType = 'technical';
    }

    if (onStartSessionWithConfig) {
      onStartSessionWithConfig({
        type: interviewType,
        role: targetRole,
        experienceLevel,
        skills: selectedSkills,
      });
    } else {
      setActivePage('setup');
    }
  };

  // Complete onboarding and go to dashboard
  const handleGoDashboard = async () => {
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({
          role: targetRole,
          experienceLevel,
          skills: selectedSkills,
        });
      }
    } catch (err) {
      console.warn('Profile update warning:', err);
    } finally {
      setSaving(false);
    }
    setActivePage('dashboard');
  };

  // Step Progress Calculation
  const progressPercent = (step / 5) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-10 space-y-8 backdrop-blur-xl relative">
        
        {/* =========================================================================
            HEADER & PROGRESS INDICATOR
           ========================================================================= */}
        <div className="space-y-4 pb-6 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Candidate Setup &bull; Step {step} of 5
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {step === 1 && 'What is your target role?'}
                  {step === 2 && 'What is your experience level?'}
                  {step === 3 && 'Select your key skills & stack'}
                  {step === 4 && 'What is your primary interview goal?'}
                  {step === 5 && 'Profile Summary & Ready to Practice'}
                </h1>
              </div>
            </div>

            {/* Step Counter Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {step === 1 && '1. Target Role'}
                {step === 2 && '2. Experience'}
                {step === 3 && '3. Skills Stack'}
                {step === 4 && '4. Interview Goals'}
                {step === 5 && '5. Final Review'}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Step {step} of 5</span>
              <span>{Math.round(progressPercent)}% completed</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STEP 1: TARGET ROLE
           ========================================================================= */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div>
              <p className="text-xs sm:text-sm text-slate-400">
                Choose the engineering position you're preparing for. We'll tailor Dr. Elena Vance's interview rubric and questions to match industry hiring bars.
              </p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {roleList.map((r) => {
                const Icon = r.icon;
                const isSelected = targetRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setTargetRole(r.id);
                      setShowCustomRoleInput(false);
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xl shadow-indigo-500/15'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${r.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Role Option */}
            <div className="pt-2">
              {!showCustomRoleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomRoleInput(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Don't see your specific role? Enter a custom title</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 max-w-md p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. AI Prompt Engineer, Site Reliability Engineer"
                    className="flex-1 bg-transparent border-none text-white text-xs px-2 focus:outline-none placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customRole.trim()) {
                        setTargetRole(customRole.trim());
                      }
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Set
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Button */}
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-2 px-7 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Continue to Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: EXPERIENCE LEVEL
           ========================================================================= */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div>
              <p className="text-xs sm:text-sm text-slate-400">
                Select your experience level so our AI interviewer calibrates question complexity, hint progression, and follow-up depth.
              </p>
            </div>

            {/* Experience Options */}
            <div className="space-y-3">
              {experienceOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = experienceLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExperienceLevel(opt.id)}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xl shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white shadow-md' : ''
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-sm sm:text-base text-white">{opt.title}</h3>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.sub}</p>
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          Focus: {opt.focus}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-2 px-7 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Continue to Skills Stack</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: SKILLS
           ========================================================================= */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div>
              <p className="text-xs sm:text-sm text-slate-400">
                Select your core technical competencies. The AI interviewer will generate questions evaluating these specific technologies.
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-xs font-semibold">Quick Presets:</span>
              <button
                type="button"
                onClick={() => applySkillPreset('frontend')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700"
              >
                Frontend Stack
              </button>
              <button
                type="button"
                onClick={() => applySkillPreset('backend')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700"
              >
                Backend Stack
              </button>
              <button
                type="button"
                onClick={() => applySkillPreset('campus')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700"
              >
                Campus Drive (DSA + CS)
              </button>
            </div>

            {/* Available Skills Badges */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Tap to toggle skills ({selectedSkills.length} selected):
              </label>

              <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                {availableSkills.map((sk) => {
                  const isChecked = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isChecked
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-400'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Skill Form */}
            <form onSubmit={handleAddCustomSkill} className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Add another skill or framework:</label>
              <div className="flex items-center space-x-2 max-w-md">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="e.g. Flutter, Kafka, AWS Lambda, GraphQL"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </form>

            {/* Selected Skills Chips */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">Your Current Selection:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-950/60 text-indigo-300 border border-indigo-800/40"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(sk)}
                      className="text-indigo-400 hover:text-rose-400 p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={selectedSkills.length === 0}
                className="flex items-center space-x-2 px-7 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
              >
                <span>Continue to Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: INTERVIEW GOALS
           ========================================================================= */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div>
              <p className="text-xs sm:text-sm text-slate-400">
                What is your primary reason for practicing today? We will adapt the interviewer's tone, pacing, and feedback focus to your goal.
              </p>
            </div>

            {/* Goal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goalOptions.map((g) => {
                const Icon = g.icon;
                const isSelected = interviewGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setInterviewGoal(g.id)}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xl shadow-indigo-500/15'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${g.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {g.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-white">
                        {g.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {g.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                      <span className={`font-semibold ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {isSelected ? 'Selected Goal' : 'Click to select'}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(5)}
                className="flex items-center space-x-2 px-7 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
              >
                <span>View Profile Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: PROFILE SUMMARY & START PRACTICING
           ========================================================================= */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div>
              <p className="text-xs sm:text-sm text-slate-400">
                Your personalized candidate profile is complete. Here is a summary of how your mock interview sessions will be calibrated.
              </p>
            </div>

            {/* Comprehensive Profile Summary Card */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              {/* Top Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg sm:text-xl font-extrabold text-white">
                        {user?.name || 'Engineer Candidate'}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Profile Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'Candidate Account'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  Edit details &rarr;
                </button>
              </div>

              {/* 3 Summary Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Target Role */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Target Role
                  </span>
                  <p className="font-bold text-sm text-white">{targetRole}</p>
                  <p className="text-[11px] text-indigo-400">Customized questions</p>
                </div>

                {/* Experience Level */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Experience Level
                  </span>
                  <p className="font-bold text-sm text-white">{experienceLevel}</p>
                  <p className="text-[11px] text-emerald-400">Calibrated difficulty</p>
                </div>

                {/* Primary Goal */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Primary Goal
                  </span>
                  <p className="font-bold text-sm text-white">{interviewGoal}</p>
                  <p className="text-[11px] text-cyan-400">Targeted rubric</p>
                </div>
              </div>

              {/* Selected Skills Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Active Stack & Skills ({selectedSkills.length} selected):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Interviewer Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 border border-indigo-800/40 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                    <Sparkle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Assigned Interviewer: Dr. Elena Vance</h4>
                    <p className="text-[11px] text-slate-400">
                      Equipped with speech synthesis, live code execution & STAR multi-pillar rubrics.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                  Ready to simulate
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Goals</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleGoDashboard}
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
                >
                  Go to Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleStartPracticing}
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Start Practicing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
