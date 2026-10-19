import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  PlayCircle,
  History,
  BarChart2,
  Settings,
  Menu,
  X,
  Code,
  Award,
  BookOpen,
  Bot,
  Shield,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, isAuthenticated, logout, guestLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'setup', label: 'Start Interview', icon: PlayCircle },
    { id: 'questions', label: 'Questions', icon: BookOpen },
    { id: 'coding', label: 'Coding', icon: Code },
    { id: 'behavioral', label: 'HR & Behavioral', icon: Award },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const landingNavItems = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'interview-types', label: 'Interview Types' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (activePage !== 'landing') {
      setActivePage('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = () => {
    if (activePage === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActivePage(isAuthenticated ? 'dashboard' : 'landing');
    }
  };

  const showLandingNav = !isAuthenticated || activePage === 'landing';

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
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

          {/* Desktop Navigation Links */}
          {showLandingNav ? (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {landingNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 transition-all ml-2"
                >
                  Dashboard &rarr;
                </button>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActivePage('landing')}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                Overview
              </button>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500"
                  />
                  <span className="text-sm font-medium pr-1 max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {user?.role || 'Job Seeker'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActivePage('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Candidate Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 text-left transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-indigo-400" />
                      <span>Admin Console</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        setActivePage('landing');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => guestLogin()}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 transition-colors"
                >
                  ⚡ Instant Demo
                </button>
                <button
                  onClick={() => setActivePage('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setActivePage('register')}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {showLandingNav && (
            <div className="space-y-1 pb-2 border-b border-slate-800">
              {landingNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {isAuthenticated ? (
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      activePage === item.id
                        ? 'bg-indigo-600/20 text-indigo-400'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setActivePage('settings');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                <Settings className="w-4 h-4" />
                <span>Profile & Settings</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-400 hover:bg-slate-800"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  setActivePage('landing');
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  guestLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-center"
              >
                ⚡ Instant Demo (Alex Chen)
              </button>
              <button
                onClick={() => {
                  setActivePage('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-200 text-center hover:bg-slate-700"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActivePage('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white text-center shadow-lg shadow-indigo-600/30"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
