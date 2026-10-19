import React from 'react';
import { Play, Sparkles, Terminal, Users, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export const TrackRecommendations = ({ onSelectTrack }) => {
  const tracks = [
    {
      id: 'track_campus_fresher',
      title: 'Campus Placement / Fresher SDE',
      description: 'Master OOP principles, fundamental problem solving, and confidence building for campus drives.',
      role: 'Campus Fresher / General SDE',
      experienceLevel: 'Fresher / Entry Level',
      mode: 'technical',
      skills: ['OOP', 'Data Structures', 'Problem Solving', 'Basics'],
      icon: Terminal,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Most Popular for Freshers',
    },
    {
      id: 'track_frontend_react',
      title: 'Frontend Specialist (React & DOM)',
      description: 'Virtual DOM, React Hooks, rendering performance, state management, and modern CSS specificity.',
      role: 'Frontend Developer',
      experienceLevel: 'Junior (1-3 yrs)',
      mode: 'technical',
      skills: ['React', 'JavaScript', 'CSS', 'Performance'],
      icon: Sparkles,
      color: 'from-indigo-600 to-purple-600',
      tag: 'High Demand',
    },
    {
      id: 'track_behavioral_star',
      title: 'HR & Behavioral STAR Method',
      description: 'Perfect your storytelling for teamwork, conflict resolution, ownership, and quantifiable results.',
      role: 'All Roles',
      experienceLevel: 'Fresher / Entry Level',
      mode: 'behavioral',
      skills: ['STAR Method', 'Communication', 'Teamwork', 'Leadership'],
      icon: Users,
      color: 'from-amber-500 to-orange-600',
      tag: 'Critical for Final Rounds',
    },
    {
      id: 'track_fullstack_node',
      title: 'Full Stack Engineer (MERN & APIs)',
      description: 'REST architecture, JWT auth security, error middleware, and database schema tradeoffs.',
      role: 'Full Stack Developer',
      experienceLevel: 'Junior (1-3 yrs)',
      mode: 'mixed',
      skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
      icon: Cpu,
      color: 'from-cyan-500 to-blue-600',
      tag: 'Comprehensive SDE',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Recommended Interview Tracks</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-configured interview simulations tailored to current industry hiring bars.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <div
              key={track.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-xl flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${track.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/20">
                    {track.tag}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {track.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {track.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {track.skills.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onSelectTrack(track)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent transition-all"
                >
                  <span>Launch Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackRecommendations;
