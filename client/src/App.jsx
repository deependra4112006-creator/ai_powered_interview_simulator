import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import ActiveInterviewPage from './pages/ActiveInterviewPage';
import InterviewSummaryPage from './pages/InterviewSummaryPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';
import PracticeQuestionsPage from './pages/PracticeQuestionsPage';
import AICoachPage from './pages/AICoachPage';
import OnboardingPage from './pages/OnboardingPage';
import InterviewLobbyPage from './pages/InterviewLobbyPage';
import CodingInterviewPage from './pages/CodingInterviewPage';
import BehavioralInterviewPage from './pages/BehavioralInterviewPage';
import InterviewCompletionPage from './pages/InterviewCompletionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [activeSession, setActiveSession] = useState(null);
  const [prefilledSetupConfig, setPrefilledSetupConfig] = useState(null);

  const hasInitializedAuth = React.useRef(false);

  // Automatically switch away from landing if authenticated on initial load
  React.useEffect(() => {
    if (!loading) {
      if (!hasInitializedAuth.current) {
        hasInitializedAuth.current = true;
        if (isAuthenticated && activePage === 'landing') {
          setActivePage('dashboard');
        }
      } else if (!isAuthenticated && ['dashboard', 'setup', 'lobby', 'active', 'coding', 'behavioral', 'completion', 'summary', 'history', 'analytics', 'settings', 'profile', 'questions', 'coach', 'onboarding', 'admin'].includes(activePage)) {
        setActivePage('landing');
      }
    }
  }, [isAuthenticated, loading, activePage]);

  // When a track or recommendation is selected from dashboard
  const handleStartSessionWithConfig = (config) => {
    setPrefilledSetupConfig(config);
    setActivePage('setup');
  };

  // When a session is initiated in setup
  const handleSessionCreated = (session) => {
    setActiveSession(session);
    setActivePage('lobby');
  };

  // When an active session is finished
  const handleSessionCompleted = (session) => {
    setActiveSession(session);
    setActivePage('completion');
  };

  // When clicking a past session to inspect report or resume
  const handleSelectExistingSession = (session) => {
    setActiveSession(session);
    if (session.status === 'completed') {
      setActivePage('summary');
    } else {
      setActivePage('active');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors">
      {activePage !== 'dashboard' && <Navbar activePage={activePage} setActivePage={setActivePage} />}

      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            onStartSessionWithConfig={handleStartSessionWithConfig}
          />
        )}
        {activePage === 'login' && <LoginPage setActivePage={setActivePage} />}
        {activePage === 'register' && <RegisterPage setActivePage={setActivePage} />}
        {activePage === 'onboarding' && (
          <OnboardingPage
            setActivePage={setActivePage}
            onStartSessionWithConfig={handleStartSessionWithConfig}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            setActivePage={setActivePage}
            onStartSessionWithConfig={handleStartSessionWithConfig}
            onSelectExistingSession={handleSelectExistingSession}
          />
        )}

        {activePage === 'setup' && (
          <InterviewSetupPage
            onSessionCreated={handleSessionCreated}
            prefilledConfig={prefilledSetupConfig}
          />
        )}

        {activePage === 'lobby' && (
          <InterviewLobbyPage
            session={activeSession}
            onStartInterview={() => {
              if (activeSession?.interviewMode === 'coding') {
                setActivePage('coding');
              } else if (activeSession?.interviewMode === 'behavioral' || activeSession?.interviewMode === 'hr') {
                setActivePage('behavioral');
              } else {
                setActivePage('active');
              }
            }}
            onBack={() => setActivePage('setup')}
          />
        )}

        {activePage === 'active' && (
          <ActiveInterviewPage
            session={activeSession}
            onSessionCompleted={handleSessionCompleted}
            onExit={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'coding' && (
          <CodingInterviewPage
            session={activeSession}
            onSessionCompleted={handleSessionCompleted}
            onExit={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'behavioral' && (
          <BehavioralInterviewPage
            session={activeSession}
            onSessionCompleted={handleSessionCompleted}
            onExit={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'completion' && (
          <InterviewCompletionPage
            session={activeSession}
            onViewReport={() => setActivePage('summary')}
            onPracticeAgain={() => setActivePage('setup')}
            onGoDashboard={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'summary' && (
          <InterviewSummaryPage
            session={activeSession}
            onStartNew={() => setActivePage('setup')}
            onGoDashboard={() => setActivePage('dashboard')}
            onViewHistory={() => setActivePage('history')}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            onViewSession={handleSelectExistingSession}
            onStartNew={() => setActivePage('setup')}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage onStartNew={() => setActivePage('setup')} />
        )}

        {activePage === 'questions' && (
          <PracticeQuestionsPage
            onStartPracticeQuestion={(question) => {
              if (question.interviewType === 'Coding') {
                setActivePage('coding');
              } else if (question.interviewType === 'Behavioral' || question.interviewType === 'HR') {
                setActivePage('behavioral');
              } else {
                handleStartSessionWithConfig({
                  role: question.topic === 'System Design' ? 'Systems Architect' : `${question.topic} Engineer`,
                  difficulty: question.difficulty.toLowerCase(),
                  customTopics: [question.topic]
                });
              }
            }}
            onStartNew={() => setActivePage('setup')}
          />
        )}

        {activePage === 'profile' && (
          <UserProfilePage
            setActivePage={setActivePage}
            onStartNew={() => setActivePage('setup')}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            setActivePage={setActivePage}
            onStartNew={() => setActivePage('setup')}
          />
        )}

        {activePage === 'coach' && (
          <AICoachPage
            setActivePage={setActivePage}
            onStartNew={() => setActivePage('setup')}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage
            setActivePage={setActivePage}
            onStartNew={() => setActivePage('setup')}
          />
        )}
      </main>

      {/* Hide footer during active interview, coding workspace, behavioral round, completion screen, dashboard, lobby, and admin */}
      {!['active', 'coding', 'behavioral', 'completion', 'dashboard', 'lobby', 'admin'].includes(activePage) && <Footer setActivePage={setActivePage} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
